"use client";

import Link from "next/link";

type NextButtonProps = {
  href?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  isVisible?: boolean;
  className?: string;
};

export default function NextButton({
  href,
  onClick,
  isVisible,
  className = "",
}: NextButtonProps) {
  const visibilityClass =
    isVisible === undefined
      ? ""
      : isVisible
        ? "opacity-100"
        : "pointer-events-none opacity-0";
  const transitionClass = isVisible === undefined ? "" : "transition-opacity duration-500";
  const buttonClassName = [
    "absolute bottom-6 right-6 z-30 bg-transparent px-4 py-2 text-5xl font-semibold text-white",
    transitionClass,
    visibilityClass,
    className,
  ]
    .filter(Boolean)
    .join(" ");
  const textShadow =
    "3px 3px 0 #B80B3F, -2px -2px 0 #E80E4F, 2px -2px 0 #E80E4F, -2px 2px 0 #E80E4F, 0 2px 0 #E80E4F, 2px 0 0 #E80E4F, -2px 0 0 #E80E4F, 0 -2px 0 #E80E4F";

  if (href) {
    return (
      <Link href={href} className={buttonClassName} style={{ textShadow }}>
        Next
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={buttonClassName}
      style={{ textShadow }}
      aria-hidden={isVisible === undefined ? undefined : !isVisible}
    >
      Next
    </button>
  );
}

