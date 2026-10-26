"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChatMessage } from "@/types/chat";
import { MessageBubble } from "./MessageBubble";
import { ChatInput } from "./ChatInput";
import { Sparkles, AlertCircle, Trash2, Bot, Info } from "lucide-react";

const SUGGESTED_PROMPTS = [
  "Explain how RAG (Retrieval-Augmented Generation) works in simple terms.",
  "What is the difference between a Vector Embedding and Keyword Search?",
  "Why do Large Language Models hallucinate, and how do we prevent it?",
  "What are tokens and context windows in LLMs?",
];

export function ChatContainer() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom of the conversation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, isStreaming]);

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading || isStreaming) return;

    setError(null);

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmedInput,
      createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    // Optimistically append user message
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);
    setIsStreaming(false);

    // Initialize AbortController for cancelability
    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Unique ID for the incoming assistant response
    const assistantMsgId = crypto.randomUUID();

    try {
      const payload = {
        messages: updatedMessages.map(({ role, content }) => ({
          role,
          content,
        })),
      };

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      if (!response.ok) {
        let errorMessage = "Failed to generate AI response.";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      if (!response.body) {
        throw new Error("Readable stream is not available on response.");
      }

      // Append assistant placeholder once connection is established
      setMessages((prev) => [
        ...prev,
        {
          id: assistantMsgId,
          role: "assistant",
          content: "",
          createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);

      setIsLoading(false);
      setIsStreaming(true);

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let accumulatedText = "";

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunkText = decoder.decode(value, { stream: true });
          accumulatedText += chunkText;

          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMsgId
                ? { ...msg, content: accumulatedText }
                : msg
            )
          );
        }
      } finally {
        reader.releaseLock();
      }
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === "AbortError") {
        // User intentionally clicked "Stop Generating"
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMsgId && msg.content
              ? { ...msg, content: msg.content + "\n\n*(Generation stopped by user)*" }
              : msg
          )
        );
      } else {
        const errorMsg = err instanceof Error ? err.message : "An unexpected error occurred.";
        setError(errorMsg);
      }
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  const handleClearChat = () => {
    if (isStreaming) {
      handleStopGeneration();
    }
    setMessages([]);
    setError(null);
  };

  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-5xl mx-auto w-full">
      {/* Header bar */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-slate-800/80 bg-slate-950/40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              KnowledgeLens Chat
              <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                Phase 2 Streaming
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Real-time token streaming with cancelation (Grounded RAG in Phase 3-5)
            </p>
          </div>
        </div>

        {messages.length > 0 && (
          <button
            onClick={handleClearChat}
            disabled={isLoading || isStreaming}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors disabled:opacity-50"
            title="Clear current conversation"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Chat</span>
          </button>
        )}
      </header>

      {/* Message Feed Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {/* Empty State */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full max-w-lg mx-auto text-center space-y-6 py-12">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-xl shadow-indigo-500/5">
              <Sparkles className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-slate-100">
                Welcome to KnowledgeLens
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Tokens stream in real-time. Try asking an AI question below or test the Stop button mid-stream.
              </p>
            </div>

            {/* Suggested Prompt Chips */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full text-left">
              {SUGGESTED_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePromptClick(prompt)}
                  className="p-3 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-850 hover:border-indigo-500/40 text-xs text-slate-300 transition-all text-left flex flex-col justify-between group"
                >
                  <span>{prompt}</span>
                  <span className="text-[10px] text-indigo-400 mt-2 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Use prompt →
                  </span>
                </button>
              ))}
            </div>

            <div className="flex items-start gap-2 p-3 rounded-xl bg-slate-900/40 border border-slate-800 text-left text-xs text-slate-400 w-full">
              <Info className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Learning Note:</strong> Phase 2 streams responses token-by-token using standard Web <code className="text-cyan-300">ReadableStream</code> and <code className="text-cyan-300">TextDecoder</code> with <code className="text-cyan-300">AbortController</code> support.
              </span>
            </div>
          </div>
        )}

        {/* Rendered Messages */}
        {messages.map((message, index) => (
          <MessageBubble
            key={message.id}
            message={message}
            isStreaming={isStreaming && index === messages.length - 1 && message.role === "assistant"}
          />
        ))}

        {/* Loading Indicator (before first token arrives) */}
        {isLoading && (
          <div className="flex items-center gap-3 text-xs text-slate-400 py-2 max-w-3xl mr-auto">
            <div className="w-8 h-8 rounded-lg bg-slate-800 text-cyan-400 border border-slate-700/80 flex items-center justify-center animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]" />
              <span className="ml-2 font-mono text-[11px]">Connecting stream...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Error Banner */}
      {error && (
        <div className="px-6 py-2">
          <div className="max-w-3xl mx-auto flex items-start gap-3 p-3.5 rounded-xl border border-rose-500/30 bg-rose-950/40 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1 space-y-1">
              <p className="font-semibold text-rose-200">Request Error</p>
              <p className="leading-relaxed">{error}</p>
              {error.includes("GEMINI_API_KEY") && (
                <p className="text-slate-400 text-[11px] mt-1 pt-1 border-t border-rose-500/20">
                  💡 <strong>Fix:</strong> Create a <code className="bg-slate-900 px-1 py-0.5 rounded text-amber-300">.env.local</code> file in the project root and add <code className="bg-slate-900 px-1 py-0.5 rounded text-amber-300">GEMINI_API_KEY=your_key_here</code>, then restart the dev server.
                </p>
              )}
            </div>
            <button
              onClick={() => setError(null)}
              className="text-rose-400 hover:text-rose-200 text-xs px-2 py-0.5 rounded hover:bg-rose-900/40"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Input Form Bar */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
        <ChatInput
          input={input}
          setInput={setInput}
          onSubmit={handleSubmit}
          onStop={handleStopGeneration}
          isLoading={isLoading}
          isStreaming={isStreaming}
        />
      </div>
    </div>
  );
}
