"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const ANSWER = "LAGER";
const WORD_LENGTH = 5;
const MAX_GUESSES = 6;

type LetterState = "correct" | "present" | "absent" | "empty";

interface LetterTile {
  letter: string;
  state: LetterState;
}

const KEYBOARD_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "⌫"],
];

function evaluateGuess(guess: string, answer: string): LetterState[] {
  const result: LetterState[] = Array(WORD_LENGTH).fill("absent");
  const answerLetters = answer.split("");
  const guessLetters = guess.split("");
  const usedIndices: Set<number> = new Set();

  // First pass: mark correct letters (green)
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guessLetters[i] === answerLetters[i]) {
      result[i] = "correct";
      usedIndices.add(i);
    }
  }

  // Second pass: mark present letters (yellow)
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (result[i] === "correct") continue;

    for (let j = 0; j < WORD_LENGTH; j++) {
      if (!usedIndices.has(j) && guessLetters[i] === answerLetters[j]) {
        result[i] = "present";
        usedIndices.add(j);
        break;
      }
    }
  }

  return result;
}

export default function WordyPage() {
  const router = useRouter();
  const [guesses, setGuesses] = useState<LetterTile[][]>([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [showResultMessage, setShowResultMessage] = useState(false);
  const [shake, setShake] = useState(false);
  const [keyboardColors, setKeyboardColors] = useState<Record<string, LetterState>>({});

  const submitGuess = useCallback(() => {
    if (currentGuess.length !== WORD_LENGTH) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    const states = evaluateGuess(currentGuess, ANSWER);
    const newGuess: LetterTile[] = currentGuess.split("").map((letter, i) => ({
      letter,
      state: states[i],
    }));

    setGuesses((prev) => [...prev, newGuess]);

    // Update keyboard colors
    setKeyboardColors((prev) => {
      const updated = { ...prev };
      currentGuess.split("").forEach((letter, i) => {
        const newState = states[i];
        const currentState = updated[letter];
        // Priority: correct > present > absent
        if (
          newState === "correct" ||
          (newState === "present" && currentState !== "correct") ||
          (newState === "absent" && !currentState)
        ) {
          updated[letter] = newState;
        }
      });
      return updated;
    });

    setCurrentGuess("");

    const isWin = currentGuess === ANSWER;
    const isLoss = !isWin && guesses.length + 1 >= MAX_GUESSES;

    if (isWin || isLoss) {
      setGameOver(true);
      setWon(isWin);
      // Show result message after a brief pause
      setTimeout(() => {
        setShowResultMessage(true);
      }, 500);
      // Navigate back to speakeasy after showing message
      setTimeout(() => {
        router.push(`/speakeasy-inside?wordy=${isWin ? "won" : "lost"}`);
      }, 2500);
    }
  }, [currentGuess, guesses.length, router]);

  const handleKeyPress = useCallback(
    (key: string) => {
      if (gameOver) return;

      if (key === "ENTER") {
        submitGuess();
      } else if (key === "⌫" || key === "BACKSPACE") {
        setCurrentGuess((prev) => prev.slice(0, -1));
      } else if (/^[A-Z]$/.test(key) && currentGuess.length < WORD_LENGTH) {
        setCurrentGuess((prev) => prev + key);
      }
    },
    [gameOver, currentGuess.length, submitGuess]
  );

  // Physical keyboard handler
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      if (key === "ENTER" || key === "BACKSPACE" || /^[A-Z]$/.test(key)) {
        handleKeyPress(key);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleKeyPress]);

  const getTileStyle = (state: LetterState) => {
    switch (state) {
      case "correct":
        return "bg-[#538d4e] border-[#538d4e] text-white";
      case "present":
        return "bg-[#b59f3b] border-[#b59f3b] text-white";
      case "absent":
        return "bg-[#3a3a3c] border-[#3a3a3c] text-white";
      default:
        return "bg-transparent border-[#565656] text-white";
    }
  };

  const getKeyStyle = (key: string) => {
    const state = keyboardColors[key];
    switch (state) {
      case "correct":
        return "bg-[#538d4e] text-white";
      case "present":
        return "bg-[#b59f3b] text-white";
      case "absent":
        return "bg-[#3a3a3c] text-gray-400";
      default:
        return "bg-[#818384] text-white";
    }
  };

  // Build display grid
  const displayGrid: LetterTile[][] = [];
  for (let i = 0; i < MAX_GUESSES; i++) {
    if (i < guesses.length) {
      displayGrid.push(guesses[i]);
    } else if (i === guesses.length) {
      // Current guess row
      const row: LetterTile[] = [];
      for (let j = 0; j < WORD_LENGTH; j++) {
        row.push({
          letter: currentGuess[j] || "",
          state: "empty",
        });
      }
      displayGrid.push(row);
    } else {
      // Empty row
      displayGrid.push(
        Array(WORD_LENGTH)
          .fill(null)
          .map(() => ({ letter: "", state: "empty" as LetterState }))
      );
    }
  }

  return (
    <main
      className="screen-container relative flex flex-col items-center justify-between bg-cover bg-center py-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
      style={{ backgroundImage: `url('/assets/scenes/speakeasy/Wood.png')` }}
    >
      {/* Wordy title at the top */}
      <div className="flex shrink-0 justify-center">
        <Image
          src="/assets/scenes/speakeasy/Wordy.png"
          alt="Wordy"
          width={180}
          height={60}
          className="h-auto w-auto max-w-[50%] object-contain drop-shadow-lg"
          priority
        />
      </div>

      {/* Game Grid */}
      <div className="my-2 shrink-0 rounded-xl bg-[#4a3728] p-3 shadow-xl">
        <div className="flex flex-col items-center gap-1">
          {displayGrid.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className={`flex gap-1 ${
              rowIndex === guesses.length && shake ? "animate-shake" : ""
            }`}
          >
            {row.map((tile, colIndex) => (
              <div
                key={colIndex}
                className={`flex h-12 w-12 items-center justify-center border-2 text-2xl font-bold uppercase transition-all duration-300 ${getTileStyle(
                  tile.state
                )} ${tile.letter ? "scale-105" : ""}`}
                style={{
                  animationDelay:
                    tile.state !== "empty" ? `${colIndex * 100}ms` : "0ms",
                }}
              >
                {tile.letter}
              </div>
            ))}
          </div>
        ))}
        </div>
      </div>

      {/* Result Message */}
      {showResultMessage && (
        <div className="my-2 shrink-0 rounded-xl bg-[#4a3728] px-4 py-2 text-center shadow-xl">
          {won ? (
            <p className="text-xl text-green-400">You got it! Lager!</p>
          ) : (
            <p className="text-lg text-red-400">Uh oh. You&apos;re out of guesses</p>
          )}
        </div>
      )}

      {/* Keyboard */}
      <div className="flex shrink-0 flex-col items-center gap-1 px-1">
        {KEYBOARD_ROWS.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-0.5">
            {row.map((key) => (
              <button
                key={key}
                onClick={() => handleKeyPress(key)}
                disabled={gameOver}
                className={`flex h-12 items-center justify-center rounded font-bold uppercase transition-colors ${getKeyStyle(
                  key
                )} ${
                  key === "ENTER" || key === "⌫"
                    ? "min-w-[55px] px-1.5 text-xs"
                    : "min-w-[28px] text-base"
                } ${gameOver ? "opacity-50" : "active:scale-95"}`}
              >
                {key}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Shake animation style */}
      <style jsx>{`
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          10%,
          30%,
          50%,
          70%,
          90% {
            transform: translateX(-4px);
          }
          20%,
          40%,
          60%,
          80% {
            transform: translateX(4px);
          }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </main>
  );
}
