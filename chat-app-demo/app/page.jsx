'use client';

import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const recognizerRef = useRef(null);
  const starterRef = useRef(null);
  const sendTimeout = useRef(null);

  function handleMicClick() {
    setIsListening((prev) => !prev);
  }

  function sendMessage() {
    const input = getInputText();
    console.log('[chat] send message:', input);
    if (!input || !input.trim()) {
      return;
    }
    setMessages((prev) => [...prev, input]);
    setInputText('');
  }

  function initSpeechRecognition() {
    if (recognizerRef.current) {
      return recognizerRef.current;
    }

    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'ko-KR';

    recognition.onresult = (event) => {
      const result = event.results[event.results.length - 1];
      const transcript = result[0].transcript;

      if (!result.isFinal) {
        console.log('[recognizer] interim:', transcript);
        return;
      }

      console.log('[recognizer] final:', transcript);
      addInputText(transcript);

      clearTimeout(sendTimeout.current);
      sendTimeout.current = setTimeout(() => {
        console.log('[recognizer] timeout -> send message');
        setIsListening(false);
        setTimeout(sendMessage, 500);
      }, 5000);
    };

    recognition.onend = () => {
      console.log('[recognizer] end');
      setIsListening(false);
    };

    recognizerRef.current = recognition;
    return recognition;
  }

  function initStarter() {
    if (starterRef.current) return starterRef.current;

    const stater = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    stater.continuous = true;
    stater.interimResults = true;
    stater.lang = 'en-US';

    stater.onresult = (event) => {
      const result = event.results[event.results.length - 1];
      const transcript = result[0].transcript.toLowerCase();

      if (!result.isFinal) {
        console.log('[starter] interim:', transcript);
        return;
      }

      console.log('[starter] final:', transcript);
      if (!isListening && transcript.includes('hello') && transcript.includes('brain')) {
        setIsListening(true);
      }
    };

    starterRef.current = stater;
    return stater;
  }

  function getInputText() {
    return document.getElementById('chat-input').value;
  }

  function setInputText(text) {
    document.getElementById('chat-input').value = text;
  }

  function addInputText(text) {
    const dom = document.getElementById('chat-input');
    const current = dom.value;
    dom.value = current + ' ' + text + '.';
  }

  useEffect(() => {
    const recognizer = initSpeechRecognition();
    if (isListening) recognizer.start();
    else recognizer.stop();

    return () => recognizer.stop();
  }, [isListening]);

  useEffect(() => {
    const starter = initStarter();
    starter.start();

    return () => starter.stop();
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
          id="chat-input"
        />
        <div className="flex gap-2">
          {isListening && <div className="w-8 h-8 bg-red-500 rounded-full animate-ping" />}
          <button className="px-6 py-2 text-lg font-bold text-white bg-purple-700 rounded-md" onClick={handleMicClick}>
            {isListening ? 'Stop' : 'Start'} Listening
          </button>
          <button className="px-6 py-2 text-lg font-bold text-white bg-purple-700 rounded-md" onClick={sendMessage}>
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
