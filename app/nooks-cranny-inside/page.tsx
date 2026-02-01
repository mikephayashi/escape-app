"use client";

import { useState } from "react";
import Image from "next/image";
import DialogBox from "../components/DialogBox";
import ChoiceButtons from "../components/ChoiceButtons";
import PositionedItem from "../components/PositionedItem";
import NextButton from "../components/NextButton";
import UserAvatar from "../components/UserAvatar";

type GamePhase = 
  | "exploring"
  | "computer-ask"
  | "computer-code"
  | "tom-nook"
  | "apple-reward"
  | "complete";

export default function NooksCrannyInsidePage() {
  const [zoomedItem, setZoomedItem] = useState<{
    src: string;
    alt: string;
    aspectRatio: string;
  } | null>(null);
  const [dialog, setDialog] = useState({
    text: "",
    isVisible: false,
    key: "",
  });
  const [gamePhase, setGamePhase] = useState<GamePhase>("exploring");
  const [passwordInput, setPasswordInput] = useState("");

  const showDialog = ({
    key,
    text,
  }: {
    key: string;
    text: string;
  }) =>
    setDialog({
      text,
      isVisible: true,
      key,
    });

  const handleItemClick = (item: { src: string; alt: string; aspectRatio: string }, dialogKey: string, dialogText: string) => {
    setZoomedItem(item);
    setGamePhase("exploring");
    showDialog({ key: dialogKey, text: dialogText });
  };

  const handleComputerClick = () => {
    setZoomedItem({
      src: "/assets/scenes/nooks-cranny/Computer.png",
      alt: "Computer",
      aspectRatio: "1024 / 1024",
    });
    showDialog({
      key: "computer-ask",
      text: "Oh! A computer. Should we look what's inside?",
    });
    setGamePhase("computer-ask");
  };

  const handleYesClick = () => {
    setZoomedItem({
      src: "/assets/scenes/nooks-cranny/PC-Zoomed-In.svg",
      alt: "Computer Code",
      aspectRatio: "1024 / 1024",
    });
    showDialog({
      key: "computer-code",
      text: "Hm there's some sort of code. Like Python or something. What should we do now?",
    });
    setGamePhase("computer-code");
  };

  const handleTalkToTomNook = () => {
    setZoomedItem({
      src: "/assets/scenes/nooks-cranny/TomNook.png",
      alt: "Tom Nook",
      aspectRatio: "1024 / 1024",
    });
    showDialog({
      key: "tom-nook",
      text: "Hey there! Got a password for me?",
    });
    setGamePhase("tom-nook");
    setPasswordInput("");
  };

  const handlePasswordSubmit = (): boolean => {
    const sanitized = passwordInput.trim().toLowerCase();
    if (sanitized === "pelican") {
      setZoomedItem({
        src: "/assets/scenes/nooks-cranny/Apple.png",
        alt: "Apple",
        aspectRatio: "1024 / 1024",
      });
      showDialog({
        key: "apple-reward",
        text: "Oh you got the password from the computer? Thanks! Here's an apple as a thanks.",
      });
      setGamePhase("apple-reward");
      setPasswordInput("");
      return true;
    }
    return false;
  };

  const dismissZoom = () => {
    setZoomedItem(null);
    setDialog((current) => ({ ...current, isVisible: false }));
    setGamePhase("exploring");
  };

  const handleAppleDismiss = () => {
    setZoomedItem(null);
    setDialog((current) => ({ ...current, isVisible: false }));
    setGamePhase("complete");
  };

  // Determine which choices to show based on game phase
  const showComputerAskChoices = gamePhase === "computer-ask";
  const showComputerCodeChoices = gamePhase === "computer-code";
  const showPasswordInput = gamePhase === "tom-nook";

  return (
    <main className="screen-container game-wrapper">
      <UserAvatar />
      <div
        className="game-container bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/scenes/nooks-cranny/Interior.png')" }}
      >
        {/* Background items layer - non-interactive */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <PositionedItem left="-10%" top="18%" width="60%" aspectRatio="1024 / 1024">
            <Image
              src="/assets/scenes/nooks-cranny/Weights.png"
              alt="Weights"
              fill
              sizes="28vw"
              className="object-contain"
              priority
            />
          </PositionedItem>
          <PositionedItem left="38%" top="25%" width="30%" aspectRatio="1024 / 1024">
            <Image
              src="/assets/scenes/nooks-cranny/Bear.png"
              alt="Pink Bear"
              fill
              sizes="20vw"
              className="object-contain"
            />
          </PositionedItem>
          <PositionedItem left="62%" top="25%" width="40%" aspectRatio="1024 / 1024">
            <Image
              src="/assets/scenes/nooks-cranny/Computer.png"
              alt="Computer"
              fill
              sizes="22vw"
              className="object-contain"
            />
          </PositionedItem>
          <PositionedItem left="51%" top="50%" width="45%" aspectRatio="1024 / 1024">
            <Image
              src="/assets/scenes/nooks-cranny/TomNook.png"
              alt="Tom Nook"
              fill
              sizes="18vw"
              className="object-contain"
            />
          </PositionedItem>
        </div>

        {/* Dismiss overlay when zoomed */}
        {zoomedItem ? (
          <div
            className="pointer-events-auto absolute inset-0 z-[15] bg-black/40"
            onClick={gamePhase === "apple-reward" ? handleAppleDismiss : dismissZoom}
          />
        ) : null}

        {/* Zoomed item view */}
        {zoomedItem ? (
          <div className={`pointer-events-none absolute left-1/2 top-1/2 w-[90%] -translate-x-1/2 -translate-y-1/2 z-20 ${gamePhase === "computer-code" ? "max-w-lg" : "max-w-sm"}`}>
            <div className="flex justify-center">
              <Image
                src={zoomedItem.src}
                alt={zoomedItem.alt}
                width={gamePhase === "computer-code" ? 352 : 176}
                height={gamePhase === "computer-code" ? 352 : 176}
                className={gamePhase === "computer-code" ? "w-[352px] h-[352px] object-contain" : "h-auto max-h-44 w-auto max-w-44 object-contain"}
                priority
              />
            </div>
            <DialogBox
              text={dialog.text}
              speaker=""
              isVisible={dialog.isVisible}
              showBackground={true}
              useTypewriter={false}
              showOverlay={false}
              className="mt-4 max-w-sm"
              inputBox={showPasswordInput ? {
                isVisible: true,
                value: passwordInput,
                onChange: setPasswordInput,
                onSubmit: handlePasswordSubmit,
                placeholder: "Enter password",
                inputMode: "text",
                showSubmitButton: true,
                submitButtonLabel: "Submit",
                label: "Password",
              } : undefined}
            />
            {/* Computer initial ask choices */}
            {showComputerAskChoices ? (
              <ChoiceButtons
                isVisible={true}
                primaryLabel="Yes"
                secondaryLabel="Explore more"
                onPrimaryClick={handleYesClick}
                onSecondaryClick={dismissZoom}
              />
            ) : null}
            {/* Computer code choices */}
            {showComputerCodeChoices ? (
              <ChoiceButtons
                isVisible={true}
                primaryLabel="Talk to Tom Nook"
                secondaryLabel="Keep exploring"
                onPrimaryClick={handleTalkToTomNook}
                onSecondaryClick={dismissZoom}
              />
            ) : null}
          </div>
        ) : null}

        {/* Clickable item buttons */}
        <div className="absolute inset-0 z-10">
          <PositionedItem
            as="button"
            type="button"
            aria-label="Weights"
            className="pointer-events-auto"
            left="-10%"
            top="18%"
            width="60%"
            aspectRatio="1024 / 1024"
            onClick={() =>
              handleItemClick(
                {
                  src: "/assets/scenes/nooks-cranny/Weights.png",
                  alt: "Weights",
                  aspectRatio: "1024 / 1024",
                },
                "weights",
                "Mike's favorite bench at IronWorks. Seems kinda interesting."
              )
            }
          />
          <PositionedItem
            as="button"
            type="button"
            aria-label="Pink Bear"
            className="pointer-events-auto"
            left="38%"
            top="25%"
            width="30%"
            aspectRatio="1024 / 1024"
            onClick={() =>
              handleItemClick(
                {
                  src: "/assets/scenes/nooks-cranny/Bear.png",
                  alt: "Pink Bear",
                  aspectRatio: "1024 / 1024",
                },
                "bear",
                "Tran and Mike's favorite stuffed animal. How cute."
              )
            }
          />
          <PositionedItem
            as="button"
            type="button"
            aria-label="Computer"
            className="pointer-events-auto"
            left="62%"
            top="25%"
            width="40%"
            aspectRatio="1024 / 1024"
            onClick={handleComputerClick}
          />
        </div>

        {/* Next button after completing the puzzle */}
        {gamePhase === "complete" ? (
          <NextButton href="/ending" isVisible={true} />
        ) : null}
      </div>
    </main>
  );
}
