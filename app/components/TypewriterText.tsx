"use client";

import { useEffect, useRef, useState } from "react";

type TypewriterTextProps = {
  text: string;
  intervalMs?: number;
  onComplete?: () => void;
  audioSrc?: string;
  enableAudio?: boolean;
};

export default function TypewriterText({
  text,
  intervalMs = 40,
  onComplete,
  audioSrc = "/assets/shared/audio/Villager%20Talking%20Sound.m4a",
  enableAudio = true,
}: TypewriterTextProps) {
  const [visibleText, setVisibleText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const onCompleteRef = useRef(onComplete);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isTypingRef = useRef(isTyping);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    isTypingRef.current = isTyping;
  }, [isTyping]);

  useEffect(() => {
    if (!enableAudio) {
      return;
    }

    if (!audioRef.current) {
      audioRef.current = new Audio(audioSrc);
    } else {
      audioRef.current.src = audioSrc;
    }
  }, [audioSrc, enableAudio]);

  useEffect(() => {
    let index = 0;
    setVisibleText("");
    const willType = Boolean(text);
    setIsTyping(willType);
    isTypingRef.current = willType;
    const timer = window.setInterval(() => {
      index += 1;
      setVisibleText(text.slice(0, index));
      if (index >= text.length) {
        window.clearInterval(timer);
        setIsTyping(false);
        isTypingRef.current = false;
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
        onCompleteRef.current?.();
      }
    }, intervalMs);

    return () => {
      window.clearInterval(timer);
      setIsTyping(false);
      isTypingRef.current = false;
    };
  }, [text, intervalMs]);

  useEffect(() => {
    if (!enableAudio || !text || !isTyping) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      return;
    }

    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    audio.currentTime = 0;
    let removed = false;
    const removeListeners = () => {
      if (removed) {
        return;
      }
      removed = true;
      window.removeEventListener("pointerdown", tryPlay);
      window.removeEventListener("keydown", tryPlay);
    };
    const tryPlay = () => {
      if (!isTypingRef.current) {
        return;
      }
      audio.play().then(removeListeners).catch(() => {});
    };

    const playPromise = audio.play();
    if (playPromise) {
      playPromise.catch(() => {
        window.addEventListener("pointerdown", tryPlay);
        window.addEventListener("keydown", tryPlay);
      });
    }

    return () => {
      removeListeners();
      audio.pause();
      audio.currentTime = 0;
    };
  }, [enableAudio, text, isTyping]);

  return <span>{visibleText}</span>;
}

