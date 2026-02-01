"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [audioAcknowledged, setAudioAcknowledged] = useState(false);

  return (
    <main
      className="screen-container relative flex items-end justify-center bg-cover bg-center pb-6"
      style={{
        backgroundImage: "url('/assets/shared/backgrounds/island-background.png')",
      }}
    >
      {/* Audio Prompt Overlay */}
      {!audioAcknowledged && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70">
          <div
            className="mx-4 max-w-md rounded-3xl border-4 border-amber-800 bg-amber-50 p-8 text-center shadow-2xl"
            style={{ fontFamily: "FinkHeavy, sans-serif" }}
          >
            {/* Icons */}
            <div className="mb-4 text-5xl">🔊 🧭</div>
            
            <h2 className="mb-4 text-2xl text-amber-900">
              Before You Play!
            </h2>
            
            <div className="mb-6 space-y-4 text-lg text-amber-800">
              <p>
                <span className="font-bold">🔊 Turn on your sound!</span>
                <br />
                This game includes audio for the best experience.
              </p>
              <p>
                <span className="font-bold">🧭 Use Safari if possible!</span>
                <br />
                For the best experience on iPhone or iPad, please open this game in Safari.
              </p>
            </div>
            
            <button
              onClick={() => setAudioAcknowledged(true)}
              className="rounded-full bg-green-600 px-8 py-3 text-xl text-white shadow-lg transition-all hover:scale-105 hover:bg-green-500 active:scale-95"
            >
              Got it!
            </button>
          </div>
        </div>
      )}

      {/* Start Button - only clickable after audio acknowledged */}
      <Link 
        href="/island"
        className={!audioAcknowledged ? "pointer-events-none opacity-50" : ""}
      >
        <Image
          src="/assets/shared/ui/Start%20Button.svg"
          alt="Start Game"
          width={600}
          height={200}
          priority
        />
      </Link>
    </main>
  );
}
