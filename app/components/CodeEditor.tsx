"use client";

import { useState, useRef, useCallback, useEffect } from "react";

export type Challenge = {
  id: number;
  title: string;
  description: string;
  buggyCode: string;
  expectedOutput: string;
  hint: string;
  bugCount: number;
};

type CodeEditorProps = {
  challenge: Challenge;
  onSolved: () => void;
};

export default function CodeEditor({ challenge, onSolved }: CodeEditorProps) {
  const [code, setCode] = useState(challenge.buggyCode);
  const [consoleOutput, setConsoleOutput] = useState<{
    text: string;
    isError: boolean;
  } | null>(null);
  const [isSolved, setIsSolved] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const pendingCursorPos = useRef<number | null>(null);

  const lineCount = code.split("\n").length;

  // Restore cursor position after Tab-induced re-render
  useEffect(() => {
    if (pendingCursorPos.current !== null && textareaRef.current) {
      textareaRef.current.selectionStart = pendingCursorPos.current;
      textareaRef.current.selectionEnd = pendingCursorPos.current;
      pendingCursorPos.current = null;
    }
  });

  // Sync line numbers scroll with textarea
  const handleScroll = useCallback(() => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  }, []);

  // Handle Tab key to insert spaces instead of changing focus
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Tab") {
        e.preventDefault();
        const start = e.currentTarget.selectionStart;
        const end = e.currentTarget.selectionEnd;
        pendingCursorPos.current = start + 2;
        setCode(code.substring(0, start) + "  " + code.substring(end));
      }
    },
    [code]
  );

  const runCode = useCallback(() => {
    try {
      // eslint-disable-next-line no-new-func
      const fn = new Function(code);
      const result = fn();
      const output = String(result);

      if (output === challenge.expectedOutput) {
        setConsoleOutput({ text: output, isError: false });
        setIsSolved(true);
        onSolved();
      } else {
        setConsoleOutput({
          text: output,
          isError: true,
        });
      }
    } catch (err) {
      setConsoleOutput({
        text: err instanceof Error ? err.message : String(err),
        isError: true,
      });
    }
  }, [code, challenge.expectedOutput, onSolved]);

  const resetCode = useCallback(() => {
    setCode(challenge.buggyCode);
    setConsoleOutput(null);
    setIsSolved(false);
    setShowHint(false);
  }, [challenge.buggyCode]);

  const editorHeight = Math.max(lineCount + 1, 8) * 24;

  return (
    <div className="w-full">
      {/* Challenge info card */}
      <div className="mb-3 rounded-xl border-2 border-amber-400 bg-amber-50 px-4 py-3">
        <h3 className="text-lg text-amber-900">{challenge.title}</h3>
        <p className="mt-1 text-sm text-amber-700">{challenge.description}</p>
        <div className="mt-2 rounded-lg bg-amber-100 px-3 py-2">
          <span className="text-xs text-amber-600">Expected output:</span>
          <code className="mt-0.5 block font-mono text-sm text-amber-900">
            {challenge.expectedOutput}
          </code>
        </div>
        {challenge.bugCount > 1 && (
          <p className="mt-2 text-xs text-amber-500">
            🐛 {challenge.bugCount} bugs to fix
          </p>
        )}
      </div>

      {/* Code editor */}
      <div className="overflow-hidden rounded-xl border-2 border-gray-700 shadow-lg">
        {/* Editor header - macOS window chrome */}
        <div className="flex items-center justify-between bg-[#2d2d2d] px-3 py-2">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-[#ff5f56]" />
            <div className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
            <div className="h-3 w-3 rounded-full bg-[#27c93f]" />
          </div>
          <span className="font-mono text-xs text-gray-400">script.js</span>
        </div>

        {/* Editor body with line numbers */}
        <div
          className="flex bg-[#1e1e1e]"
          style={{ height: `${editorHeight}px` }}
        >
          {/* Line numbers gutter */}
          <div
            ref={lineNumbersRef}
            className="select-none overflow-hidden border-r border-gray-700/50 bg-[#1e1e1e] py-3 pl-3 pr-2 text-right font-mono text-xs leading-6 text-gray-600"
            aria-hidden="true"
          >
            {Array.from({ length: lineCount }, (_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>

          {/* Code textarea */}
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onScroll={handleScroll}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            autoComplete="off"
            data-gramm="false"
            disabled={isSolved}
            className="flex-1 resize-none overflow-y-auto bg-transparent py-3 pl-3 pr-3 font-mono text-sm leading-6 text-[#d4d4d4] caret-white outline-none"
            style={{ tabSize: 2 }}
          />
        </div>

        {/* Button bar */}
        <div className="flex items-center justify-between bg-[#2d2d2d] px-3 py-2">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowHint((prev) => !prev)}
              className="rounded-md bg-yellow-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-yellow-500"
            >
              💡 Hint
            </button>
            <button
              type="button"
              onClick={resetCode}
              className="rounded-md bg-gray-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-gray-500"
            >
              ↺ Reset
            </button>
          </div>
          <button
            type="button"
            onClick={runCode}
            disabled={isSolved}
            className={`rounded-md px-4 py-1.5 text-sm font-bold text-white transition-all ${
              isSolved
                ? "cursor-default bg-green-700"
                : "bg-green-600 hover:bg-green-500 active:scale-95"
            }`}
          >
            {isSolved ? "✓ Passed" : "▶ Run"}
          </button>
        </div>
      </div>

      {/* Hint card */}
      {showHint && (
        <div className="mt-2 rounded-lg border border-yellow-300 bg-yellow-50 px-3 py-2 text-sm text-yellow-800">
          💡 {challenge.hint}
        </div>
      )}

      {/* Console output */}
      {consoleOutput && (
        <div className="mt-3 overflow-hidden rounded-xl border-2 border-gray-700">
          <div className="bg-[#0d1117] px-3 py-1.5">
            <span className="font-mono text-xs text-gray-500">Console</span>
          </div>
          <div
            className={`whitespace-pre-wrap bg-[#0d1117] px-3 py-3 font-mono text-sm ${
              consoleOutput.isError ? "text-red-400" : "text-green-400"
            }`}
          >
            <span className="text-gray-600">&gt; </span>
            {consoleOutput.text}
          </div>
        </div>
      )}

      {/* Success message */}
      {isSolved && (
        <div className="mt-3 rounded-xl border-2 border-green-400 bg-green-50 px-4 py-3 text-center">
          <span className="text-2xl">🎉</span>
          <p className="mt-1 font-bold text-green-700">Bug squashed!</p>
        </div>
      )}
    </div>
  );
}
