'use client';

import { useEffect, useState } from 'react';
import { usePusher } from '@/app/hooks/usePusher';

export default function ChallengeOverlay() {
  const [isBlocking, setIsBlocking] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const { subscribe } = usePusher();

  useEffect(() => {
    // Listen for challenge start
    subscribe('start-challenge', () => {
      setIsBlocking(true);
      setShowMessage(true);
      
      // Hide the "Challenge started!" message after 3 seconds, but keep blocking
      setTimeout(() => {
        setShowMessage(false);
      }, 3000);
    });

    // Listen for challenge stop
    subscribe('stop-challenge', () => {
      setIsBlocking(false);
      setShowMessage(false);
    });
  }, [subscribe]);

  if (!isBlocking) return null;

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
