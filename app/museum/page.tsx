"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import DialogBox from "../components/DialogBox";
import BillyDialog from "../components/BillyDialog";
import PositionedItem from "../components/PositionedItem";
import NextButton from "../components/NextButton";
import SceneContainer from "../components/SceneContainer";
import SceneLoader from "../components/SceneLoader";
import UserAvatar from "../components/UserAvatar";

// All images used in this scene for preloading
const SCENE_IMAGES = [
  "/assets/scenes/museum/Museum%20Empty.png",
  "/assets/scenes/museum/Portrait1.png",
  "/assets/scenes/museum/Portrait2.png",
  "/assets/scenes/museum/Portrait3.png",
  "/assets/scenes/museum/Portrait4.png",
  "/assets/scenes/museum/Paper%20Trash.png",
  "/assets/scenes/museum/Letter%20Lock.png",
  "/assets/shared/characters/Billy.svg",
];

export default function MuseumPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [zoomedItem, setZoomedItem] = useState<{
    src: string;
    alt: string;
    aspectRatio: string;
  } | null>(null);
  const [dialog, setDialog] = useState({
    text: "Explore the exhibit. Maybe you'll find some clues . . .",
    isVisible: true,
    showBilly: true,
    showBackground: true,
    useTypewriter: true,
    speaker: "Billy",
    key: "intro",
  });
  const [lockInput, setLockInput] = useState("");
  const [lockSolved, setLockSolved] = useState(false);

  const showDialog = ({
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

  return (
    <SceneLoader images={SCENE_IMAGES}>
    <main className="screen-container">
      <UserAvatar />
      <SceneContainer
        backgroundSrc="/assets/scenes/museum/Museum%20Empty.png"
        backgroundAlt="Museum interior"
        aspectRatio={2 / 3}
      >
      {/* Museum inside - display layer for items */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {/* Portraits on the wall */}
        <PositionedItem left="5%" top="15%" width="18%" aspectRatio="1024 / 1536">
          <Image
            src="/assets/scenes/museum/Portrait1.png"
            alt="Portrait 1"
            fill
            sizes="18vw"
            className="object-contain"
          />
        </PositionedItem>
        <PositionedItem left="28%" top="15%" width="18%" aspectRatio="1024 / 1536">
          <Image
            src="/assets/scenes/museum/Portrait2.png"
            alt="Portrait 2"
            fill
            sizes="18vw"
            className="object-contain"
          />
        </PositionedItem>
        <PositionedItem left="51%" top="15%" width="18%" aspectRatio="1024 / 1536">
          <Image
            src="/assets/scenes/museum/Portrait3.png"
            alt="Portrait 3"
            fill
            sizes="18vw"
            className="object-contain"
          />
        </PositionedItem>
        <PositionedItem left="74%" top="15%" width="18%" aspectRatio="1024 / 1536">
          <Image
            src="/assets/scenes/museum/Portrait4.png"
            alt="Portrait 4"
            fill
            sizes="18vw"
            className="object-contain"
          />
        </PositionedItem>

        {/* Items on the table */}
        <PositionedItem left="75%" top="70%" width="25%" aspectRatio="1536 / 1024">
          <Image
            src="/assets/scenes/museum/Paper%20Trash.png"
            alt="Paper Trash"
            fill
            sizes="25vw"
            className="object-contain"
          />
        </PositionedItem>
        <PositionedItem left="55%" top="60%" width="25%" aspectRatio="1024 / 1536">
          <Image
            src="/assets/scenes/museum/Letter%20Lock.png"
            alt="Letter Lock"
            fill
            sizes="25vw"
            className="object-contain"
          />
        </PositionedItem>
      </div>

      {/* Dismiss overlay for zoomed item */}
      {zoomedItem ? (
        <div
          className="pointer-events-auto absolute inset-0 z-[15] bg-black/40"
          onClick={() => {
            setDialog((current) => ({ ...current, isVisible: false }));
            setZoomedItem(null);
          }}
        />
      ) : null}

      {/* Zoomed item display */}
      {zoomedItem ? (
        <div className="pointer-events-none absolute left-1/2 top-1/2 w-[90%] max-w-sm -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="flex justify-center">
            <Image
              src={zoomedItem.src}
              alt={zoomedItem.alt}
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
            inputBox={{
              isVisible: zoomedItem.alt === "Letter Lock" && !lockSolved,
              value: lockInput,
              onChange: setLockInput,
              onSubmit: () => {
                const trimmed = lockInput.trim().toLowerCase();
                if (trimmed === "brew") {
                  setLockSolved(true);
                  setLockInput("");
                  showDialog({
                    key: "lock-open",
                    text: "The lock clicks open!",
                  });
                  return true;
                }
                return false;
              },
              placeholder: "Enter code",
              showSubmitButton: true,
              submitButtonLabel: "Open",
              label: "Lock code",
            }}
          />
        </div>
      ) : null}

      {/* Museum inside - interactive layer for clickable items */}
      {!zoomedItem ? (
        <div className="absolute inset-0 z-10">
          {/* Portrait 1 button */}
          <PositionedItem
            as="button"
            type="button"
            aria-label="Portrait 1"
            className="pointer-events-auto"
            left="5%"
            top="15%"
            width="18%"
            aspectRatio="1024 / 1536"
            onClick={() => {
              setZoomedItem({
                src: "/assets/scenes/museum/Portrait1.png",
                alt: "Portrait 1",
                aspectRatio: "1024 / 1536",
              });
              showDialog({
                key: "portrait1",
                text: "A beautiful portrait. The subject looks quite distinguished.",
              });
            }}
          />
          {/* Portrait 2 button */}
          <PositionedItem
            as="button"
            type="button"
            aria-label="Portrait 2"
            className="pointer-events-auto"
            left="28%"
            top="15%"
            width="18%"
            aspectRatio="1024 / 1536"
            onClick={() => {
              setZoomedItem({
                src: "/assets/scenes/museum/Portrait2.png",
                alt: "Portrait 2",
                aspectRatio: "1024 / 1536",
              });
              showDialog({
                key: "portrait2",
                text: "Another lovely portrait. Such intricate detail.",
              });
            }}
          />
          {/* Portrait 3 button */}
          <PositionedItem
            as="button"
            type="button"
            aria-label="Portrait 3"
            className="pointer-events-auto"
            left="51%"
            top="15%"
            width="18%"
            aspectRatio="1024 / 1536"
            onClick={() => {
              setZoomedItem({
                src: "/assets/scenes/museum/Portrait3.png",
                alt: "Portrait 3",
                aspectRatio: "1024 / 1536",
              });
              showDialog({
                key: "portrait3",
                text: "This portrait seems to tell a story.",
              });
            }}
          />
          {/* Portrait 4 button */}
          <PositionedItem
            as="button"
            type="button"
            aria-label="Portrait 4"
            className="pointer-events-auto"
            left="74%"
            top="15%"
            width="18%"
            aspectRatio="1024 / 1536"
            onClick={() => {
              setZoomedItem({
                src: "/assets/scenes/museum/Portrait4.png",
                alt: "Portrait 4",
                aspectRatio: "1024 / 1536",
              });
              showDialog({
                key: "portrait4",
                text: "The final portrait in the collection. Magnificent!",
              });
            }}
          />
          {/* Paper Trash button */}
          <PositionedItem
            as="button"
            type="button"
            aria-label="Paper Trash"
            className="pointer-events-auto"
            left="75%"
            top="70%"
            width="25%"
            aspectRatio="1536 / 1024"
            onClick={() => {
              setZoomedItem({
                src: "/assets/scenes/museum/Paper%20Trash.png",
                alt: "Paper Trash",
                aspectRatio: "1536 / 1024",
              });
              showDialog({
                key: "paper-trash",
                text: "A crumpled piece of paper. It says A=1, B=2, C=3...",
              });
            }}
          />
          {/* Letter Lock button */}
          <PositionedItem
            as="button"
            type="button"
            aria-label="Letter Lock"
            className="pointer-events-auto"
            left="55%"
            top="55%"
            width="25%"
            aspectRatio="1024 / 1536"
            onClick={() => {
              setZoomedItem({
                src: "/assets/scenes/museum/Letter%20Lock.png",
                alt: "Letter Lock",
                aspectRatio: "1024 / 1536",
              });
              showDialog({
                key: "letter-lock",
                text: "A lock with letter dials. What could the combination be?",
              });
            }}
          />
        </div>
      ) : null}

      {/* Billy dialog for intro when no item is zoomed */}
      {!zoomedItem ? (
        <div className="pointer-events-none relative z-20 mx-auto flex h-full w-full max-w-md flex-col items-center overflow-y-auto px-4 pt-16">
          <BillyDialog
            text={dialog.text}
            characterImageVisible={dialog.showBilly && dialog.isVisible}
            isVisible={dialog.isVisible}
            showBackground={dialog.showBackground}
            useTypewriter={dialog.useTypewriter}
            className="mt-6 max-w-sm"
            onDialogClick={() => setDialog((current) => ({ ...current, isVisible: false }))}
          />
        </div>
      ) : null}

      {lockSolved && !dialog.isVisible && dialog.key === "lock-open" ? (
        <>
          {/* Overlay to block clicks on everything except the next button */}
          <div className="pointer-events-auto absolute inset-0 z-[25]" />
          <NextButton
            onClick={() => {
              setIsPlayingVideo(true);
              setTimeout(() => {
                videoRef.current?.play();
              }, 100);
            }}
            className="z-30"
          />
        </>
      ) : null}

      {/* Video overlay - plays call.mp4 before navigating to speakeasy entrance */}
      {isPlayingVideo && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black">
          <video
            ref={videoRef}
            src="/assets/videos/call.mp4"
            className="h-full w-full object-contain"
            onEnded={() => router.push("/speakeasy-entrance")}
            playsInline
            autoPlay
          />
        </div>
      )}
      </SceneContainer>
    </main>
    </SceneLoader>
  );
}
