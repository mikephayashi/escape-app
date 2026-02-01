"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import BillyDialog from "../components/BillyDialog";
import PositionedItem from "../components/PositionedItem";

const dialogLines = [
  "A hidden speakeasy! This must be where they're hiding something...",
  "Look, there's a door. Let's see what's inside.",
];

export default function SpeakeasyEntrancePage() {
  const router = useRouter();
  // Wait for user interaction before starting typewriter to enable audio
  const [isReady, setIsReady] = useState(false);
  const [dialogIndex, setDialogIndex] = useState(0);
  const [dialogText, setDialogText] = useState("Tap to continue");
  const [useTypewriter, setUseTypewriter] = useState(false);
  const [isPromptComplete, setIsPromptComplete] = useState(false);
  const [isDialogComplete, setIsDialogComplete] = useState(false);

  const handleScreenTap = () => {
    // Handle initial tap to start the typewriter dialog with audio
    if (!isReady) {
      setIsReady(true);
      setDialogText(dialogLines[0]);
      setUseTypewriter(true);
      setIsPromptComplete(false);
      return;
    }

    if (dialogText) {
      if (!isPromptComplete) {
        return;
      }

      if (dialogIndex < dialogLines.length - 1) {
        const nextIndex = dialogIndex + 1;
        setDialogIndex(nextIndex);
        setDialogText(dialogLines[nextIndex]);
        setIsPromptComplete(false);
        return;
      }

      setDialogText("");
      setIsDialogComplete(true);
      return;
    }

    if (isDialogComplete) {
      router.push("/speakeasy-inside");
    }
  };

  return (
    <main className="screen-container game-wrapper" onPointerDown={handleScreenTap}>
      <div
        className="game-container bg-cover bg-center"
        style={{ backgroundImage: `url('/assets/scenes/speakeasy/speakeasy-entrance.png')` }}
      >
      <div className="pointer-events-none mx-auto flex h-full w-full max-w-md flex-col items-center overflow-y-auto px-4 pt-16">
        <BillyDialog
          text={dialogText}
          characterImageVisible={!!dialogText}
          isVisible={!!dialogText}
          showBackground={true}
          useTypewriter={useTypewriter}
          className="mt-6 max-w-sm"
          onComplete={() => setIsPromptComplete(true)}
        />
      </div>

      {/* Arrow indicator when dialog is complete */}
      {isDialogComplete && !dialogText ? (
        <div className="pointer-events-none absolute inset-0 z-20">
          <PositionedItem left="12%" top="40%" width="50%" aspectRatio="1 / 1">
            <Image
              src="/assets/scenes/museum/Arrow.png"
              alt="Entrance arrow"
              fill
              sizes="14vw"
              className="object-contain"
              style={{ transform: "rotate(0deg)" }}
              priority
            />
          </PositionedItem>
        </div>
      ) : null}
      </div>
    </main>
  );
}
