"use client";

type ChoiceButtonsProps = {
  isVisible: boolean;
  primaryLabel: string;
  secondaryLabel: string;
  onPrimaryClick: () => void;
  onSecondaryClick: () => void;
};

export default function ChoiceButtons({
  isVisible,
  primaryLabel,
  secondaryLabel,
  onPrimaryClick,
  onSecondaryClick,
}: ChoiceButtonsProps) {
  return (
    <div
      className={`mt-4 flex w-full items-center justify-center gap-4 transition-opacity duration-500 ${
        isVisible ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
      aria-hidden={!isVisible}
    >
      <button
        type="button"
        className="min-w-[140px] rounded-full border-4 border-[#B58F63] bg-[#F8E6A1] px-6 py-2 text-lg font-semibold text-[#8B6B49] shadow-sm"
        onClick={(event) => {
          event.stopPropagation();
          onPrimaryClick();
        }}
        onPointerDown={(event) => event.stopPropagation()}
      >
        {primaryLabel}
      </button>
      <button
        type="button"
        className="min-w-[160px] rounded-full border-4 border-[#B58F63] bg-[#F8E6A1] px-6 py-2 text-lg font-semibold text-[#8B6B49] shadow-sm"
        onClick={(event) => {
          event.stopPropagation();
          onSecondaryClick();
        }}
        onPointerDown={(event) => event.stopPropagation()}
      >
        {secondaryLabel}
      </button>
    </div>
  );
}

