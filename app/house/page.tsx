"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

function TypewriterText({
  text,
  intervalMs = 40,
  onComplete,
}: {
  text: string;
  intervalMs?: number;
  onComplete?: () => void;
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
        onComplete?.();
      }
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [text, intervalMs, onComplete]);

  return <span>{visibleText}</span>;
}

export default function HousePage() {
  const router = useRouter();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [backgroundImage, setBackgroundImage] = useState("/House.png");
  const [isBillyVisible, setIsBillyVisible] = useState(false);
  const [dialogText, setDialogText] = useState("");
  const [isPromptComplete, setIsPromptComplete] = useState(false);
  const [stage, setStage] = useState<"house" | "houseOpen">("house");

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

  useEffect(() => {
    if (!dialogText) {
      return;
    }

    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    audio.currentTime = 0;
    audio.play().catch(() => {});
  }, [dialogText]);

  useEffect(() => {
    setIsPromptComplete(false);
  }, [dialogText]);

  useEffect(() => {
    if (stage !== "house") {
      return;
    }

    const timer = window.setTimeout(() => {
      setIsBillyVisible(true);
      setDialogText("Explore the house");
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [stage]);

  const handleScreenTap = () => {
    if (stage === "houseOpen") {
      router.push("/living-room");
      return;
    }

    if (!isPromptComplete) {
      return;
    }

    setStage("houseOpen");
    setIsBillyVisible(false);
    setDialogText("");
    setBackgroundImage("/House%20Open.png");
  };

  return (
    <main
      className="min-h-screen w-full bg-cover bg-center"
      style={{ backgroundImage: `url('${backgroundImage}')` }}
      onPointerDown={handleScreenTap}
    >
      <audio
        ref={audioRef}
        src="/Villager%20Talking%20Sound.m4a"
        preload="auto"
      />
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center px-4 pt-16">
        <div
          className={`transition-opacity duration-500 ${
            isBillyVisible ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden={!isBillyVisible}
        >
          <Image
            src="/Billy.svg"
            alt="Billy"
            width={220}
            height={220}
            className="h-auto w-44"
            priority
          />
        </div>
        <div
          className={`relative mt-6 w-full max-w-sm transition-opacity duration-500 ${
            dialogText ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden={!dialogText}
        >
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
            {dialogText ? (
              <TypewriterText
                text={dialogText}
                onComplete={() => setIsPromptComplete(true)}
              />
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
}

