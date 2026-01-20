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
  }, [text, intervalMs]);

  return <span>{visibleText}</span>;
}

export default function IslandPage() {
  const router = useRouter();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const [isPromptComplete, setIsPromptComplete] = useState(false);
  const [isNameInputVisible, setIsNameInputVisible] = useState(false);
  const [name, setName] = useState("");
  const [stage, setStage] = useState<"intro" | "wakeup" | "choices">("intro");
  const [dialogText, setDialogText] = useState(
    "Welcome to Maui, Hawaii . . . What is your name?",
  );
  const [backgroundImage] = useState("/island-background.png");
  const [isBillyVisible] = useState(true);

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
    const audio = audioRef.current;
    if (!audio || !dialogText) {
      return;
    }

    audio.currentTime = 0;
    audio.play().catch(() => {});
  }, [dialogText]);

  useEffect(() => {
    if (!isNameInputVisible) {
      return;
    }

    const focusInput = () => nameInputRef.current?.focus();
    const handle = window.requestAnimationFrame(focusInput);
    return () => window.cancelAnimationFrame(handle);
  }, [isNameInputVisible]);

  useEffect(() => {
    setIsPromptComplete(false);
  }, [dialogText]);

  const handleScreenTap = () => {
    if (!isPromptComplete) {
      return;
    }

    if (stage === "wakeup") {
      setStage("choices");
      setDialogText("Where do you want to go?");
      return;
    }

    if (stage !== "intro") {
      return;
    }

    if (!isNameInputVisible) {
      setIsNameInputVisible(true);
      return;
    }

    nameInputRef.current?.focus();
  };

  const submitName = () => {
    if (!name.trim()) {
      return;
    }

    setIsNameInputVisible(false);
    setDialogText("WAKE UP! We have to figure out where we are.");
    setStage("wakeup");
  };

  const handleNameKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      submitName();
    }
  };
  const handleNextClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    submitName();
  };

  const handleStayHereClick = () => {
    setDialogText('Loooool. Too bad. Choose "House."');
  };

  const handleHouseClick = () => {
    router.push("/house");
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
        <input
          ref={nameInputRef}
          value={name}
          onChange={(event) => setName(event.target.value)}
          onKeyDown={handleNameKeyDown}
          placeholder="Input name here..."
          className={`mt-6 w-full max-w-xs rounded-md border border-white/70 bg-white/90 px-4 py-2 text-center text-sm font-semibold text-[#808080] shadow-sm outline-none transition-opacity duration-500 focus:border-white ${
            isNameInputVisible ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          aria-hidden={!isNameInputVisible}
        />
        <div
          className={`mt-4 flex w-full items-center justify-center gap-4 transition-opacity duration-500 ${
            stage === "choices" ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          aria-hidden={stage !== "choices"}
        >
          <button
            type="button"
            className="min-w-[140px] rounded-full border-4 border-[#B58F63] bg-[#F8E6A1] px-6 py-2 text-lg font-semibold text-[#8B6B49] shadow-sm"
            onClick={handleHouseClick}
          >
            House.
          </button>
          <button
            type="button"
            className="min-w-[160px] rounded-full border-4 border-[#B58F63] bg-[#F8E6A1] px-6 py-2 text-lg font-semibold text-[#8B6B49] shadow-sm"
            onClick={handleStayHereClick}
          >
            Stay here.
          </button>
        </div>
      </div>
      <button
        type="button"
        onClick={handleNextClick}
        className={`absolute bottom-6 right-6 bg-transparent px-4 py-2 text-5xl font-semibold text-white transition-opacity duration-500 ${
          isNameInputVisible && stage === "intro"
            ? "opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        style={{
          textShadow:
            "3px 3px 0 #B80B3F, -2px -2px 0 #E80E4F, 2px -2px 0 #E80E4F, -2px 2px 0 #E80E4F, 0 2px 0 #E80E4F, 2px 0 0 #E80E4F, -2px 0 0 #E80E4F, 0 -2px 0 #E80E4F",
        }}
        aria-hidden={!isNameInputVisible || stage !== "intro"}
      >
        Next
      </button>
    </main>
  );
}

