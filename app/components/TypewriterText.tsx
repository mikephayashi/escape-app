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
  const [isAudioReady, setIsAudioReady] = useState(false);
  const onCompleteRef = useRef(onComplete);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isTypingRef = useRef(isTyping);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    isTypingRef.current = isTyping;
  }, [isTyping]);

  // Initialize audio element and wait for it to be ready
  useEffect(() => {
    if (!enableAudio) {
      return;
    }

    const audio = audioRef.current ?? new Audio();
    audioRef.current = audio;

    const handleCanPlay = () => {
      setIsAudioReady(true);
    };

    // Reset ready state when source changes
    setIsAudioReady(false);
    audio.src = audioSrc;
    audio.load(); // Explicitly load the audio

    // Check if already ready (cached)
    if (audio.readyState >= 3) {
      setIsAudioReady(true);
    } else {
      audio.addEventListener("canplaythrough", handleCanPlay);
    }

    return () => {
      audio.removeEventListener("canplaythrough", handleCanPlay);
    };
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

  // Play audio when typing starts and audio is ready
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

    let removed = false;
    const removeListeners = () => {
      if (removed) {
        return;
      }
      removed = true;
      window.removeEventListener("pointerdown", tryPlay);
      window.removeEventListener("keydown", tryPlay);
      audio.removeEventListener("canplaythrough", tryPlayWhenReady);
    };

    const tryPlay = () => {
      if (!isTypingRef.current) {
        return;
      }
      audio.currentTime = 0;
      audio.play().then(removeListeners).catch(() => {});
    };

    const tryPlayWhenReady = () => {
      if (!isTypingRef.current) {
        return;
      }
      tryPlay();
    };

    // If audio isn't ready yet, wait for it
    if (!isAudioReady) {
      audio.addEventListener("canplaythrough", tryPlayWhenReady);
      return () => {
        removeListeners();
      };
    }

    // Audio is ready, try to play
    audio.currentTime = 0;
    const playPromise = audio.play();
    if (playPromise) {
      playPromise.catch(() => {
        // Autoplay blocked - wait for user interaction
        window.addEventListener("pointerdown", tryPlay);
        window.addEventListener("keydown", tryPlay);
      });
    }

    return () => {
      removeListeners();
      audio.pause();
      audio.currentTime = 0;
    };
  }, [enableAudio, text, isTyping, isAudioReady]);

  return <span>{visibleText}</span>;
}

