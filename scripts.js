// Check browser support
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;

// Populate browser info
const browserInfo = document.getElementById('browserInfo');
browserInfo.innerHTML = `
       <p>Browser: ${navigator.userAgent}</p>
       <p>Speech Recognition Support: ${SpeechRecognition ? '✅ Supported' : '❌ Not Supported'}</p>
       <p>Grammar List Support: ${SpeechGrammarList ? '✅ Supported' : '❌ Not Supported'}</p>
   `;

if (!SpeechRecognition) {
  alert('This browser does not support the Speech Recognition API.');
}

// Initialize recognition
const recognition = SpeechRecognition ? new SpeechRecognition() : null;
let timeoutId = null;

if (recognition) {
  // Get DOM elements
  const startButton = document.getElementById('startButton');
  const stopButton = document.getElementById('stopButton');
  const clearButton = document.getElementById('clearButton');
  const status = document.getElementById('status');
  const results = document.getElementById('results');

  // Config elements
  const languageSelect = document.getElementById('language');
  const continuousCheckbox = document.getElementById('continuous');
  const maxAlternativesInput = document.getElementById('maxAlternatives');
  const timeoutSelect = document.getElementById('timeout');
  const audioContextSelect = document.getElementById('audioContext');
  const autoRestartCheckbox = document.getElementById('autoRestart');

  // Apply configuration
  function applyConfig() {
    recognition.lang = languageSelect.value;
    recognition.continuous = continuousCheckbox.checked;
    recognition.interimResults = false; // Always false as per requirement
    recognition.maxAlternatives = parseInt(maxAlternativesInput.value);

    // Clear existing timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Set new timeout if not -1
    const timeoutValue = parseInt(timeoutSelect.value);
    if (timeoutValue > 0) {
      timeoutId = setTimeout(() => {
        recognition.stop();
        status.textContent = 'Recognition stopped due to timeout';
        status.className = 'mb-4 p-2 rounded bg-yellow-100 text-yellow-800';
      }, timeoutValue);
    }
  }

  // Event listeners for config changes
  const configElements = [
    languageSelect,
    continuousCheckbox,
    maxAlternativesInput,
    timeoutSelect,
    audioContextSelect,
    autoRestartCheckbox,
  ];
  configElements.forEach((element) => {
    element.addEventListener('change', applyConfig);
  });

  // Recognition event handlers
  recognition.onstart = () => {
    status.textContent = 'Recognition Started';
    status.className = 'mb-4 p-2 rounded bg-green-100 text-green-800';
    startButton.disabled = true;
    stopButton.disabled = false;
  };

  recognition.onend = () => {
    status.textContent = 'Recognition Ended';
    status.className = 'mb-4 p-2 rounded bg-yellow-100 text-yellow-800';
    startButton.disabled = false;
    stopButton.disabled = true;

    if (autoRestartCheckbox.checked) {
      recognition.start();
    }
  };

  recognition.onerror = (event) => {
    status.textContent = `Error: ${event.error}`;
    status.className = 'mb-4 p-2 rounded bg-red-100 text-red-800';
    startButton.disabled = false;
    stopButton.disabled = true;

    if (autoRestartCheckbox.checked && event.error !== 'aborted') {
      setTimeout(() => recognition.start(), 1000);
    }
  };

  recognition.onresult = (event) => {
    const result = event.results[event.results.length - 1];
    const resultItem = document.createElement('div');
    resultItem.className = 'result-item';

    const alternatives = Array.from(result)
      .map((alt, index) => `${index + 1}. ${alt.transcript} (Confidence: ${(alt.confidence * 100).toFixed(1)}%)`)
      .join('<br>');

    resultItem.innerHTML = `
               <div class="text-sm text-gray-500">
                   ${new Date().toLocaleTimeString()}
               </div>
               <div>${alternatives}</div>
           `;

    results.prepend(resultItem);
  };

  // Button event handlers
  startButton.addEventListener('click', () => {
    applyConfig();
    recognition.start();
  });

  stopButton.addEventListener('click', () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    recognition.stop();
  });

  clearButton.addEventListener('click', () => {
    results.innerHTML = '';
  });
}
