export default function Home() {
  return (
    <>
      <h1 className="text-4xl font-bold">Speech Recognition Chat</h1>
      <p className="text-lg">
        This is a demo app that implements voice recognition chat using SpeechRecognition (Web Speech API).
      </p>

      <div className="flex flex-col gap-4 w-full">
        <a href="/settings" className="text-lg font-bold text-purple-700">
          Go to Settings Page &rarr;
        </a>
        <a href="/chat" className="text-lg font-bold text-purple-700">
          Go to Chat Page &rarr;
        </a>
      </div>
    </>
  );
}
