'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { usePusher } from '@/app/hooks/usePusher';

const CHALLENGE_STORAGE_KEY = 'escape-room-challenge-active';

export default function ChallengeOverlay() {
  const [isBlocking, setIsBlocking] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const pathname = usePathname();
  const { subscribe } = usePusher();

  // Check challenge state on mount (localStorage + server)
  useEffect(() => {
    // First check localStorage for instant restore
    const storedState = localStorage.getItem(CHALLENGE_STORAGE_KEY);
    if (storedState === 'true') {
      setIsBlocking(true);
      setShowMessage(false);
    }

    // Also check server state (handles new users who joined after challenge started)
    const checkServerState = async () => {
      try {
        const response = await fetch('/api/broadcast');
        if (response.ok) {
          const data = await response.json();
          if (data.challengeActive) {
            setIsBlocking(true);
            setShowMessage(false);
            localStorage.setItem(CHALLENGE_STORAGE_KEY, 'true');
          } else {
            // Server says no challenge - clear local state if it was stale
            localStorage.removeItem(CHALLENGE_STORAGE_KEY);
            setIsBlocking(false);
          }
        }
      } catch (error) {
        console.error('Failed to check challenge state:', error);
      }
    };

    checkServerState();
  }, []);

  useEffect(() => {
    // Listen for challenge start
    subscribe('start-challenge', () => {
      setIsBlocking(true);
      setShowMessage(true);
      localStorage.setItem(CHALLENGE_STORAGE_KEY, 'true');
      
      // Hide the "Challenge started!" message after 3 seconds, but keep blocking
      setTimeout(() => {
        setShowMessage(false);
      }, 3000);
    });

    // Listen for challenge stop
    subscribe('stop-challenge', () => {
      setIsBlocking(false);
      setShowMessage(false);
      localStorage.removeItem(CHALLENGE_STORAGE_KEY);
    });
  }, [subscribe]);

  // Don't show overlay on admin pages
  const isAdminPage = pathname?.startsWith('/admin');
  
  if (!isBlocking || isAdminPage) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center"
      style={{ touchAction: 'none' }}
      onClick={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
    >
      {showMessage ? (
        // Initial announcement
        <div className="text-center animate-pulse">
          <div className="text-6xl mb-6">🎯</div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Challenge Started!
          </h1>
          <p className="text-xl text-gray-300">
            Get ready...
          </p>
        </div>
      ) : (
        // Waiting state
        <div className="text-center">
          <div className="text-5xl mb-6 animate-bounce">⏳</div>
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-2">
            Challenge in Progress
          </h2>
          <p className="text-gray-400">
            Please wait for the host...
          </p>
        </div>
      )}
    </div>
  );
}
