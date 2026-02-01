"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import DialogBox from "../components/DialogBox";
import PositionedItem from "../components/PositionedItem";

const dialogLines = [
  "Oh do you have something for me? Wow a fossil!",
  "Here's a ticket to enter the art exhibit.",
];

export default function MuseumEntrancePage() {
  const router = useRouter();
  const [backgroundImage, setBackgroundImage] = useState(
    "/assets/scenes/museum/museum-outside.png",
  );
  const [dialogIndex, setDialogIndex] = useState(0);
  const [dialogText, setDialogText] = useState("");
  const [isPromptComplete, setIsPromptComplete] = useState(false);
  const [isDialogComplete, setIsDialogComplete] = useState(false);
  const [stage, setStage] = useState<"outside" | "entrance">("outside");

  const dialogImages: Record<number, string> = {
    0: "/assets/scenes/living-room/Fossil.png",
    1: "/assets/scenes/museum/Ticket.png",
  };

  useEffect(() => {
    setIsPromptComplete(false);
  }, [dialogText]);

  const handleScreenTap = () => {
    if (stage === "outside") {
      setStage("entrance");
      setBackgroundImage("/assets/scenes/museum/museum-entrance.png");
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
        // Navigate to the museum inside page
        router.push("/museum");
      }
    }
  };

  return (
    <main
      className="screen-container relative bg-cover bg-center"
      style={{ backgroundImage: `url('${backgroundImage}')` }}
      onPointerDown={handleScreenTap}
    >
      <div className="mx-auto flex h-full w-full max-w-md flex-col items-center overflow-y-auto px-4 pt-16">
        <DialogBox
          text={dialogText}
          speaker="Blathers"
          className="mt-6 max-w-sm"
          onComplete={() => setIsPromptComplete(true)}
          characterImage={
            stage === "entrance" && dialogText
              ? {
                  src: dialogImages[dialogIndex],
                  alt: dialogIndex === 0 ? "Fossil" : "Museum ticket",
                  width: 240,
                  height: 240,
                  className: "h-auto w-40",
                  priority: true,
                }
              : undefined
          }
        />
      </div>

      {/* Arrow indicator when dialog is complete */}
      {stage === "entrance" && isDialogComplete && !dialogText ? (
        <div className="pointer-events-none absolute inset-0 z-20">
          <PositionedItem left="24%" top="20%" width="50%" aspectRatio="1 / 1">
            <Image
              src="/assets/scenes/museum/Arrow.png"
              alt="Entrance arrow"
              fill
              sizes="14vw"
              className="object-contain"
              style={{ transform: "rotate(90deg)" }}
              priority
            />
          </PositionedItem>
        </div>
      ) : null}
    </main>
  );
}
