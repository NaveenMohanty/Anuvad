figma.showUI(__html__, { width: 300, height: 500 });

function updateUIWithSelection() {
  const selection = figma.currentPage.selection;
  if (selection.length === 1 && selection[0].type === 'TEXT') {
    const textNode = selection[0];
    // When a new text node is selected, send its content to the UI.
    figma.ui.postMessage({ type: 'show-text', text: textNode.characters });
  } else {
    // Handle cases with no selection or non-text selection.
    figma.ui.postMessage({ type: 'show-text', text: 'No text selected' });
  }
}

// Listen for selection changes on the Figma canvas.
figma.on('selectionchange', updateUIWithSelection);

// Also, run it once when the plugin starts to get the initial selection.
updateUIWithSelection();

figma.ui.onmessage = async (msg) => {
  const selection = figma.currentPage.selection;

  // For actions that modify text, we must have a single text layer selected.
  if (selection.length !== 1 || selection[0].type !== 'TEXT') {
    figma.notify('⚠️ Please select a single text layer to apply changes.');
    return;
  }

  const textNode = selection[0];

  // Helper function to apply text changes to the selected node.
  const applyChanges = async (newText) => {
    try {
      // It's crucial to load the font before changing the characters.
      await figma.loadFontAsync(textNode.fontName);
      textNode.characters = newText;
      return true; // Indicate success
    } catch (error) {
      console.error('Font/Text application error:', error);
      return false; // Indicate failure
    }
  };

  if (msg.type === 'apply-text') {
    if (msg.text && msg.text.trim() !== '') {
      const success = await applyChanges(msg.text);
      if (success) {
        figma.notify('✅ Translation applied successfully!');
      } else {
        figma.notify('❌ Failed to apply translation. The font might not support this language.');
      }
    } else {
      figma.notify('❌ No valid translation found to apply.');
    }
  }

  if (msg.type === 'reset-text') {
    // The UI sends back the original text in msg.text
    const success = await applyChanges(msg.text);
    if (success) {
      figma.notify('🔄 Text reset to original.');
    } else {
      figma.notify('❌ Failed to reset text.');
    }
  }
};
