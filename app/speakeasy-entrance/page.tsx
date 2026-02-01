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
  const [dialogIndex, setDialogIndex] = useState(0);
  const [dialogText, setDialogText] = useState(dialogLines[0]);
  const [isPromptComplete, setIsPromptComplete] = useState(false);
  const [isDialogComplete, setIsDialogComplete] = useState(false);

  const handleScreenTap = () => {
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
    <main
      className="screen-container relative bg-cover bg-center"
      style={{ backgroundImage: `url('/assets/scenes/speakeasy/speakeasy-entrance.png')` }}
      onPointerDown={handleScreenTap}
    >
      <div className="pointer-events-none mx-auto flex h-full w-full max-w-md flex-col items-center overflow-y-auto px-4 pt-16">
        <BillyDialog
          text={dialogText}
          characterImageVisible={!!dialogText}
          isVisible={!!dialogText}
          showBackground={true}
          useTypewriter={true}
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
    </main>
  );
}
