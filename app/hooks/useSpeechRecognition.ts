"use client";

import { useState, useCallback, useRef, useEffect } from "react";

// Word to number mapping
const wordToNumber: Record<string, string> = {
  zero: "0",
  one: "1",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
  six: "6",
  seven: "7",
  eight: "8",
  nine: "9",
  oh: "0",
  to: "2",
  too: "2",
  for: "4",
  won: "1",
};

function convertSpokenToNumbers(transcript: string): string {
  const lowerTranscript = transcript.toLowerCase().trim();
  
  // First, try to extract any raw digits from the transcript
  const rawDigits = lowerTranscript.replace(/[^0-9]/g, "");
  if (rawDigits.length > 0) {
    return rawDigits;
  }
  
  // Otherwise, convert spoken words to numbers
  const words = lowerTranscript.split(/\s+/);

  // Convert each word to a number if possible
  const numbers = words
    .map((word) => {
      // Check word mapping
      return wordToNumber[word] ?? "";
    })
    .filter((n) => n !== "");

  return numbers.join("");
}

interface SpeechRecognitionHook {
  isListening: boolean;
  transcript: string;
  extractedNumbers: string;
  error: string | null;
  isSupported: boolean;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
}

export function useSpeechRecognition(): SpeechRecognitionHook {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [extractedNumbers, setExtractedNumbers] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);

  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    // Check if Speech Recognition is supported
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const current = event.resultIndex;
      const result = event.results[current];
      const transcriptText = result[0].transcript;

      setTranscript(transcriptText);
      setExtractedNumbers(convertSpokenToNumbers(transcriptText));
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error:", event.error);
      if (event.error === "not-allowed") {
        setError("Microphone access denied. Please allow microphone access.");
      } else if (event.error === "no-speech") {
        setError("No speech detected. Try again.");
      } else if (
        event.error === "service-not-allowed" ||
        event.error === "network" ||
        event.error === "audio-capture"
      ) {
        // These errors indicate the service isn't available (common on iOS Chrome)
        setError("Voice input is only supported on Safari. Please type the code instead.");
        setIsSupported(false);
      } else {
        setError("Voice input is only supported on Safari. Please type the code instead.");
        setIsSupported(false);
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) return;

    setError(null);
    setTranscript("");
    setExtractedNumbers("");

    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch (err) {
      console.error("Failed to start recognition:", err);
      setError("Failed to start listening");
    }
  }, []);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;

    recognitionRef.current.stop();
    setIsListening(false);
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript("");
    setExtractedNumbers("");
    setError(null);
  }, []);

  return {
    isListening,
    transcript,
    extractedNumbers,
    error,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  };
}
