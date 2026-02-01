"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import TypewriterText from "./TypewriterText";
import ChoiceButtons from "./ChoiceButtons";

type DialogBoxProps = {
  text: string;
  speaker: string;
  isVisible?: boolean;
  className?: string;
  showBackground?: boolean;
  useTypewriter?: boolean;
  showOverlay?: boolean;
  showDialog?: boolean;
  onComplete?: () => void;
  characterImage?: {
    src: string;
    alt: string;
    width: number;
    height: number;
    className?: string;
    containerClassName?: string;
    isVisible?: boolean;
    priority?: boolean;
  };
  choiceButtons?: {
    isVisible: boolean;
    primaryLabel: string;
    secondaryLabel: string;
    onPrimaryClick: () => void;
    onSecondaryClick: () => void;
  };
  inputBox?: {
    isVisible: boolean;
    value: string;
    onChange: (value: string) => void;
    /** Return true for success (green flash), false for failure (red flash), or void for no flash */
    onSubmit: () => boolean | void;
    placeholder?: string;
    inputMode?: "text" | "numeric";
    pattern?: string;
    showSubmitButton?: boolean;
    submitButtonLabel?: string;
    label?: string;
  };
  audioInput?: {
    isVisible: boolean;
    isListening: boolean;
    transcript: string;
    extractedNumbers: string;
    error: string | null;
    isSupported: boolean;
    onStartListening: () => void;
    onStopListening: () => void;
    /** Return true for success (green flash), false for failure (red flash) */
    onSubmit: (numbers: string) => boolean;
    label?: string;
  };
  onDialogClick?: () => void;
};

