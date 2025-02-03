'use client';

import { useState } from 'react';

export default function ChatPage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);

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
