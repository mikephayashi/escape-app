'use client';

import { useState, useEffect } from 'react';

const ADMIN_PASSWORD = 'Trichael123';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [status, setStatus] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [challengeActive, setChallengeActive] = useState(false);

  // Check if already authenticated (stored in sessionStorage)
  useEffect(() => {
    const stored = sessionStorage.getItem('admin-auth');
    if (stored === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin-auth', 'true');
      setPasswordError('');
    } else {
      setPasswordError('Incorrect password');
    }
  };

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
        setStatus(`❌ ${result.error}`);
      }
    } catch (error) {
      setStatus(`❌ Failed to send event`);
    } finally {
      setIsLoading(false);
    }
  };

  // Password screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-8">
        <div className="max-w-sm w-full">
          <h1 className="text-3xl font-bold mb-8 text-center">🔐 Admin Access</h1>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
                autoFocus
              />
              {passwordError && (
                <p className="mt-2 text-red-400 text-sm">{passwordError}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 rounded-xl font-bold text-gray-900 transition-colors"
            >
              Enter
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Admin panel
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

        {/* Logout button */}
        <button
          onClick={() => {
            sessionStorage.removeItem('admin-auth');
            setIsAuthenticated(false);
          }}
          className="mt-8 text-gray-500 text-sm hover:text-gray-300 underline"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
