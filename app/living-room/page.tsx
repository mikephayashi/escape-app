"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import TypewriterText from "../components/TypewriterText";

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

  const renderDialog = (className: string) => (
    <div
      className={`relative w-full transition-opacity duration-500 ${
        dialog.isVisible ? "opacity-100" : "opacity-0"
      } ${className}`}
      aria-hidden={!dialog.isVisible}
    >
      {dialog.showBackground ? (
        <>
          <Image
            src="/shared/ui/Text%20Background.svg"
            alt="Dialog background"
            width={360}
            height={210}
            className="h-auto w-full"
            priority
          />
          <div className="absolute left-[20px] top-[5px] flex h-8 w-24 items-center justify-center text-xs font-semibold text-white">
            {dialog.speaker}
          </div>
          <div className="absolute inset-0 flex items-center justify-center px-8 pt-6 text-center text-[20px] font-semibold text-[#808080]">
            {dialog.isVisible ? (
              dialog.useTypewriter ? (
                <TypewriterText text={dialog.text} />
              ) : (
                dialog.text
              )
            ) : null}
          </div>
        </>
      ) : (
        <div className="rounded-xl bg-white/90 px-6 py-4 text-center text-[20px] font-semibold text-[#808080]">
          {dialog.text}
        </div>
      )}
    </div>
  );

  return (
    <main
      className="relative min-h-screen w-full bg-cover bg-center"
      style={{ backgroundImage: "url('/pages/living-room/Living%20Room%20Empty.png')" }}
      onPointerDown={() => {
        setDialog((current) => ({ ...current, isVisible: false }));
        setZoomedItem(null);
      }}
    >
      <div className="pointer-events-none absolute inset-0 z-0">
        <div
          className="absolute"
          style={{ left: "0%", top: "0%", width: "60%", aspectRatio: "1536 / 1024" }}
        >
          <Image
            src="/pages/living-room/Stanford%20Banner.png"
            alt="Stanford banner"
            fill
            sizes="100vw"
            className="object-contain"
            priority
          />
        </div>
        <div
          className="absolute"
          style={{ left: "21%", top: "13%", width: "30%", aspectRatio: "1024 / 1536" }}
        >
          <Image
            src="/pages/living-room/Miffy.png"
            alt="Miffy poster"
            fill
            sizes="20vw"
            className="object-contain"
          />
        </div>
        <div
          className="absolute"
          style={{ left: "75%", top: "20%", width: "30%", aspectRatio: "1536 / 1024" }}
        >
          <Image
            src="/pages/living-room/Checlist.png"
            alt="Checklist"
            fill
            sizes="22vw"
            className="object-contain"
          />
        </div>
        <div
          className="absolute"
          style={{ left: "63%", top: "20%", width: "18%", aspectRatio: "1024 / 1536" }}
        >
          <Image
            src="/pages/living-room/Sticky%20Note.png"
            alt="Sticky note"
            fill
            sizes="18vw"
            className="object-contain"
          />
        </div>
        <div
          className="absolute"
          style={{ left: "70%", top: "31.5%", width: "28%", aspectRatio: "1024 / 1536" }}
        >
          <Image
            src="/pages/living-room/Computer.png"
            alt="Computer"
            fill
            sizes="28vw"
            className="object-contain"
          />
        </div>
        <div
          className="absolute"
          style={{ left: "0%", top: "50%", width: "34%", aspectRatio: "1536 / 1024" }}
        >
          <Image
            src="/pages/living-room/Books.png"
            alt="Books"
            fill
            sizes="34vw"
            className="object-contain"
          />
        </div>
        <div
          className="absolute"
          style={{ left: "62%", top: "48%", width: "13%", aspectRatio: "704 / 1472" }}
        >
          <Image
            src="/pages/living-room/Safe.svg"
            alt="Safe"
            fill
            sizes="18vw"
            className="object-contain"
          />
        </div>
      </div>
      {zoomedItem ? (
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 w-[90%] max-w-sm -translate-x-1/2 -translate-y-1/2">
          <div className="relative w-full" style={{ aspectRatio: zoomedItem.aspectRatio }}>
            <Image
              src={zoomedItem.src}
              alt={zoomedItem.alt}
              fill
              sizes="90vw"
              className="object-cover"
              priority
            />
          </div>
          {renderDialog("mt-4 max-w-sm")}
        </div>
      ) : null}
      <div className="absolute inset-0 z-10">
        <button
          type="button"
          aria-label="Miffy poster"
          className="pointer-events-auto absolute"
          style={{ left: "21%", top: "13%", width: "30%", aspectRatio: "1024 / 1536" }}
          onPointerDown={(event) => event.stopPropagation()}
          onClick={() => {
            setZoomedItem({
              src: "/pages/living-room/Miffy.png",
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
        <button
          type="button"
          aria-label="Computer"
          className="pointer-events-auto absolute"
          style={{ left: "70%", top: "31.5%", width: "28%", aspectRatio: "1024 / 1536" }}
          onPointerDown={(event) => event.stopPropagation()}
          onClick={() => {
            setZoomedItem({
              src: "/pages/living-room/Computer.png",
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
        <button
          type="button"
          aria-label="Books"
          className="pointer-events-auto absolute"
          style={{ left: "0%", top: "50%", width: "34%", aspectRatio: "1536 / 1024" }}
          onPointerDown={(event) => event.stopPropagation()}
          onClick={() => {
            setZoomedItem({
              src: "/pages/living-room/Books.png",
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
        <button
          type="button"
          aria-label="Checklist"
          className="pointer-events-auto absolute"
          style={{ left: "78%", top: "20%", width: "22%", aspectRatio: "1536 / 1024" }}
          onPointerDown={(event) => event.stopPropagation()}
          onClick={() => {
            setZoomedItem({
              src: "/pages/living-room/Checlist.png",
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
        <button
          type="button"
          aria-label="Sticky note"
          className="pointer-events-auto absolute"
          style={{ left: "63%", top: "20%", width: "15%", aspectRatio: "1024 / 1536" }}
          onPointerDown={(event) => event.stopPropagation()}
          onClick={() => {
            setZoomedItem({
              src: "/pages/living-room/Sticky%20Note.png",
              alt: "Sticky note",
              aspectRatio: "1024 / 1536",
            });
            showDialog({
              key: "sticky-note",
              text: "At a zoo, 50 animals are flipping over one after another. On which turn did the LION flip over? That number is worth remembering.",
              showBilly: false,
              showBackground: true,
              useTypewriter: false,
              speaker: "",
            });
          }}
        />
        <button
          type="button"
          aria-label="Stanford banner"
          className="pointer-events-auto absolute"
          style={{ left: "0%", top: "0%", width: "60%", aspectRatio: "1536 / 1024" }}
          onPointerDown={(event) => event.stopPropagation()}
          onClick={() => {
            setZoomedItem({
              src: "/pages/living-room/Stanford%20Banner.png",
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
        <button
          type="button"
          aria-label="Safe"
          className="pointer-events-auto absolute"
          style={{ left: "62%", top: "48%", width: "13%", aspectRatio: "704 / 1472" }}
          onPointerDown={(event) => event.stopPropagation()}
          onClick={() => {
            setZoomedItem({
              src: "/pages/living-room/Safe.svg",
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
          {dialog.showBilly ? (
            <div
              className={`transition-opacity duration-500 ${
                dialog.isVisible ? "opacity-100" : "opacity-0"
              }`}
              aria-hidden={!dialog.isVisible}
            >
              <Image
                src="/shared/characters/Billy.svg"
                alt="Billy"
                width={220}
                height={220}
                className="h-auto w-44"
                priority
              />
            </div>
          ) : null}
          {renderDialog("mt-6 max-w-sm")}
        </div>
      ) : null}
      <Link
        href="/museum"
        className="absolute bottom-6 right-6 z-20 bg-transparent px-4 py-2 text-5xl font-semibold text-white"
        style={{
          textShadow:
            "3px 3px 0 #B80B3F, -2px -2px 0 #E80E4F, 2px -2px 0 #E80E4F, -2px 2px 0 #E80E4F, 0 2px 0 #E80E4F, 2px 0 0 #E80E4F, -2px 0 0 #E80E4F, 0 -2px 0 #E80E4F",
        }}
      >
        Next
      </Link>
    </main>
  );
}

