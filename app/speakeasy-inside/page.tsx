"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import BillyDialog from "../components/BillyDialog";
import DialogBox from "../components/DialogBox";
import PositionedItem from "../components/PositionedItem";

export default function SpeakeasyInsidePage() {
  const router = useRouter();
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

  const showDialog = ({
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

  // Show Billy's introduction dialog on page load
  useEffect(() => {
    setDialog({
      text: "Whoa, this place is fancy! I wonder what secrets are hidden here...",
      isVisible: true,
      showBilly: true,
      showBackground: true,
      useTypewriter: true,
      speaker: "Billy",
      key: "intro",
    });
  }, []);

  const handleDismissZoom = () => {
    const wasNapkin = zoomedItem?.alt === "Napkin";
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
            <Image
              src={zoomedItem.src}
              alt={zoomedItem.alt}
              width={zoomedItem.alt === "Napkin" ? 352 : 176}
              height={zoomedItem.alt === "Napkin" ? 352 : 176}
              className={`h-auto w-auto object-contain ${
                zoomedItem.alt === "Napkin" ? "max-h-[352px] max-w-[352px]" : "max-h-44 max-w-44"
              }`}
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
          />
        </div>
      ) : null}

      {/* Clickable item overlays - only show when not zoomed */}
      {!zoomedItem ? (
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
              showDialog({
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
              showDialog({
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
              showDialog({
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
              showDialog({
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
            onDialogClick={() => {
              if (!showBrewsterChoice) {
                setDialog((current) => ({ ...current, isVisible: false }));
              }
            }}
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

    </main>
  );
}
