"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import TypewriterText from "../components/TypewriterText";

const dialogLines = [
  "Oh do you have something for me? Wow a fossil!",
  "Here's a ticket to enter the art exhibit.",
];

export default function MuseumPage() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [backgroundImage, setBackgroundImage] = useState(
    "/pages/museum/museum-outside.png",
  );
  const [dialogIndex, setDialogIndex] = useState(0);
  const [dialogText, setDialogText] = useState("");
  const [isPromptComplete, setIsPromptComplete] = useState(false);
  const [isDialogComplete, setIsDialogComplete] = useState(false);
  const [stage, setStage] = useState<"outside" | "entrance" | "inside">(
    "outside",
  );
  const dialogImages: Record<number, string> = {
    0: "/pages/living-room/Fossil.png",
    1: "/pages/museum/Ticket.png",
  };

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


  const handleScreenTap = () => {
    if (stage === "inside") {
      return;
    }

    if (stage === "outside") {
      setStage("entrance");
      setBackgroundImage("/pages/museum/museum-entrance.png");
      setDialogIndex(0);
      setIsDialogComplete(false);
      setDialogText(dialogLines[0]);
      return;
    }

    if (stage === "entrance") {
      if (dialogText) {
        if (!isPromptComplete) {
          return;
        }

        if (dialogIndex < dialogLines.length - 1) {
          const nextIndex = dialogIndex + 1;
          setDialogIndex(nextIndex);
          setDialogText(dialogLines[nextIndex]);
          return;
        }

        setDialogText("");
        setIsDialogComplete(true);
        return;
      }

      if (isDialogComplete) {
        setStage("inside");
        setBackgroundImage("/pages/museum/museum-inside.png");
      }
    }
  };

  return (
    <main
      className="relative min-h-screen w-full bg-cover bg-center"
      style={{ backgroundImage: `url('${backgroundImage}')` }}
      onPointerDown={handleScreenTap}
    >
      <audio
        ref={audioRef}
        src="/shared/audio/Villager%20Talking%20Sound.m4a"
        preload="auto"
      />
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center px-4 pt-16">
        {stage === "entrance" && dialogText ? (
          <div
            className={`mb-4 flex w-full justify-center transition-opacity duration-500 ${
              dialogText ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={!dialogText}
          >
            <Image
              src={dialogImages[dialogIndex]}
              alt={dialogIndex === 0 ? "Fossil" : "Museum ticket"}
              width={240}
              height={240}
              className="h-auto w-40"
              priority
            />
          </div>
        ) : null}
        {false ? (
          <div
            className={`transition-opacity duration-500 ${
              dialogText ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={!dialogText}
          >
            <Image
              src="/shared/characters/Billy.svg"
              alt="Blathers"
              width={220}
              height={220}
              className="h-auto w-44"
              priority
            />
          </div>
        ) : null}
        <div
          className={`relative mt-6 w-full max-w-sm transition-opacity duration-500 ${
            dialogText ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden={!dialogText}
        >
          <Image
            src="/shared/ui/Text%20Background.svg"
            alt="Dialog background"
            width={360}
            height={210}
            className="h-auto w-full"
            priority
          />
          <div className="absolute left-[20px] top-[5px] flex h-8 w-24 items-center justify-center text-xs font-semibold text-white">
            Blathers
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
      {stage === "inside" ? (
        <Link
          href="/office"
          className="absolute bottom-6 right-6 bg-transparent px-4 py-2 text-5xl font-semibold text-white"
          style={{
            textShadow:
              "3px 3px 0 #B80B3F, -2px -2px 0 #E80E4F, 2px -2px 0 #E80E4F, -2px 2px 0 #E80E4F, 0 2px 0 #E80E4F, 2px 0 0 #E80E4F, -2px 0 0 #E80E4F, 0 -2px 0 #E80E4F",
          }}
        >
          Next
        </Link>
      ) : null}
      {stage === "entrance" && isDialogComplete && !dialogText ? (
        <div className="pointer-events-none absolute inset-0 z-20">
          <div
            className="absolute"
            style={{ left: "24%", top: "20%", width: "50%", aspectRatio: "1 / 1" }}
          >
            <Image
              src="/pages/museum/Arrow.png"
              alt="Entrance arrow"
              fill
              sizes="14vw"
              className="object-contain"
              style={{ transform: "rotate(90deg)" }}
              priority
            />
          </div>
        </div>
      ) : null}
    </main>
  );
}

