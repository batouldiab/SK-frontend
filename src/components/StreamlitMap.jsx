import React, { useState } from 'react';

export default function StreamlitEmbed() {
  const [streamlitUrl, setStreamlitUrl] = useState('https://cities-skills-v2.streamlit.app/?embed=true');
  const [inputUrl, setInputUrl] = useState('');

  const handleUrlChange = () => {
    if (inputUrl.trim()) {
      setStreamlitUrl(inputUrl.trim());
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      {/*
      <div className="bg-white shadow-sm p-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-3">Streamlit App Embed</h1>
        
        <div className="flex gap-2">
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="Enter Streamlit app URL"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && handleUrlChange()}
          />
          <button
            onClick={handleUrlChange}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Load App
          </button>
        </div>
        
        <p className="text-sm text-gray-600 mt-2">
          Current URL: <span className="font-mono text-xs">{streamlitUrl}</span>
        </p>
      </div>
      */}

      <div className="flex-1 p-4">
        <iframe
          src={streamlitUrl}
          className="w-full h-full border-0 rounded-lg shadow-lg bg-white"
          title="Streamlit App"
        //   allow="camera; microphone; clipboard-write"
        //   sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-downloads"
        />
      </div>
    </div>
  );
}