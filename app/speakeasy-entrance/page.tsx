"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import BillyDialog from "../components/BillyDialog";
import PositionedItem from "../components/PositionedItem";
import SceneContainer from "../components/SceneContainer";
import SceneLoader from "../components/SceneLoader";
import UserAvatar from "../components/UserAvatar";

// All images used in this scene for preloading
const SCENE_IMAGES = [
  "/assets/scenes/speakeasy/speakeasy-entrance.png",
  "/assets/scenes/museum/Arrow.png",
  "/assets/shared/characters/Billy.svg",
];

const dialogLines = [
  "A hidden speakeasy! This must be where they're hiding something...",
  "Look, there's a door. Let's see what's inside.",
];

export default function SpeakeasyEntrancePage() {
  const router = useRouter();
  const [dialogIndex, setDialogIndex] = useState(0);
  const [dialogText, setDialogText] = useState(dialogLines[0]);
  const [useTypewriter, setUseTypewriter] = useState(true);
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
    <SceneLoader images={SCENE_IMAGES}>
    <main className="screen-container" onPointerDown={handleScreenTap}>
      <UserAvatar />
      <SceneContainer
        backgroundSrc="/assets/scenes/speakeasy/speakeasy-entrance.png"
        backgroundAlt="Speakeasy entrance"
        aspectRatio={2 / 3}
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
      </SceneContainer>
    </main>
    </SceneLoader>
  );
}
