figma.showUI(__html__, { width: 300, height: 500 });

let selectedNodes = [];

function findTextNodes(node) {
    const textNodes = [];
    
    if (node.type === 'TEXT') {
        textNodes.push(node);
    } else if ('children' in node) {
        for (const child of node.children) {
            textNodes.push(...findTextNodes(child));
        }
    }
    
    return textNodes;
}

function updateSelection() {
    const selection = figma.currentPage.selection;
    console.log('Selection changed, length:', selection.length);
    
    if (selection.length === 0) {
        selectedNodes = [];
        figma.ui.postMessage({
            type: 'show-selection',
            selectionType: 'none'
        });
        return;
    }
    
    if (selection.length === 1) {
        const node = selection[0];
        console.log('Single node selected, type:', node.type);
        
        if (node.type === 'TEXT') {
            // Single text selected
            selectedNodes = [node];
            console.log('Text node selected:', node.characters);
            
            figma.ui.postMessage({
                type: 'show-selection',
                selectionType: 'text',
                text: node.characters,
                textCount: 1,
                allTexts: [node.characters]
            });
            
        } else if (node.type === 'FRAME' || node.type === 'GROUP' || node.type === 'COMPONENT' || node.type === 'INSTANCE' || 'children' in node) {
            // Frame or group selected - find all text nodes
            const textNodes = findTextNodes(node);
            selectedNodes = textNodes;
            
            console.log('Container selected, found text nodes:', textNodes.length);
            
            if (textNodes.length > 0) {
                const allTexts = textNodes.map(n => n.characters);
                console.log('All texts found:', allTexts);
                
                figma.ui.postMessage({
                    type: 'show-selection',
                    selectionType: 'frame',
                    text: allTexts[0],
                    textCount: textNodes.length,
                    frameName: node.name,
                    allTexts: allTexts
                });
            } else {
                selectedNodes = [];
                figma.ui.postMessage({
                    type: 'show-selection',
                    selectionType: 'empty',
                    frameName: node.name
                });
            }
        } else {
            selectedNodes = [];
            figma.ui.postMessage({
                type: 'show-selection',
                selectionType: 'other'
            });
        }
    } else {
        // Multiple nodes selected
        selectedNodes = [];
        let allTextNodes = [];
        
        for (const node of selection) {
            if (node.type === 'TEXT') {
                allTextNodes.push(node);
            } else if ('children' in node) {
                allTextNodes.push(...findTextNodes(node));
            }
        }
        
        if (allTextNodes.length > 0) {
            selectedNodes = allTextNodes;
            const allTexts = allTextNodes.map(n => n.characters);
            
            console.log('Multiple selection with text nodes:', allTextNodes.length);
            
            figma.ui.postMessage({
                type: 'show-selection',
                selectionType: 'frame',
                text: allTexts[0],
                textCount: allTextNodes.length,
                frameName: `${selection.length} items`,
                allTexts: allTexts
            });
        } else {
            figma.ui.postMessage({
                type: 'show-selection',
                selectionType: 'empty'
            });
        }
    }
}

// Listen for selection changes
figma.on('selectionchange', updateSelection);

// Initialize with current selection
updateSelection();

// Handle messages from UI
figma.ui.onmessage = async (msg) => {
    console.log('Received message:', msg.type);
    
    if (selectedNodes.length === 0) {
        figma.notify('Please select a text layer or frame containing text');
        return;
    }

    if (msg.type === 'apply-translations' && msg.translations) {
        console.log('Applying translations:', msg.translations.length);
        let success = 0;
        let errors = 0;
        
        for (let i = 0; i < selectedNodes.length && i < msg.translations.length; i++) {
            try {
                const node = selectedNodes[i];
                const translation = msg.translations[i];
                
                console.log(`Applying translation ${i + 1}:`, translation);
                
                // Load the font before changing text
                await figma.loadFontAsync(node.fontName);
                
                // Apply the translation
                node.characters = translation;
                success++;
                
            } catch (error) {
                console.error(`Error applying translation ${i + 1}:`, error);
                errors++;
            }
        }
        
        if (success > 0) {
            figma.notify(`Applied ${success} translation(s)${errors > 0 ? ` (${errors} failed)` : ''}`);
        } else {
            figma.notify('Failed to apply translations. Check font loading.');
        }
    }

    if (msg.type === 'reset-texts' && msg.originalTexts) {
        console.log('Resetting texts:', msg.originalTexts.length);
        let success = 0;
        let errors = 0;
        
        for (let i = 0; i < selectedNodes.length && i < msg.originalTexts.length; i++) {
            try {
                const node = selectedNodes[i];
                const originalText = msg.originalTexts[i];
                
                console.log(`Resetting text ${i + 1}:`, originalText);
                
                // Load the font before changing text
                await figma.loadFontAsync(node.fontName);
                
                // Reset to original text
                node.characters = originalText;
                success++;
                
            } catch (error) {
                console.error(`Error resetting text ${i + 1}:`, error);
                errors++;
            }
        }
        
        if (success > 0) {
            figma.notify(`Reset ${success} text layer(s)${errors > 0 ? ` (${errors} failed)` : ''}`);
        } else {
            figma.notify('Failed to reset texts. Check font loading.');
        }
    }
};