"use client";

import { useState, useCallback } from "react";
import CodeEditor, { type Challenge } from "../components/CodeEditor";
import UserAvatar from "../components/UserAvatar";

const challenges: Challenge[] = [
  {
    id: 1,
    title: "Level 1: The Invitation",
    description: "Fix the bug so the wedding invitation prints correctly!",
    buggyCode: `let bride = "Tran";
let groom = "Mike";
return bride + " & " + grom + " forever!";`,
    expectedOutput: "Tran & Mike forever!",
    hint: "Look carefully at the variable names — is everything spelled right?",
    bugCount: 1,
  },
  {
    id: 2,
    title: "Level 2: Guest Counter",
    description: "The guest counter is off. Can you fix it?",
    buggyCode: `let count = 1;
let guests = ["Tran", "Mike", "Billy"];
for (let i = 0; i < guests.length; i++) {
  count = count + 1;
}
return count;`,
    expectedOutput: "3",
    hint: "What should count start at before you begin counting?",
    bugCount: 1,
  },
  {
    id: 3,
    title: "Level 3: Find the Ring Bearer",
    description: "Billy is the ring bearer but the code can't find him!",
    buggyCode: `let guests = ["Billy", "Tran", "Mike"];
for (let i = 1; i < guests.length; i++) {
  if (guests[i] === "Billy") {
    return "Found: " + guests[i];
  }
}
return "Not found";`,
    expectedOutput: "Found: Billy",
    hint: "Where do array indices start in JavaScript? 🤔",
    bugCount: 1,
  },
  {
    id: 4,
    title: "Level 4: RSVP Counter",
    description:
      "Count how many guests are coming vs not. Two things are broken!",
    buggyCode: `let rsvps = ["yes", "no", "yes", "yes", "no"];
let coming = 1;
let notComing = 0;
for (let i = 0; i < rsvps.length; i++) {
  if (rsvps[i] === "Yes") {
    coming = coming + 1;
  } else {
    notComing = notComing + 1;
  }
}
return coming + " yes, " + notComing + " no";`,
    expectedOutput: "3 yes, 2 no",
    hint: "JavaScript is case-sensitive! Also check what the counter starts at.",
    bugCount: 2,
  },
  {
    id: 5,
    title: "Level 5: Gift Calculator",
    description:
      "Calculate the total wedding gift amount. Three bugs are hiding!",
    buggyCode: `function giftTotal(gifts) {
  let total = 10;
  for (let i = 1; i < gifts.length; i++) {
    total = total - gifts[i];
  }
  return "Total: $" + total;
}
return giftTotal([50, 25, 100, 75]);`,
    expectedOutput: "Total: $250",
    hint: "Check three things: the starting total, where the loop begins, and the math operator.",
    bugCount: 3,
  },
  {
    id: 6,
    title: "Level 6: Speech Timer",
    description:
      "Format the best man's speech length. Four logic bugs — the math and conditions are all wrong!",
    buggyCode: `function formatTime(secs) {
  let min = secs % 60;
  let sec = secs / 60;
  if (min < 0) return sec + " sec";
  if (sec <= 0) return min + " min";
  return min + " min, " + sec + " sec";
}
return formatTime(150) + " | " + formatTime(60);`,
    expectedOutput: "2 min, 30 sec | 1 min",
    hint: "How do you get minutes from seconds? Think about / vs % and Math.floor. Also, when should you skip showing minutes or seconds?",
    bugCount: 4,
  },
  {
    id: 7,
    title: "Level 7: The Wedding Cipher",
    description:
      "Decode the secret wedding message! Three tricky bugs hide in this Caesar cipher.",
    buggyCode: `function decode(s) {
  let abc = "abcdefghijklmnopqrstuvwxyz";
  let msg = "";
  for (let i = 1; i < s.length; i++) {
    let ch = s[i];
    let pos = abc.indexOf(ch.toLowerCase());
    let d = abc[(pos + 3) % 26];
    if (ch !== ch.toUpperCase()) {
      d = d.toUpperCase();
    }
    msg = msg + d;
  }
  return msg;
}
return decode("Oryh");`,
    expectedOutput: "Love",
    hint: "Three things: where does the loop start, which direction should you shift, and when should a letter be capitalized?",
    bugCount: 3,
  },
];

export default function CodingChallengePage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [solvedChallenges, setSolvedChallenges] = useState<Set<number>>(
    new Set()
  );
  const [completionDismissed, setCompletionDismissed] = useState(false);

  const allSolved = solvedChallenges.size === challenges.length;
  const currentChallenge = challenges[currentIndex];
  const isCurrentSolved = solvedChallenges.has(currentChallenge.id);
  const showCompletion = allSolved && !completionDismissed;

  const handleSolved = useCallback(() => {
    setSolvedChallenges((prev) => {
      const next = new Set(prev);
      next.add(challenges[currentIndex].id);
      return next;
    });
  }, [currentIndex]);

  const goToNext = () => {
    if (currentIndex < challenges.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <main className="screen-container" style={{ background: "#1a1a2e" }}>
      <UserAvatar />

      {/* Scrollable content area */}
      <div className="absolute inset-0 overflow-y-auto">
        <div className="mx-auto max-w-lg px-4 pb-32 pt-16">
          {/* Header */}
          <div className="mb-4 text-center">
            <span className="text-4xl">💻</span>
            <h1 className="mt-2 text-xl text-amber-300">Coding Challenge</h1>
            <p className="mt-1 text-xs text-amber-400/60">
              Debug the code to unlock the reward!
            </p>
          </div>

          {/* Progress bar */}
          <div className="mb-5">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm text-amber-300">
                Challenge {currentIndex + 1} / {challenges.length}
              </span>
              <span className="text-xs text-amber-400/60">
                {solvedChallenges.size} of {challenges.length} solved
              </span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-700">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-700 ease-out"
                style={{
                  width: `${(solvedChallenges.size / challenges.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Code Editor */}
          <CodeEditor
            key={currentChallenge.id}
            challenge={currentChallenge}
            onSolved={handleSolved}
          />

          {/* Next Challenge button */}
          {isCurrentSolved && currentIndex < challenges.length - 1 && (
            <button
              type="button"
              onClick={goToNext}
              className="mt-4 w-full rounded-xl bg-amber-500 py-3 text-lg text-white shadow-lg transition-all hover:bg-amber-400 active:scale-[0.98]"
            >
              Next Challenge →
            </button>
          )}
        </div>
      </div>

      {/* Completion overlay */}
      {showCompletion && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80">
          <div
            className="mx-4 max-w-sm rounded-3xl border-4 border-amber-400 bg-amber-50 p-8 text-center shadow-2xl"
            style={{ animation: "scaleIn 0.3s ease-out" }}
          >
            <div className="text-5xl">🏆</div>
            <h2 className="mt-4 text-2xl text-amber-900">
              All Bugs Squashed!
            </h2>
            <p className="mt-2 text-sm text-amber-700">
              You completed all 7 coding challenges!
            </p>
            <div className="mt-4 rounded-xl border-2 border-green-400 bg-green-100 px-4 py-3">
              <p className="text-sm text-green-600">Your reward password:</p>
              <p className="mt-1 text-2xl tracking-widest text-green-800">
                DEBUGGER
              </p>
            </div>
            <button
              type="button"
              onClick={() => setCompletionDismissed(true)}
              className="mt-6 rounded-full bg-amber-500 px-8 py-3 text-lg text-white shadow-lg transition-all hover:bg-amber-400 active:scale-95"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