function AudioInputSection({
  audioInput,
  triggerFlash,
}: {
  audioInput: NonNullable<DialogBoxProps["audioInput"]>;
  flashColor: "green" | "red" | null;
  triggerFlash: (color: "green" | "red") => void;
}) {
  const [manualInput, setManualInput] = useState("");
  // Start with voice input, switch to manual if not supported or on error
  const [showManualInput, setShowManualInput] = useState(!audioInput.isSupported);

  // Auto-switch to manual input when voice is not supported (e.g., after error)
  useEffect(() => {
    if (!audioInput.isSupported) {
      setShowManualInput(true);
    }
  }, [audioInput.isSupported]);

  const handleManualSubmit = useCallback(() => {
    const numbers = manualInput.trim();
    if (!numbers) return;
    
    const result = audioInput.onSubmit(numbers);
    if (result === true) {
      triggerFlash("green");
      setManualInput("");
    } else {
      triggerFlash("red");
    }
  }, [manualInput, audioInput, triggerFlash]);

  const handleAudioSubmit = useCallback(() => {
    const result = audioInput.onSubmit(audioInput.extractedNumbers);
    if (result === true) {
      triggerFlash("green");
    } else {
      triggerFlash("red");
    }
  }, [audioInput, triggerFlash]);

  return (
    <div
      className={`pointer-events-auto mt-3 flex w-full flex-col items-center gap-3 rounded-xl bg-black/60 px-4 py-4 transition-opacity duration-500 ${
        audioInput.isVisible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      onClick={(event) => event.stopPropagation()}
      onPointerDown={(event) => event.stopPropagation()}
      aria-hidden={!audioInput.isVisible}
    >
      {audioInput.label ? (
        <span className="text-sm font-medium text-white/80">
          {audioInput.label}
        </span>
      ) : null}

      {showManualInput ? (
        /* Manual input mode - shown after voice fails or is unsupported */
        <form
          className="flex w-full flex-col items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            handleManualSubmit();
          }}
        >
          {/* Show error message explaining why we switched to manual */}
          {audioInput.error ? (
            <div className="mb-2 text-center text-sm text-yellow-300">
              {audioInput.error}
            </div>
          ) : null}
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            placeholder="Enter the code"
            className="w-full rounded-lg border border-white/30 bg-white/90 px-4 py-2 text-center text-lg font-semibold text-[#3A3A3A] outline-none focus:border-white"
          />
          <button
            type="submit"
            disabled={!manualInput.trim()}
            className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#3A3A3A] transition-colors hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Submit
          </button>
        </form>
      ) : (
        /* Voice input mode - try this first */
        <>
          {/* Microphone button */}
          <button
            type="button"
            onClick={audioInput.isListening ? audioInput.onStopListening : audioInput.onStartListening}
            className={`flex h-16 w-16 items-center justify-center rounded-full text-3xl transition-all ${
              audioInput.isListening
                ? "animate-pulse bg-red-500 text-white shadow-lg shadow-red-500/50"
                : "bg-white text-[#3A3A3A] hover:bg-white/90"
            }`}
            aria-label={audioInput.isListening ? "Stop listening" : "Start listening"}
          >
            {audioInput.isListening ? "🎙️" : "🎤"}
          </button>

          {/* Status text */}
          <div className="text-center text-sm text-white/80">
            {audioInput.isListening ? (
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                Listening... Speak the numbers
              </span>
            ) : (
              "Tap the microphone and say the code"
            )}
          </div>

          {/* Transcript display */}
          {audioInput.transcript ? (
            <div className="w-full rounded-lg bg-white/10 px-3 py-2 text-center">
              <div className="text-xs text-white/60">Heard:</div>
              <div className="text-sm text-white">{audioInput.transcript}</div>
              {audioInput.extractedNumbers ? (
                <div className="mt-1 text-lg font-bold text-green-300">
                  → {audioInput.extractedNumbers}
                </div>
              ) : null}
            </div>
          ) : null}

          {/* Error display - this will show briefly before switching to manual */}
          {audioInput.error ? (
            <div className="text-center text-sm text-red-300">
              {audioInput.error}
            </div>
          ) : null}

          {/* Submit button - only show when we have extracted numbers */}
          {audioInput.extractedNumbers && !audioInput.isListening ? (
            <button
              type="button"
              onClick={handleAudioSubmit}
              className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#3A3A3A] transition-colors hover:bg-white/90"
            >
              Submit: {audioInput.extractedNumbers}
            </button>
          ) : null}
        </>
      )}
    </div>
  );
}

export function DialogOverlay({
  isVisible,
  onClick,
  blockInteractions = false,
}: {
  isVisible?: boolean;
  onClick?: () => void;
  blockInteractions?: boolean;
}) {
  // Block pointer events if:
  // 1. There's a click handler (user can dismiss by clicking)
  // 2. blockInteractions is true (e.g., typewriter still running)
  const shouldBlock = Boolean(onClick) || blockInteractions;

  return isVisible ? (
    <div
      className={`fixed inset-0 z-10 bg-black/40 ${shouldBlock ? "pointer-events-auto" : "pointer-events-none"}`}
      aria-hidden
      onClick={
        onClick
          ? (event) => {
              event.stopPropagation();
              onClick();
            }
          : shouldBlock
            ? (event) => {
                event.stopPropagation();
              }
            : undefined
      }
      onPointerDown={shouldBlock ? (event) => event.stopPropagation() : undefined}
    />
  ) : null;
}

export default function DialogBox({
  text,
  speaker,
  isVisible,
  className = "",
  showBackground = true,
  useTypewriter = true,
  showOverlay = true,
  showDialog = true,
  onComplete,
  characterImage,
  choiceButtons,
  inputBox,
  audioInput,
  onDialogClick,
}: DialogBoxProps) {
  const [isTypewriterComplete, setIsTypewriterComplete] = useState(!useTypewriter);
  const [flashColor, setFlashColor] = useState<"green" | "red" | null>(null);

  // Reset completion state when text changes or typewriter setting changes
  useEffect(() => {
    setIsTypewriterComplete(!useTypewriter);
  }, [text, useTypewriter]);

  const handleTypewriterComplete = () => {
    setIsTypewriterComplete(true);
    onComplete?.();
  };

  const triggerFlash = (color: "green" | "red") => {
    setFlashColor(color);
    window.setTimeout(() => {
      setFlashColor(null);
    }, 260);
  };

  const handleInputSubmit = () => {
    if (!inputBox) return;
    const result = inputBox.onSubmit();
    if (result === true) {
      triggerFlash("green");
    } else if (result === false) {
      triggerFlash("red");
    }
  };

  // Only allow dismissing when typewriter is complete
  const canDismiss = isTypewriterComplete && onDialogClick;

  const isDialogVisible = isVisible ?? Boolean(text);
  const isCharacterVisible = characterImage
    ? characterImage.isVisible ?? isDialogVisible
    : false;
  const dialogContent = isDialogVisible
    ? useTypewriter
      ? <TypewriterText text={text} onComplete={handleTypewriterComplete} />
      : text
    : null;

  return (
    <>
      {flashColor ? (
        <div
          className={`pointer-events-none fixed inset-0 z-50 ${
            flashColor === "green" ? "bg-green-300/70" : "bg-red-400/70"
          }`}
        />
      ) : null}
      {showOverlay ? <DialogOverlay isVisible={isDialogVisible} onClick={canDismiss ? onDialogClick : undefined} blockInteractions={!isTypewriterComplete} /> : null}
      {showDialog ? (
        <>
          {characterImage ? (
            <div
              className={`relative z-20 mb-4 flex justify-center overflow-visible transition-opacity duration-500 ${
                isCharacterVisible && canDismiss ? "pointer-events-auto opacity-100" : isCharacterVisible ? "pointer-events-none opacity-100" : "pointer-events-none opacity-0"
              } ${characterImage.containerClassName ?? ""}`}
              aria-hidden={!isCharacterVisible}
              onClick={
                canDismiss
                  ? (event) => {
                      event.stopPropagation();
                      onDialogClick();
                    }
                  : undefined
              }
              onPointerDown={canDismiss ? (event) => event.stopPropagation() : undefined}
            >
              <Image
                src={characterImage.src}
                alt={characterImage.alt}
                width={characterImage.width}
                height={characterImage.height}
                className={characterImage.className}
                priority={characterImage.priority}
              />
            </div>
          ) : null}
          <div
            className={`relative z-20 w-full transition-opacity duration-500 ${
              isDialogVisible && canDismiss ? "opacity-100" : isDialogVisible ? "pointer-events-none opacity-100" : "pointer-events-none opacity-0"
            } ${className}`}
            aria-hidden={!isDialogVisible}
            onClick={
              canDismiss
                ? (event) => {
                    event.stopPropagation();
                    onDialogClick();
                  }
                : undefined
            }
            onPointerDown={canDismiss ? (event) => event.stopPropagation() : undefined}
          >
            <div className="relative w-full">
              {showBackground ? (
                <>
                  <Image
                    src="/assets/shared/ui/Text%20Background.svg"
                    alt="Dialog background"
                    width={360}
                    height={210}
                    className="h-auto w-full"
                    priority
                  />
                  <div className="absolute left-[20px] top-[5px] flex h-8 w-24 items-center justify-center text-xs font-semibold text-white">
                    {speaker}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center px-8 pt-6 text-center text-[20px] font-semibold text-[#808080]">
                    {dialogContent}
                  </div>
                </>
              ) : (
                <div className="rounded-xl bg-white/90 px-6 py-4 text-center text-[20px] font-semibold text-[#808080]">
                  {dialogContent}
                </div>
              )}
            </div>
            {choiceButtons ? (
              <ChoiceButtons
                isVisible={choiceButtons.isVisible}
                primaryLabel={choiceButtons.primaryLabel}
                secondaryLabel={choiceButtons.secondaryLabel}
                onPrimaryClick={choiceButtons.onPrimaryClick}
                onSecondaryClick={choiceButtons.onSecondaryClick}
              />
            ) : null}
            {inputBox ? (
              <form
                className={`pointer-events-auto mt-3 flex w-full items-center gap-2 transition-opacity duration-500 ${
                  inputBox.showSubmitButton ? "rounded-xl bg-black/60 px-3 py-2" : ""
                } ${inputBox.isVisible ? "opacity-100" : "pointer-events-none opacity-0"}`}
                onSubmit={(event) => {
                  event.preventDefault();
                  handleInputSubmit();
                }}
                onClick={(event) => event.stopPropagation()}
                onPointerDown={(event) => event.stopPropagation()}
                aria-hidden={!inputBox.isVisible}
              >
                {inputBox.label ? (
                  <label className="sr-only" htmlFor="dialog-input">
                    {inputBox.label}
                  </label>
                ) : null}
                <input
                  id="dialog-input"
                  type="text"
                  inputMode={inputBox.inputMode ?? "text"}
                  pattern={inputBox.pattern}
                  autoComplete="off"
                  value={inputBox.value}
                  onChange={(event) => inputBox.onChange(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      handleInputSubmit();
                    }
                  }}
                  className={`w-full rounded-md border border-white/70 bg-white/90 px-4 py-2 text-center text-sm font-semibold text-[#808080] shadow-sm outline-none focus:border-white ${
                    inputBox.showSubmitButton ? "rounded-lg text-lg text-[#3A3A3A]" : ""
                  }`}
                  placeholder={inputBox.placeholder}
                />
                {inputBox.showSubmitButton ? (
                  <button
                    type="submit"
                    className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-[#3A3A3A]"
                  >
                    {inputBox.submitButtonLabel ?? "Submit"}
                  </button>
                ) : null}
              </form>
            ) : null}
            {audioInput ? (
              <AudioInputSection
                audioInput={audioInput}
                flashColor={flashColor}
                triggerFlash={triggerFlash}
              />
            ) : null}
          </div>
        </>
      ) : null}
    </>
  );
}
