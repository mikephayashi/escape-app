"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import DialogBox, { DialogOverlay } from "../components/DialogBox";
import BillyDialog from "../components/BillyDialog";
import NextButton from "../components/NextButton";
import PositionedItem from "../components/PositionedItem";

export default function LivingRoomPage() {
  const [dialog, setDialog] = useState({
    text: "Find where someone might be hiding clues.",
    isVisible: true,
    showBilly: true,
    showBackground: true,
    useTypewriter: true,
    speaker: "Billy",
    key: "intro",
  });
  const [zoomedItem, setZoomedItem] = useState<{
    src: string;
    alt: string;
    aspectRatio: string;
  } | null>(null);
  const [safeInput, setSafeInput] = useState("");
  const [safeSolved, setSafeSolved] = useState(false);
  const [fossilRevealed, setFossilRevealed] = useState(false);
  const [livingRoomHintVisible, setLivingRoomHintVisible] = useState(false);

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

  useEffect(() => {
    if (!zoomedItem || zoomedItem.alt !== "Sticky note") {
      setLivingRoomHintVisible(false);
    }
  }, [zoomedItem]);

  return (
    <main
      className="relative min-h-screen w-full bg-cover bg-center"
      style={{ backgroundImage: "url('/assets/scenes/living-room/Living%20Room%20Empty.png')" }}
    >
      {livingRoomHintVisible && zoomedItem?.alt === "Sticky note" ? (
        <div
          className="pointer-events-auto absolute inset-0 z-40 bg-black/50"
          onClick={() => setLivingRoomHintVisible(false)}
        />
      ) : null}
      <div className="pointer-events-none absolute inset-0 z-0">
        <PositionedItem left="0%" top="0%" width="60%" aspectRatio="1536 / 1024">
          <Image
            src="/assets/scenes/living-room/Stanford%20Banner.png"
            alt="Stanford banner"
            fill
            sizes="100vw"
            className="object-contain"
            priority
          />
        </PositionedItem>
        <PositionedItem left="25%" top="16%" width="20%" aspectRatio="1024 / 1536">
          <Image
            src="/assets/scenes/living-room/Miffy.png"
            alt="Miffy poster"
            fill
            sizes="20vw"
            className="object-contain"
          />
        </PositionedItem>
        <PositionedItem left="75%" top="20%" width="30%" aspectRatio="1536 / 1024">
          <Image
            src="/assets/scenes/living-room/Checlist.png"
            alt="Checklist"
            fill
            sizes="22vw"
            className="object-contain"
          />
        </PositionedItem>
        <PositionedItem left="63%" top="20%" width="18%" aspectRatio="1024 / 1536">
          <Image
            src="/assets/scenes/living-room/Sticky%20Note.png"
            alt="Sticky note"
            fill
            sizes="18vw"
            className="object-contain"
          />
        </PositionedItem>
        <PositionedItem left="70%" top="31.5%" width="28%" aspectRatio="1024 / 1536">
          <Image
            src="/assets/scenes/living-room/Computer.png"
            alt="Computer"
            fill
            sizes="28vw"
            className="object-contain"
          />
        </PositionedItem>
        <PositionedItem left="0%" top="50%" width="34%" aspectRatio="1536 / 1024">
          <Image
            src="/assets/scenes/living-room/Books.png"
            alt="Books"
            fill
            sizes="34vw"
            className="object-contain"
          />
        </PositionedItem>
        <PositionedItem left="62%" top="48%" width="13%" aspectRatio="704 / 1472">
          <Image
            src="/assets/scenes/living-room/Safe.svg"
            alt="Safe"
            fill
            sizes="18vw"
            className="object-contain"
          />
        </PositionedItem>
      </div>
      {/* Dismiss overlay - blocks clicks to items below and dismisses on click */}
      {zoomedItem ? (
        <div
          className="pointer-events-auto absolute inset-0 z-[15] bg-black/40"
          onClick={() => {
            // When safe is solved but fossil not yet revealed, reveal fossil instead of dismissing
            if (safeSolved && !fossilRevealed) {
              setFossilRevealed(true);
              setZoomedItem({
                src: "/assets/scenes/living-room/Fossil.png",
                alt: "Fossil",
                aspectRatio: "1024 / 1024",
              });
              showDialog({
                key: "fossil",
                text: "Wow a fossil. We can give this to Blathers.",
                showBilly: false,
                showBackground: true,
                useTypewriter: false,
                speaker: "",
              });
              return;
            }
            setLivingRoomHintVisible(false);
            setDialog((current) => ({ ...current, isVisible: false }));
            setZoomedItem(null);
          }}
        />
      ) : null}
      {zoomedItem ? (
        <div
          className={`pointer-events-none absolute left-1/2 top-1/2 w-[90%] max-w-sm -translate-x-1/2 -translate-y-1/2 ${
            livingRoomHintVisible && zoomedItem.alt === "Sticky note" ? "z-30" : "z-20"
          }`}
        >
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
              isVisible: zoomedItem.alt === "Safe" && !safeSolved,
              value: safeInput,
              onChange: setSafeInput,
              onSubmit: () => {
                const trimmed = safeInput.trim();
                if (trimmed === "17") {
                  setSafeSolved(true);
                  setSafeInput("");
                  showDialog({
                    key: "safe-open",
                    text: "It's open now!",
                    showBilly: false,
                    showBackground: true,
                    useTypewriter: false,
                    speaker: "",
                  });
                  return true;
                }
                return false;
              },
              placeholder: "Enter code",
              inputMode: "numeric",
              pattern: "[0-9]*",
              showSubmitButton: true,
              submitButtonLabel: "Open",
              label: "Safe code",
            }}
          />
        </div>
      ) : null}
      {zoomedItem?.alt === "Sticky note" ? (
        <PositionedItem
          left="0%"
          top="0%"
          width="30%"
          aspectRatio="1024 / 1536"
          className={`pointer-events-auto ${livingRoomHintVisible ? "z-50" : "z-30"}`}
        >
          <button
            type="button"
            aria-label="Living room hint"
            className="relative h-full w-full"
            onClick={() => setLivingRoomHintVisible((current) => !current)}
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
          {livingRoomHintVisible ? (
            <PositionedItem
              left="20%"
              top="0%"
              width="300%"
              aspectRatio="1024 / 1536"
              className="pointer-events-none z-50"
            >
              <Image
                src="/assets/scenes/living-room/Living%20Room%20Hint.svg"
                alt="Living room hint"
                fill
                sizes="30vw"
                className="object-contain"
                priority
              />
            </PositionedItem>
          ) : null}
        </PositionedItem>
      ) : null}
      <div className="absolute inset-0 z-10">
        <PositionedItem
          as="button"
          type="button"
          aria-label="Miffy poster"
          className="pointer-events-auto"
          left="21%"
          top="13%"
          width="30%"
          aspectRatio="1024 / 1536"
          onClick={() => {
            setZoomedItem({
              src: "/assets/scenes/living-room/Miffy.png",
              alt: "Miffy poster",
              aspectRatio: "1024 / 1536",
            });
            showDialog({
              key: "miffy",
              text: "Image of Miffy. Looks cute though. Let’s look at more things in the room.",
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
          aria-label="Computer"
          className="pointer-events-auto"
          left="70%"
          top="31.5%"
          width="28%"
          aspectRatio="1024 / 1536"
          onClick={() => {
            setZoomedItem({
              src: "/assets/scenes/living-room/Computer.png",
              alt: "Computer",
              aspectRatio: "1024 / 1536",
            });
            showDialog({
              key: "computer",
              text: "A computer. Not important for this room. Maybe a different one.",
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
          aria-label="Books"
          className="pointer-events-auto"
          left="0%"
          top="50%"
          width="34%"
          aspectRatio="1536 / 1024"
          onClick={() => {
            setZoomedItem({
              src: "/assets/scenes/living-room/Books.png",
              alt: "Books",
              aspectRatio: "1536 / 1024",
            });
            showDialog({
              key: "books",
              text: "Some books. Looks pretty boring.",
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
          aria-label="Checklist"
          className="pointer-events-auto"
          left="78%"
          top="20%"
          width="22%"
          aspectRatio="1536 / 1024"
          onClick={() => {
            setZoomedItem({
              src: "/assets/scenes/living-room/Checlist.png",
              alt: "Checklist",
              aspectRatio: "1536 / 1024",
            });
            showDialog({
              key: "checklist",
              text: "A piece of paper. Just junk.",
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
          aria-label="Sticky note"
          className="pointer-events-auto"
          left="63%"
          top="20%"
          width="15%"
          aspectRatio="1024 / 1536"
          onClick={() => {
            setZoomedItem({
              src: "/assets/scenes/living-room/Sticky%20Note.png",
              alt: "Sticky note",
              aspectRatio: "1024 / 1536",
            });
            showDialog({
              key: "sticky-note",
              text: "An important note.  I wonder what this could mean. Keep looking for clues! ",
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
          aria-label="Stanford banner"
          className="pointer-events-auto"
          left="0%"
          top="0%"
          width="60%"
          aspectRatio="1536 / 1024"
          onClick={() => {
            setZoomedItem({
              src: "/assets/scenes/living-room/Stanford%20Banner.png",
              alt: "Stanford banner",
              aspectRatio: "1536 / 1024",
            });
            showDialog({
              key: "banner",
              text: "A Stanford banner. Cute. Go Cardinals I guess.",
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
          aria-label="Safe"
          className="pointer-events-auto"
          left="62%"
          top="48%"
          width="13%"
          aspectRatio="704 / 1472"
          onClick={() => {
            setZoomedItem({
              src: "/assets/scenes/living-room/Safe.svg",
              alt: "Safe",
              aspectRatio: "320 / 191",
            });
            showDialog({
              key: "safe",
              text: "A safe. It's locked tight.",
              showBilly: false,
              showBackground: true,
              useTypewriter: false,
              speaker: "",
            });
          }}
        />
      </div>
      {!zoomedItem ? (
        <div className="pointer-events-none relative z-20 mx-auto flex min-h-screen w-full max-w-md flex-col items-center px-4 pt-16">
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
      {fossilRevealed && !dialog.isVisible && dialog.key === "fossil" ? (
        <>
          {/* Overlay to block clicks on everything except the next button */}
          <div className="pointer-events-auto absolute inset-0 z-[25]" />
          <NextButton href="/museum" className="z-30" />
        </>
      ) : null}
    </main>
  );
}

