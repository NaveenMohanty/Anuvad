let originalText = '';
let translatedText = '';
let isLiveMode = false;
let translationCache = {};

// UI Elements
const langSelect = document.getElementById('lang');
const originalTextDiv = document.getElementById('originalText');
const translatedTextDiv = document.getElementById('translatedText');
const applyBtn = document.getElementById('apply');
const resetBtn = document.getElementById('reset');
const statusDiv = document.getElementById('status');

// Listen for messages from Figma
onmessage = (event) => {
  const msg = event.data.pluginMessage;
  if (msg.type === 'show-text') {
    originalText = msg.text;
    originalTextDiv.innerText = originalText;
    updateTranslation();
  }
};

// Utility functions
function normalize(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ');
}

function showStatus(message, type = 'info') {
  statusDiv.textContent = message;
  statusDiv.className = `status ${type}`;
  statusDiv.style.display = 'block';
  setTimeout(() => {
    statusDiv.style.display = 'none';
  }, 3000);
}

// Translation functions
async function translateWithAPI(text, targetLang) {
  const cacheKey = `${text}_${targetLang}`;

  // Check cache first
  if (translationCache[cacheKey]) {
    return translationCache[cacheKey];
  }

  try {
    // Using MyMemory Translation API (free, no API key required)
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
        text
      )}&langpair=en|${targetLang}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.responseStatus === 200 && data.responseData.translatedText) {
      const translation = data.responseData.translatedText;

      // Cache the result
      translationCache[cacheKey] = translation;

      return translation;
    } else {
      throw new Error('Translation failed');
    }
  } catch (error) {
    console.error('Translation API error:', error);
    throw error;
  }
}

async function updateTranslation() {
  if (!originalText || originalText === 'No text selected') {
    translatedTextDiv.innerText = '—';
    applyBtn.disabled = true;
    return;
  }

  const targetLang = langSelect.value;

  // Live translation mode
  translatedTextDiv.innerText = 'Translating...';
  translatedTextDiv.classList.add('loading');
  applyBtn.disabled = true;

  try {
    const result = await translateWithAPI(originalText, targetLang);
    translatedText = result;
    translatedTextDiv.innerText = result;
    translatedTextDiv.classList.remove('loading', 'error');
    applyBtn.disabled = false;
    // showStatus("Translation completed!", "success");
  } catch (error) {
    translatedText = '';
    translatedTextDiv.innerText = '❌ Translation failed. Try hardcoded mode.';
    translatedTextDiv.classList.remove('loading');
    translatedTextDiv.classList.add('error');
    applyBtn.disabled = true;
    // showStatus("Translation failed. Check your internet connection.", "error");
  }
}

// Event listeners
langSelect.onchange = updateTranslation;

applyBtn.onclick = () => {
  if (translatedText) {
    parent.postMessage(
      {
        pluginMessage: {
          type: 'apply-text',
          text: translatedText,
        },
      },
      '*'
    );
  }
};

resetBtn.onclick = () => {
  parent.postMessage(
    {
      pluginMessage: {
        type: 'reset-text',
        text: originalText,
      },
    },
    '*'
  );
};

// Initialize
updateTranslation();
