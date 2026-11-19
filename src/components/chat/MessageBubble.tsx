"use client";

import { ChatMessage } from "@/types/chat";
import { Bot, User, BookOpen, FileText } from "lucide-react";
import { parseCitations, ParsedCitation } from "@/lib/ai/rag";

interface MessageBubbleProps {
  message: ChatMessage;
  isStreaming?: boolean;
  onCitationClick?: (citation: ParsedCitation) => void;
}

  /**
   * Strips all [Source: ..., Page N] markers from the raw text
   * so the message bubble shows clean prose only.
   */
  function stripCitationMarkers(text: string): string {
    return text
      .replace(/\[Source:\s*.+?,\s*Page\s*\d+\]/g, "")
      .trim();
  }

  export function MessageBubble({
    message,
    isStreaming = false,
    onCitationClick,
  }: MessageBubbleProps) {
    const isUser = message.role === "user";

      // Parse citations only from finished assistant messages
      const citations = !isUser && !isStreaming ? parseCitations(message.content) : [];

      // Clean text — remove raw citation markers so they don't appear inline
      const displayText =
        !isUser && !isStreaming && citations.length > 0
          ? stripCitationMarkers(message.content)
          : message.content;

    // Deduplicate citations by documentName + pageNumber for the sources panel
    const uniqueCitations = citations.filter(
      (c, i, arr) =>
        arr.findIndex(
          (x) => x.documentName === c.documentName && x.pageNumber === c.pageNumber
        ) === i
    );

  return (
      <div
        className={`flex flex-col gap-2 w-full max-w-3xl ${isUser ? "ml-auto items-end" : "mr-auto items-start"
          }`}
      >
        {/* Row: Avatar + Bubble */}
        <div
          className={`flex items-start gap-3 w-full ${isUser ? "flex-row-reverse" : ""
            }`}
        >
          {/* Avatar */}
          <div
          className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold ${isUser
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "bg-slate-800 text-cyan-400 border border-slate-700/80 shadow-md shadow-slate-900/50"
          }`}
          aria-hidden="true"
        >
          {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
        </div>

        {/* Message Bubble — clean prose, no inline citation markers */}
        <div
          className={`relative rounded-2xl px-4 py-3 text-sm leading-relaxed ${isUser
              ? "bg-indigo-600 text-white rounded-tr-sm shadow-lg shadow-indigo-600/10"
              : "bg-slate-900/90 text-slate-200 border border-slate-800 rounded-tl-sm shadow-lg shadow-black/20"
          }`}
        >
        <div className="whitespace-pre-wrap break-words">
            {displayText}
          {isStreaming && (
            <span
              className="inline-block w-1.5 h-4 ml-1 bg-cyan-400 animate-pulse align-middle rounded-sm"
              aria-hidden="true"
            />
          )}
        </div>

        {/* Timestamp */}
        <div
          className={`text-[10px] mt-1.5 font-medium ${isUser ? "text-indigo-200 text-right" : "text-slate-500 text-left"
            }`}
        >
          {message.createdAt}
        </div>
      </div>
      </div >

  {/* Sources Panel — separate div below the bubble, only for assistant */ }
  {
    uniqueCitations.length > 0 && (
      <div className="ml-11 w-full">
        {/* Header */}
        <div className="flex items-center gap-1.5 mb-2 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
          <BookOpen className="w-3 h-3 text-cyan-500" />
          <span>Sources</span>
          <span className="px-1.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-mono text-[10px] border border-cyan-500/20">
            {uniqueCitations.length}
          </span>
        </div>

        {/* Citation Cards */}
        <div className="flex flex-wrap gap-2">
          {uniqueCitations.map((citation, idx) => (
            <button
              key={idx}
              onClick={() => onCitationClick?.(citation)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 hover:bg-cyan-950/30 transition-all group text-left"
            >
              <div className="w-6 h-6 rounded-md bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-medium text-slate-300 group-hover:text-cyan-300 transition-colors max-w-[200px] truncate">
                  {citation.documentName}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  Page {citation.pageNumber}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    )
  }
    </div >
  );
}
