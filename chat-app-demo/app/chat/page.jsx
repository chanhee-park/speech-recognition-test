'use client';

import { useState, useEffect } from 'react';

export default function ChatPage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);

  const recognizer = initSpeechRecognition();
  const starter = initStater();

  function handleMicClick() {
    setIsListening((prev) => !prev);
  }

  function handleSendClick() {
    if (input.trim() === '') {
      return;
    }

    setMessages((prev) => [...prev, input]);
    setInput('');
  }

  function initSpeechRecognition() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'ko-KR';
    let currentSpeechText = '';
    let onResultTimeout = null;

    recognition.onresult = (event) => {
      console.log('[recognizer] result', event);
      const result = event.results[event.results.length - 1];
      const transcript = result[0].transcript;
      currentSpeechText = transcript;

      if (result.isFinal) {
        clearTimeout(onResultTimeout);
        onResultTimeout = setTimeout(() => {
          addTextToInput(currentSpeechText);
          currentSpeechText = '';
        }, 100);
      }
    };

    return recognition;
  }

  function initStater() {
    const stater = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    stater.continuous = true;
    stater.interimResults = true;
    stater.lang = 'en-US';

    console.log(window.SpeechGrammarList);
    if (window.SpeechGrammarList) {
      const grammar = '#JSGF V1.0; grammar greeting; public <greeting> = hello brain;';
      const grammarList = new window.SpeechGrammarList();
      grammarList.addFromString(grammar);
      stater.grammars = grammarList;
    }

    stater.onresult = (event) => {
      const result = event.results[event.results.length - 1];
      const transcript = result[0].transcript;
      console.log('[starter] result', event, transcript);

      if (result.isFinal && isListening === false) {
        if (transcript.includes('hello') && transcript.includes('brain')) {
          setIsListening(true);
        }
      }
    };

    return stater;
  }

  function addTextToInput(text) {
    setInput((prev) => prev + ' ' + text + '.');
  }

  useEffect(() => {
    if (isListening) {
      recognizer.start();
    } else {
      recognizer.stop();
    }

    return () => {
      recognizer.stop();
    };
  }, [isListening]);

  useEffect(() => {
    if (starter !== undefined) {
      starter.start();
    }

    return () => {
      if (starter !== undefined) {
        starter.stop();
      }
    };
  }, []);

  return (
    <>
      <h1 className="text-4xl font-bold">Speech Recognition Chat</h1>
      <p className="text-lg">
        This is a demo app that implements voice recognition chat using SpeechRecognition (Web Speech API).
      </p>

      <div className="flex gap-4 w-full">
        <textarea
          className="w-full h-36 p-4 text-lg border border-gray-300 rounded-md"
          placeholder="Type your message here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <div className="flex gap-2">
          {isListening && <div className="w-8 h-8 bg-red-500 rounded-full animate-ping" />}
          <button className="px-6 py-2 text-lg font-bold text-white bg-purple-700 rounded-md" onClick={handleMicClick}>
            {isListening ? 'Stop' : 'Start'} Listening
          </button>
          <button className="px-6 py-2 text-lg font-bold text-white bg-purple-700 rounded-md" onClick={handleSendClick}>
            Send
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-8">
        {messages
          .slice(0)
          .reverse()
          .map((message, index) => (
            <div key={index} className="p-4 bg-gray-100 rounded-md w-max">
              {message}
            </div>
          ))}
      </div>
    </>
  );
}
