'use client';

import { useState } from 'react';

export default function AdminPage() {
  const [status, setStatus] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [challengeActive, setChallengeActive] = useState(false);

  const broadcast = async (eventType: string) => {
    setIsLoading(true);
    setStatus('');
    
    try {
      const response = await fetch('/api/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventType }),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setStatus(`✅ ${eventType === 'start-challenge' ? 'Challenge Started' : 'Challenge Stopped'}`);
        setChallengeActive(eventType === 'start-challenge');
      } else {
        setStatus(`❌ Error: ${result.error}`);
      }
    } catch (error) {
      setStatus(`❌ Failed to send event`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-8">
      <div className="max-w-md w-full text-center">
        <h1 className="text-4xl font-bold mb-8">🎮 Admin</h1>

        {/* Status Message */}
        {status && (
          <div className="mb-8 p-4 rounded-lg bg-gray-800 text-lg">
            {status}
          </div>
        )}

        {/* Challenge indicator */}
        <div className="mb-8">
          <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
            challengeActive 
              ? 'bg-green-600 text-white' 
              : 'bg-gray-700 text-gray-300'
          }`}>
            {challengeActive ? '🟢 Challenge Active' : '⚪ Challenge Inactive'}
          </span>
        </div>

        {/* Two main buttons */}
        <div className="space-y-4">
          <button
            onClick={() => broadcast('start-challenge')}
            disabled={isLoading || challengeActive}
            className="w-full p-6 bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-2xl font-bold transition-all hover:scale-105"
          >
            ▶️ Start Challenge
          </button>
          
          <button
            onClick={() => broadcast('stop-challenge')}
            disabled={isLoading || !challengeActive}
            className="w-full p-6 bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-2xl font-bold transition-all hover:scale-105"
          >
            ⏹️ Stop Challenge
          </button>
        </div>

        {/* Info */}
        <p className="mt-8 text-gray-500 text-sm">
          Starting a challenge will block all player screens until stopped.
        </p>
      </div>
    </div>
  );
}
