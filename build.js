const fs = require('fs');
const path = require('path');

console.log('Building minimal plugin...');

// Create dist directory
const distDir = './dist';
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
}

// Copy files
try {
    // Copy code.js
    fs.copyFileSync('./code.js', './dist/code.js');
    console.log('Copied code.js');

    // Copy ui.html  
    fs.copyFileSync('./ui.html', './dist/ui.html');
    console.log('Copied ui.html');

    // Copy manifest.json
    fs.copyFileSync('./manifest.json', './dist/manifest.json');
    console.log('Copied manifest.json');

    console.log('Build complete! Files in dist/ folder:');
    console.log('- code.js');
    console.log('- ui.html'); 
    console.log('- manifest.json');
    
} catch (error) {
    console.error('Build failed:', error);
}