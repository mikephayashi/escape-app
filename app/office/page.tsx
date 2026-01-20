"use client";

import { useState } from "react";
import Image from "next/image";
import PositionedItem from "../components/PositionedItem";
import BillyDialog from "../components/BillyDialog";
import DialogBox from "../components/DialogBox";
import NextButton from "../components/NextButton";

export default function OfficePage() {
  const [dialog, setDialog] = useState({
    text: "",
    isVisible: false,
    showBilly: false,
    showBackground: true,
    useTypewriter: false,
    speaker: "",
    key: "",
  });
  const [zoomedItem, setZoomedItem] = useState<{
    src: string;
    alt: string;
    aspectRatio: string;
  } | null>(null);
  const [showLaptopChoice, setShowLaptopChoice] = useState(false);
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordSolved, setPasswordSolved] = useState(false);
  const [hintVisible, setHintVisible] = useState(false);
  const [currentChart, setCurrentChart] = useState<number | null>(null);
  const [showChartChoice, setShowChartChoice] = useState(false);
  const [chartsComplete, setChartsComplete] = useState(false);
  const [micInput, setMicInput] = useState("");
  const [micSolved, setMicSolved] = useState(false);

  const showDialogFn = ({
    key,
    text,
    showBilly = false,
    showBackground = true,
    useTypewriter = false,
    speaker = "",
  }: {
    key: string;
    text: string;
    showBilly?: boolean;
    showBackground?: boolean;
    useTypewriter?: boolean;
    speaker?: string;
  }) =>
    setDialog((current) =>
      current.isVisible && current.key === key
        ? { ...current, isVisible: false }
        : {
            text,
            isVisible: true,
            showBilly,
            showBackground,
            useTypewriter,
            speaker,
            key,
          },
    );

  const handleDismissZoom = () => {
    // Don't dismiss when viewing charts
    if (currentChart !== null) {
      return;
    }
    setDialog((current) => ({ ...current, isVisible: false }));
    setZoomedItem(null);
    setShowLaptopChoice(false);
    setShowPasswordInput(false);
    setHintVisible(false);
  };

  const handleDialogClick = () => {
    if (!showLaptopChoice) {
      setDialog((current) => ({ ...current, isVisible: false }));
    }
  };

  return (
    <main
      className="relative min-h-screen w-full bg-cover bg-center"
      style={{ backgroundImage: "url('/assets/scenes/office/Office%20empty.png')" }}
    >
      {/* Office items - display layer */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {/* Computer on desk */}
        <PositionedItem left="15%" top="55%" width="50%" aspectRatio="1024 / 1024">
          <Image
            src="/assets/scenes/office/Computer.png"
            alt="Computer"
            fill
            sizes="25vw"
            className="object-contain"
          />
        </PositionedItem>

        {/* Microphone on desk */}
        <PositionedItem left="25%" top="30%" width="70%" aspectRatio="1024 / 1024">
          <Image
            src="/assets/scenes/office/Microphone.png"
            alt="Microphone"
            fill
            sizes="18vw"
            className="object-contain"
          />
        </PositionedItem>

        {/* Drink on desk */}
        <PositionedItem left="60%" top="45%" width="45%" aspectRatio="1024 / 1024">
          <Image
            src="/assets/scenes/office/Drink.png"
            alt="Drink"
            fill
            sizes="15vw"
            className="object-contain"
          />
        </PositionedItem>
      </div>

      {/* Hint overlay background - shown when hint is visible */}
      {hintVisible && showPasswordInput ? (
        <div
          className="pointer-events-auto absolute inset-0 z-40 bg-black/50"
          onClick={() => setHintVisible(false)}
        />
      ) : null}

      {/* Dismiss overlay when item is zoomed */}
      {zoomedItem ? (
        <div
          className="pointer-events-auto absolute inset-0 z-[15] bg-black/40"
          onClick={handleDismissZoom}
        />
      ) : null}

      {/* Zoomed item display */}
      {zoomedItem ? (
        <div className="pointer-events-none absolute left-1/2 top-1/2 w-[90%] max-w-sm -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="flex justify-center">
            <Image
              src={
                zoomedItem.alt === "Microphone" && micSolved
                  ? "/assets/scenes/office/Isabelle.png"
                  : currentChart !== null
                    ? `/assets/scenes/office/${currentChart === 1 ? "1st" : currentChart === 2 ? "2nd" : currentChart === 3 ? "3rd" : "4th"}%20chart.svg`
                    : zoomedItem.alt === "Computer" && showPasswordInput
                      ? "/assets/scenes/office/Needs%20password.png"
                      : zoomedItem.src
              }
              alt={
                zoomedItem.alt === "Microphone" && micSolved
                  ? "Isabelle"
                  : currentChart !== null
                    ? `Chart ${currentChart}`
                    : zoomedItem.alt
              }
              width={176}
              height={176}
              className="h-auto max-h-44 w-auto max-w-44 object-contain"
              priority
            />
          </div>
          <DialogBox
            text={dialog.text}
            speaker={dialog.speaker}
            isVisible={dialog.isVisible}
            showBackground={dialog.showBackground}
            useTypewriter={dialog.useTypewriter}
            showOverlay={false}
            className="mt-4 max-w-sm"
            inputBox={
              zoomedItem?.alt === "Microphone"
                ? {
                    isVisible: !micSolved,
                    value: micInput,
                    onChange: setMicInput,
                    onSubmit: () => {
                      const trimmed = micInput.trim();
                      if (trimmed === "5375") {
                        setMicSolved(true);
                        setMicInput("");
                        showDialogFn({
                          key: "mic-correct",
                          text: "Oh, are you lost? I think Gulliver might be able to get you home. He should be on the beach.",
                          speaker: "Isabelle",
                        });
                        return true;
                      }
                      return false;
                    },
                    placeholder: "Enter code...",
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                    showSubmitButton: true,
                    submitButtonLabel: "Submit",
                    label: "Microphone code",
                  }
                : {
                    isVisible: showPasswordInput && !passwordSolved && currentChart === null,
                    value: passwordInput,
                    onChange: setPasswordInput,
                    onSubmit: () => {
                      const trimmed = passwordInput.trim();
                      if (trimmed === "3451") {
                        setPasswordSolved(true);
                        setPasswordInput("");
                        setCurrentChart(1);
                        setShowChartChoice(true);
                        showDialogFn({
                          key: "charts-intro",
                          text: "Look at laptop. These charts look important.",
                        });
                        return true;
                      }
                      return false;
                    },
                    placeholder: "Enter password",
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                    showSubmitButton: true,
                    submitButtonLabel: "Submit",
                    label: "Password",
                  }
            }
            choiceButtons={
              currentChart !== null && showChartChoice
                ? {
                    isVisible: true,
                    primaryLabel: currentChart === 4 ? "Move left" : "Move right",
                    secondaryLabel: currentChart === 1 || currentChart === 4 ? "Explore room" : "Move left",
                    onPrimaryClick: () => {
                      if (currentChart === 4) {
                        // Move left from chart 4
                        setCurrentChart(3);
                      } else {
                        // Move right
                        setCurrentChart(currentChart + 1);
                      }
                    },
                    onSecondaryClick: () => {
                      if (currentChart === 1 || currentChart === 4) {
                        // Explore room - exit chart viewing
                        setCurrentChart(null);
                        setShowChartChoice(false);
                        setChartsComplete(true);
                        setZoomedItem(null);
                        setDialog((current) => ({ ...current, isVisible: false }));
                      } else {
                        // Move left
                        setCurrentChart(currentChart - 1);
                      }
                    },
                  }
                : zoomedItem?.alt === "Computer" && !showPasswordInput
                  ? {
                      isVisible: showLaptopChoice,
                      primaryLabel: "Open",
                      secondaryLabel: "Explore more",
                      onPrimaryClick: () => {
                        setShowLaptopChoice(false);
                        setShowPasswordInput(true);
                        showDialogFn({
                          key: "password-prompt",
                          text: "The laptop needs a password to unlock.",
                        });
                      },
                      onSecondaryClick: () => {
                        setShowLaptopChoice(false);
                        setZoomedItem(null);
                        setDialog((current) => ({ ...current, isVisible: false }));
                      },
                    }
                  : undefined
            }
          />
        </div>
      ) : null}

      {/* Clickable item overlays - only show when not zoomed */}
      {!zoomedItem ? (
        <div className="absolute inset-0 z-10">
          {/* Computer button */}
          <PositionedItem
            as="button"
            type="button"
            aria-label="Computer"
            className="pointer-events-auto"
            left="15%"
            top="55%"
            width="50%"
            aspectRatio="1024 / 1024"
            onClick={() => {
              setZoomedItem({
                src: "/assets/scenes/office/Computer.png",
                alt: "Computer",
                aspectRatio: "1024 / 1024",
              });
              if (passwordSolved) {
                // If password already solved, go directly to charts
                setCurrentChart(1);
                setShowChartChoice(true);
                showDialogFn({
                  key: "charts-intro",
                  text: "Look at laptop. These charts look important.",
                });
              } else {
                showDialogFn({
                  key: "laptop",
                  text: "Look a laptop. What should we do with it?",
                });
                setShowLaptopChoice(true);
              }
            }}
          />

          {/* Microphone button */}
          <PositionedItem
            as="button"
            type="button"
            aria-label="Microphone"
            className="pointer-events-auto"
            left="25%"
            top="30%"
            width="70%"
            aspectRatio="1024 / 1024"
            onClick={() => {
              setZoomedItem({
                src: "/assets/scenes/office/Microphone.png",
                alt: "Microphone",
                aspectRatio: "1024 / 1024",
              });
              showDialogFn({
                key: "microphone",
                text: "A microphone ok...",
              });
            }}
          />

          {/* Drink button */}
          <PositionedItem
            as="button"
            type="button"
            aria-label="Drink"
            className="pointer-events-auto"
            left="60%"
            top="45%"
            width="45%"
            aspectRatio="1024 / 1024"
            onClick={() => {
              setZoomedItem({
                src: "/assets/scenes/office/Drink.png",
                alt: "Drink",
                aspectRatio: "1024 / 1024",
              });
              showDialogFn({
                key: "drink",
                text: "A cup of coke zero...I  much prefer lager",
              });
            }}
          />
        </div>
      ) : null}

      {/* Billy dialog with choice buttons for laptop */}
      {!zoomedItem ? (
        <div className="pointer-events-none relative z-20 mx-auto flex min-h-screen w-full max-w-md flex-col items-center px-4 pt-16">
          <BillyDialog
            text={dialog.text}
            characterImageVisible={dialog.showBilly && dialog.isVisible}
            isVisible={dialog.isVisible}
            showBackground={dialog.showBackground}
            useTypewriter={dialog.useTypewriter}
            className="mt-6 max-w-sm"
            onDialogClick={handleDialogClick}
          />
        </div>
      ) : null}

      {/* Hint button - shown when password input is visible */}
      {showPasswordInput && !passwordSolved ? (
        <PositionedItem
          left="0%"
          top="0%"
          width="30%"
          aspectRatio="1024 / 1536"
          className={`pointer-events-auto ${hintVisible ? "z-50" : "z-30"}`}
        >
          <button
            type="button"
            aria-label="Office hint"
            className="relative h-full w-full"
            onClick={() => setHintVisible((current) => !current)}
          >
            <Image
              src="/assets/scenes/living-room/Light%20Bulb.png"
              alt="Light bulb hint"
              fill
              sizes="30vw"
              className="object-contain"
              priority
            />
          </button>
          {hintVisible ? (
            <PositionedItem
              left="20%"
              top="0%"
              width="300%"
              aspectRatio="1024 / 1536"
              className="pointer-events-none z-50"
            >
              <Image
                src="/assets/scenes/office/Office%20Hint.svg"
                alt="Office hint"
                fill
                sizes="30vw"
                className="object-contain"
                priority
              />
            </PositionedItem>
          ) : null}
        </PositionedItem>
      ) : null}

      {/* Next Button - shown after mic is solved */}
      {micSolved ? (
        <>
          <div className="pointer-events-auto absolute inset-0 z-[25]" />
          <NextButton href="/gulliver" className="z-30" />
        </>
      ) : null}
    </main>
  );
}
