 "use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

function TypewriterText({
  text,
  intervalMs = 40,
}: {
  text: string;
  intervalMs?: number;
}) {
  const [visibleText, setVisibleText] = useState("");

  useEffect(() => {
    let index = 0;
    setVisibleText("");
    const timer = window.setInterval(() => {
      index += 1;
      setVisibleText(text.slice(0, index));
      if (index >= text.length) {
        window.clearInterval(timer);
      }
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [text, intervalMs]);

  return <span>{visibleText}</span>;
}

export default function IslandPage() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    const tryPlay = () => {
      audio.play().catch(() => {});
      window.removeEventListener("pointerdown", tryPlay);
      window.removeEventListener("keydown", tryPlay);
    };

    audio.play().catch(() => {});
    window.addEventListener("pointerdown", tryPlay);
    window.addEventListener("keydown", tryPlay);

    return () => {
      window.removeEventListener("pointerdown", tryPlay);
      window.removeEventListener("keydown", tryPlay);
    };
  }, []);

  return (
    <main
      className="min-h-screen w-full bg-cover bg-center"
      style={{ backgroundImage: "url('/island-background.png')" }}
    >
      <audio
        ref={audioRef}
        src="/Villager%20Talking%20Sound.m4a"
        preload="auto"
      />
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center px-4 pt-16">
        <Image
          src="/Billy.svg"
          alt="Billy"
          width={220}
          height={220}
          className="h-auto w-44"
          priority
        />
        <div className="relative mt-6 w-full max-w-sm">
          <Image
            src="/Text%20Background.svg"
            alt="Dialog background"
            width={360}
            height={210}
            className="h-auto w-full"
            priority
          />
          <div className="absolute left-[20px] top-[5px] flex h-8 w-24 items-center justify-center text-xs font-semibold text-white">
            Billy
          </div>
          <div className="absolute inset-0 flex items-center justify-center px-8 pt-6 text-center text-[20px] font-semibold text-[#808080]">
            <TypewriterText text="Welcome to Maui, Hawaii . . . What is your name?" />
          </div>
        </div>
      </div>
    </main>
  );
}

