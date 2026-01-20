"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import BillyDialog from "../components/BillyDialog";
import DialogBox from "../components/DialogBox";
import PositionedItem from "../components/PositionedItem";
import NextButton from "../components/NextButton";

function SpeakeasyInsideContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const wordyResult = searchParams.get("wordy"); // "won" | "lost" | null

  const [dialog, setDialog] = useState({
    text: "",
    isVisible: false,
    showBilly: false,
    showBackground: true,
    useTypewriter: false,
    speaker: "Billy",
    key: "intro",
  });
  const [zoomedItem, setZoomedItem] = useState<{
    src: string;
    alt: string;
    aspectRatio: string;
  } | null>(null);
  const [showBrewsterChoice, setShowBrewsterChoice] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);
  const [wordyHandled, setWordyHandled] = useState(false);
  // Lager drinking flow: "lager-dialog" → "lager-full" → "lager-empty" → "brewster-final"
  const [lagerStep, setLagerStep] = useState<"lager-dialog" | "lager-full" | "lager-empty" | "brewster-final" | null>(null);
  const [isFadingBeer, setIsFadingBeer] = useState(false);

  const showDialogFn = ({
    key,
    text,
    showBilly = true,
    showBackground = true,
    useTypewriter = true,
    speaker = "Billy",
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

  // Handle wordy result or show intro dialog
  useEffect(() => {
    if (wordyResult && !wordyHandled) {
      // Returning from wordy game - show Brewster's response
      const message =
        wordyResult === "won"
          ? "Oh a lager? Here."
          : "Ohh... Please leave. Ask someone else for what you need.";
      
      // If won, show the beer as a zoomed item and start lager flow
      if (wordyResult === "won") {
        setZoomedItem({
          src: "/assets/scenes/speakeasy/Beer.png",
          alt: "Lager",
          aspectRatio: "1024 / 1536",
        });
        setLagerStep("lager-dialog");
      }
      
      setDialog({
        text: message,
        isVisible: true,
        showBilly: false,
        showBackground: true,
        useTypewriter: true,
        speaker: "Brewster",
        key: "wordy-result",
      });
      setWordyHandled(true);
    } else if (!wordyResult) {
      // Normal page load - show Billy's intro
      setDialog({
        text: "Whoa, this place is fancy! I wonder what secrets are hidden here...",
        isVisible: true,
        showBilly: true,
        showBackground: true,
        useTypewriter: true,
        speaker: "Billy",
        key: "intro",
      });
    }
  }, [wordyResult, wordyHandled]);

  const handleDismissZoom = () => {
    const wasNapkin = zoomedItem?.alt === "Napkin";

    // Handle lager drinking flow
    if (lagerStep === "lager-dialog") {
      // Dismiss dialog, show large beer
      setDialog((current) => ({ ...current, isVisible: false }));
      setLagerStep("lager-full");
      return;
    }
    
    if (lagerStep === "lager-full" && !isFadingBeer) {
      // Start fade to empty beer
      setIsFadingBeer(true);
      // After 1 second (halfway through fade), swap the image
      setTimeout(() => {
        setZoomedItem({
          src: "/assets/scenes/speakeasy/Empty%20Beer.png",
          alt: "Empty Lager",
          aspectRatio: "1024 / 1536",
        });
      }, 1000);
      // After 2 seconds, complete the fade and move to next step
      setTimeout(() => {
        setIsFadingBeer(false);
        setLagerStep("lager-empty");
      }, 2000);
      return;
    }
    
    if (lagerStep === "lager-empty") {
      // Show Brewster's final message
      setDialog({
        text: "You should speak to Isabelle next. Tell her the password and she'll tell you more.",
        isVisible: true,
        showBilly: false,
        showBackground: true,
        useTypewriter: true,
        speaker: "Brewster",
        key: "brewster-final",
      });
      setLagerStep("brewster-final");
      return;
    }
    
    if (lagerStep === "brewster-final") {
      // Done with lager flow, show next button
      setDialog((current) => ({ ...current, isVisible: false }));
      setZoomedItem(null);
      setLagerStep(null);
      setShowNextButton(true);
      return;
    }

    // Normal dismiss logic (not in lager flow)
    setDialog((current) => ({ ...current, isVisible: false }));
    setZoomedItem(null);

    // After dismissing napkin, show Brewster's dialog
    if (wasNapkin) {
      setTimeout(() => {
        setDialog({
          text: "Do you want to play a game?",
          isVisible: true,
          showBilly: false,
          showBackground: true,
          useTypewriter: true,
          speaker: "Brewster",
          key: "brewster-choice",
        });
        setShowBrewsterChoice(true);
      }, 100);
    }
  };

  const handleDialogClick = () => {
    // If this is the wordy result dialog, show next button after dismissing
    if (dialog.key === "wordy-result") {
      setDialog((current) => ({ ...current, isVisible: false }));
      setShowNextButton(true);
    } else if (!showBrewsterChoice) {
      setDialog((current) => ({ ...current, isVisible: false }));
    }
  };

  return (
    <main
      className="relative min-h-screen w-full bg-cover bg-center"
      style={{ backgroundImage: `url('/assets/scenes/speakeasy/Speakeasy%20Empty.png')` }}
    >
      {/* Decorative items layer */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <PositionedItem left="25%" top="0%" width="40%" aspectRatio="1024 / 1536">
          <Image
            src="/assets/scenes/speakeasy/Light.png"
            alt="Light"
            fill
            sizes="25vw"
            className="object-contain"
            priority
          />
        </PositionedItem>
        <PositionedItem left="25%" top="50%" width="60%" aspectRatio="1024 / 1536">
          <Image
            src="/assets/scenes/speakeasy/Chair.png"
            alt="Chair"
            fill
            sizes="30vw"
            className="object-contain"
          />
        </PositionedItem>
        <PositionedItem left="20%" top="37%" width="30%" aspectRatio="1024 / 1536">
          <Image
            src="/assets/scenes/speakeasy/Beer.png"
            alt="Beer"
            fill
            sizes="20vw"
            className="object-contain"
          />
        </PositionedItem>
        <PositionedItem left="5%" top="42%" width="25%" aspectRatio="1024 / 1536">
          <Image
            src="/assets/scenes/speakeasy/Napkin.png"
            alt="Napkin"
            fill
            sizes="18vw"
            className="object-contain"
          />
        </PositionedItem>
      </div>

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
            <div className="relative">
              <Image
                src={zoomedItem.src}
                alt={zoomedItem.alt}
                width={
                  zoomedItem.alt === "Napkin" ? 352 :
                  (lagerStep === "lager-empty" || lagerStep === "lager-full") ? 240 : 176
                }
                height={
                  zoomedItem.alt === "Napkin" ? 352 :
                  (lagerStep === "lager-empty" || lagerStep === "lager-full") ? 360 : 176
                }
                className={`h-auto w-auto object-contain transition-opacity duration-[2000ms] ${
                  isFadingBeer ? "opacity-0" : "opacity-100"
                } ${
                  zoomedItem.alt === "Napkin" ? "max-h-[352px] max-w-[352px]" :
                  (lagerStep === "lager-empty" || lagerStep === "lager-full") ? "max-h-[360px] max-w-[240px]" :
                  "max-h-44 max-w-44"
                }`}
                priority
              />
              {/* Password on empty beer - fades in with the beer */}
              {(lagerStep === "lager-empty" || (lagerStep === "lager-full" && isFadingBeer)) && (
                <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-[2000ms] ${
                  isFadingBeer ? "opacity-0" : "opacity-100"
                }`}>
                  <span className="text-4xl font-bold text-[#E3DFD9]">3451</span>
                </div>
              )}
            </div>
          </div>
          <DialogBox
            text={dialog.text}
            speaker={dialog.speaker}
            isVisible={dialog.isVisible}
            showBackground={dialog.showBackground}
            useTypewriter={dialog.useTypewriter}
            showOverlay={false}
            className="mt-4 max-w-sm"
          />
        </div>
      ) : null}

      {/* Clickable item overlays - only show when not zoomed and no wordy result */}
      {!zoomedItem && !wordyResult ? (
        <div className="absolute inset-0 z-10">
          <PositionedItem
            as="button"
            type="button"
            aria-label="Light"
            className="pointer-events-auto"
            left="25%"
            top="0%"
            width="40%"
            aspectRatio="1024 / 1536"
            onClick={() => {
              setZoomedItem({
                src: "/assets/scenes/speakeasy/Light.png",
                alt: "Light",
                aspectRatio: "1024 / 1536",
              });
              showDialogFn({
                key: "light",
                text: "A fancy lamp. It gives the place a nice moody atmosphere.",
                showBilly: false,
                showBackground: true,
                useTypewriter: false,
                speaker: "",
              });
            }}
          />
          <PositionedItem
            as="button"
            type="button"
            aria-label="Chair"
            className="pointer-events-auto"
            left="25%"
            top="50%"
            width="60%"
            aspectRatio="1024 / 1536"
            onClick={() => {
              setZoomedItem({
                src: "/assets/scenes/speakeasy/Chair.png",
                alt: "Chair",
                aspectRatio: "1024 / 1536",
              });
              showDialogFn({
                key: "chair",
                text: "A comfy-looking chair. Perfect for sipping drinks and discussing secrets.",
                showBilly: false,
                showBackground: true,
                useTypewriter: false,
                speaker: "",
              });
            }}
          />
          <PositionedItem
            as="button"
            type="button"
            aria-label="Beer"
            className="pointer-events-auto"
            left="20%"
            top="37%"
            width="30%"
            aspectRatio="1024 / 1536"
            onClick={() => {
              setZoomedItem({
                src: "/assets/scenes/speakeasy/Beer.png",
                alt: "Beer",
                aspectRatio: "1024 / 1536",
              });
              showDialogFn({
                key: "beer",
                text: "A Hazy IPA. Tran's favorite. Yum.",
                showBilly: false,
                showBackground: true,
                useTypewriter: false,
                speaker: "",
              });
            }}
          />
          <PositionedItem
            as="button"
            type="button"
            aria-label="Napkin"
            className="pointer-events-auto"
            left="5%"
            top="42%"
            width="25%"
            aspectRatio="1024 / 1536"
            onClick={() => {
              // Show Sticky instead of Napkin when clicked
              setZoomedItem({
                src: "/assets/scenes/speakeasy/Sticky.png",
                alt: "Napkin",
                aspectRatio: "1024 / 1536",
              });
              showDialogFn({
                key: "napkin",
                text: "There's something written on this napkin...",
                showBilly: false,
                showBackground: true,
                useTypewriter: false,
                speaker: "",
              });
            }}
          />
        </div>
      ) : null}

      {/* Billy dialog for intro or Brewster dialog */}
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
            choiceButtons={{
              isVisible: showBrewsterChoice && dialog.isVisible && dialog.key === "brewster-choice",
              primaryLabel: "Play a game",
              secondaryLabel: "Explore more",
              onPrimaryClick: () => {
                router.push("/wordy");
              },
              onSecondaryClick: () => {
                // Dismiss and continue exploring
                setShowBrewsterChoice(false);
                setDialog((current) => ({ ...current, isVisible: false }));
              },
            }}
          />
        </div>
      ) : null}

      {/* Next Button - shown after wordy result dialog is dismissed */}
      <NextButton href="/office" isVisible={showNextButton} />

    </main>
  );
}

export default function SpeakeasyInsidePage() {
  return (
    <Suspense fallback={null}>
      <SpeakeasyInsideContent />
    </Suspense>
  );
}
