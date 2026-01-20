import type { ComponentProps } from "react";
import DialogBox from "./DialogBox";

type BillyDialogProps = Omit<ComponentProps<typeof DialogBox>, "speaker" | "characterImage"> & {
  characterImageVisible?: boolean;
};

export default function BillyDialog({
  characterImageVisible,
  ...props
}: BillyDialogProps) {
  return (
    <DialogBox
      {...props}
      speaker="Billy"
      characterImage={{
        src: "/assets/shared/characters/Billy.svg",
        alt: "Billy",
        width: 220,
        height: 220,
        className: "h-auto w-44 object-contain",
        containerClassName: "",
        isVisible: characterImageVisible,
        priority: true,
      }}
    />
  );
}

