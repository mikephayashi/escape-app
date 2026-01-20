"use client";

import { useEffect, useRef, useState } from "react";

type TypewriterTextProps = {
  text: string;
  intervalMs?: number;
  onComplete?: () => void;
};

export default function TypewriterText({
  text,
  intervalMs = 40,
  onComplete,
}: TypewriterTextProps) {
  const [visibleText, setVisibleText] = useState("");
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    let index = 0;
    setVisibleText("");
    const timer = window.setInterval(() => {
      index += 1;
      setVisibleText(text.slice(0, index));
      if (index >= text.length) {
        window.clearInterval(timer);
        onCompleteRef.current?.();
      }
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [text, intervalMs]);

  return <span>{visibleText}</span>;
}

