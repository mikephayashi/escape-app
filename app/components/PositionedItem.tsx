"use client";

import type React from "react";

type PositionedItemProps<T extends React.ElementType = "div"> = {
  as?: T;
  left: string;
  top: string;
  width: string;
  aspectRatio: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "style" | "className" | "children">;

export default function PositionedItem<T extends React.ElementType = "div">({
  as,
  left,
  top,
  width,
  aspectRatio,
  className,
  style,
  children,
  ...rest
}: PositionedItemProps<T>) {
  const Component = as ?? "div";

  return (
    <Component
      className={["absolute", className].filter(Boolean).join(" ")}
      style={{ left, top, width, aspectRatio, ...style }}
      {...rest}
    >
      {children}
    </Component>
  );
}



