document.addEventListener('DOMContentLoaded', function () {
  const textInput = document.getElementById('textInput');
  const voiceSelect = document.getElementById('voiceSelect');
  const pitchInput = document.getElementById('pitch');
  const rateInput = document.getElementById('rate');
  const speakButton = document.getElementById('speakButton');
  const stopButton = document.getElementById('stopButton');

  let voices = [];

  function populateVoices() {
    voices = speechSynthesis.getVoices();

    voiceSelect.innerHTML = '';

    // sort voices by language
    voices.sort((a, b) => a.lang.localeCompare(b.lang));

    // populate voice options
    voices.forEach((voice, index) => {
      const option = document.createElement('option');
      option.value = index;
      option.textContent = `(${voice.lang}) ${voice.name}`;
      voiceSelect.appendChild(option);
    });

    // select the voice that matches the current browser language
    const browserLanguage = navigator.language;
    const browserVoices = voices.filter((voice) => voice.lang === browserLanguage);
    const lastBrowserVoice = browserVoices.length > 0 ? browserVoices[browserVoices.length - 1] : null;
    const googleVoice = browserVoices.find((voice) => voice.name.includes('Googlㅇe'));
    const selectedVoice = googleVoice ? googleVoice : lastBrowserVoice ? lastBrowserVoice : voices[0];
    if (selectedVoice) {
      voiceSelect.value = voices.indexOf(selectedVoice);
    }
  }

  if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = populateVoices;
  }

  speakButton.addEventListener('click', function () {
    const text = textInput.value.trim();
    if (text === '') return;

    const utterance = new SpeechSynthesisUtterance(text);
    const selectedVoice = voices[voiceSelect.value];
    if (selectedVoice) utterance.voice = selectedVoice;

    utterance.pitch = pitchInput.value;
    utterance.rate = rateInput.value;

    speechSynthesis.speak(utterance);
  });

  stopButton.addEventListener('click', function () {
    speechSynthesis.cancel();
  });
});

// update current selected rate value
document.getElementById('rate').addEventListener('input', function () {
  document.getElementById('rate-value').textContent = this.value;
});

// update current selected pitch value
document.getElementById('pitch').addEventListener('input', function () {
  document.getElementById('pitch-value').textContent = this.value;
});
