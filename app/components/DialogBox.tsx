"use client";

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
    onSubmit: () => void;
    placeholder?: string;
    inputMode?: "text" | "numeric";
    pattern?: string;
    showSubmitButton?: boolean;
    submitButtonLabel?: string;
    label?: string;
  };
  onDialogClick?: () => void;
};

export function DialogOverlay({ isVisible }: { isVisible?: boolean }) {
  return isVisible ? (
    <div className="pointer-events-none fixed inset-0 z-10 bg-black/40" aria-hidden />
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
  onDialogClick,
}: DialogBoxProps) {
  const isDialogVisible = isVisible ?? Boolean(text);
  const isCharacterVisible = characterImage
    ? characterImage.isVisible ?? isDialogVisible
    : false;
  const dialogContent = isDialogVisible
    ? useTypewriter
      ? <TypewriterText text={text} onComplete={onComplete} />
      : text
    : null;

  return (
    <>
      {showOverlay ? <DialogOverlay isVisible={isDialogVisible} /> : null}
      {showDialog ? (
        <>
          {characterImage ? (
            <div
              className={`relative z-20 mb-4 flex justify-center overflow-visible transition-opacity duration-500 ${
                isCharacterVisible ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
              } ${characterImage.containerClassName ?? ""}`}
              aria-hidden={!isCharacterVisible}
              onClick={(event) => {
                event.stopPropagation();
                onDialogClick?.();
              }}
              onPointerDown={(event) => event.stopPropagation()}
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
              isDialogVisible ? "opacity-100" : "pointer-events-none opacity-0"
            } ${className}`}
            aria-hidden={!isDialogVisible}
            onClick={onDialogClick}
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
                  inputBox.onSubmit();
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
                      inputBox.onSubmit();
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
          </div>
        </>
      ) : null}
    </>
  );
}

