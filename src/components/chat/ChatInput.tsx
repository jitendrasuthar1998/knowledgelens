"use client";

import React, { useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  maxLength?: number;
}

export function ChatInput({
  input,
  setInput,
  onSubmit,
  isLoading,
  maxLength = 4000,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus on mount
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Enter without Shift
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading) {
        onSubmit(e);
      }
    }
  };

  const isOverLimit = input.length > maxLength;
  const canSubmit = input.trim().length > 0 && !isLoading && !isOverLimit;

  return (
    <form onSubmit={onSubmit} className="relative w-full max-w-3xl mx-auto">
      <div className="relative flex flex-col rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md shadow-2xl transition focus-within:border-indigo-500/80 focus-within:ring-1 focus-within:ring-indigo-500/50">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question about your documents or AI..."
          rows={2}
          disabled={isLoading}
          maxLength={maxLength + 50}
          className="w-full resize-none bg-transparent px-4 py-3.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
          aria-label="User prompt input"
        />

        <div className="flex items-center justify-between px-3 py-2 border-t border-slate-800/60 bg-slate-950/40 rounded-b-2xl">
          <div className="text-[11px] text-slate-500 font-mono">
            <span className={isOverLimit ? "text-rose-400 font-semibold" : ""}>
              {input.length}
            </span>{" "}
            / {maxLength} chars
            <span className="hidden sm:inline text-slate-600 ml-2">
              (Press Enter to send, Shift+Enter for new line)
            </span>
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            aria-label="Send message"
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
              canSubmit
                ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 cursor-pointer active:scale-95"
                : "bg-slate-800 text-slate-500 cursor-not-allowed"
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Thinking...</span>
              </>
            ) : (
              <>
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
