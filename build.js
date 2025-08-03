const fs = require('fs');
const path = require('path');

const projectRoot = __dirname; // Use the directory of the script as the root

const uiHtmlPath = path.join(projectRoot, 'ui.html'); 
const stylesCssPath = path.join(projectRoot, 'styles.css'); 
const scriptJsPath = path.join(projectRoot, 'script.js');
const codeJsPath = path.join(projectRoot, 'code.js'); 
const manifestJsonPath = path.join(projectRoot, 'manifest.json');
const distDir = path.join(projectRoot, 'dist');
const outputHtmlPath = path.join(distDir, 'ui.html');
const outputCodeJsPath = path.join(distDir, 'code.js');
const outputManifestPath = path.join(distDir, 'manifest.json');

// 1. Create dist directory if it doesn't exist
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

// 2. Read the source files
const uiHtmlContent = fs.readFileSync(uiHtmlPath, 'utf-8');
const stylesCssContent = fs.readFileSync(stylesCssPath, 'utf-8');
const scriptJsContent = fs.readFileSync(scriptJsPath, 'utf-8');

// 3. Inline the CSS and JS into the HTML by replacing the respective tags
const bundledHtml = uiHtmlContent
    .replace(
        '<link rel="stylesheet" href="styles.css">',
        `<style>\n${stylesCssContent}\n</style>`
    )
    .replace(
        '<script src="script.js"></script>',
        `<script>\n${scriptJsContent}\n</script>`
    );

// 4. Write the new, bundled HTML file to the dist directory
fs.writeFileSync(outputHtmlPath, bundledHtml); 

// 5. Copy code.js to the dist directory
fs.copyFileSync(codeJsPath, outputCodeJsPath);

// 6. Copy manifest.json to the dist directory
fs.copyFileSync(manifestJsonPath, outputManifestPath);

console.log('✅ Build successful! Plugin files are ready in dist/');