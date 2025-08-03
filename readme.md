# Anuvad Figma Plugin

A Figma plugin that allows you to select a text layer and instantly preview how it would look when translated into various Indic languages. You can then apply the translated text back to your design with a single click.

This is perfect for designers working on multilingual applications who need to quickly check how text fits and appears in different scripts without leaving Figma.

## Features

*   **Live Translation Preview**: See translations for your selected text in real-time.
*   **Multiple Language Support**: Supports a wide range of Indic languages, including Hindi, Tamil, Bengali, Odia, and more.
*   **One-Click Apply**: Update the text layer on your canvas with the translated text instantly.
*   **Revert to Original**: Easily reset the text back to its original content.
*   **Seamless Integration**: The plugin automatically detects the text layer you have selected.
*   **Simple Build Process**: Uses `nodemon` for a live-reloading development environment.

## How It Works

1.  **Select a text layer** in your Figma file.
2.  Open the **Indic Text Previewer** plugin.
3.  The plugin automatically fetches and displays the original text.
4.  **Choose a target language** from the dropdown menu.
5.  The plugin will show a live preview of the translated text.
6.  Click **"Apply Translation"** to update the text layer on your canvas.
7.  Click **"← Back to Original"** to revert the changes at any time.

---

## Local Development Setup

Follow these instructions to run the plugin on your local machine for development.

### Prerequisites

*   You must have the Figma Desktop App installed.
*   You need Node.js (which includes `npm`) installed on your system.

### 1. Installation

First, clone the repository to your local machine and navigate into the project directory.

```bash
# Clone the repository (replace with your own URL if needed)
git clone https://github.com/NaveenMohanty/Anuvad

# Navigate into the project directory
cd Anuvad
```

Next, install the necessary development dependencies.

```bash
npm install
```

### 2. Running the Plugin

Start the development server. This command will automatically build the plugin into the `dist/` folder and watch for any file changes. If you edit and save a source file, the plugin will be rebuilt automatically.

```bash
npm run dev
```

Keep this terminal window open while you are developing.

### 3. Loading in Figma

1.  Open the **Figma desktop app**.
2.  Navigate to any design file.
3.  Go to the main menu and select `Plugins` > `Development` > `Import plugin from manifest...`.
4.  A file dialog will open. Navigate to your project folder and select the `dist/manifest.json` file.
5.  Figma will confirm that the plugin has been imported.

The plugin will now be available to run from the `Plugins` > `Development` > `Indic Text Previewer` menu.

---

## Project Structure

*   `code.js`: The main plugin logic that interacts with the Figma API (runs in the background).
*   `ui.html`, `styles.css`, `script.js`: The source files for the plugin's user interface.
*   `manifest.json`: The plugin's manifest file, which describes its properties to Figma.
*   `build.js`: A simple Node.js script that bundles the UI files and copies all necessary files into the `dist` directory.
*   `package.json`: Defines the project's scripts and dependencies.
*   `dist/`: The output directory containing the final, distributable plugin files. **This is the folder that Figma uses.**

