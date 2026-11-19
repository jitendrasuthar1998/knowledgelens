"use client";

import { ChatMessage } from "@/types/chat";
import { Bot, User, BookOpen } from "lucide-react";
import { parseCitations, ParsedCitation } from "@/lib/ai/rag";

interface MessageBubbleProps {
  message: ChatMessage;
  isStreaming?: boolean;
  onCitationClick?: (citation: ParsedCitation) => void;
}

  /**
   * Splits response text into plain segments and citation badges.
   * [Source: Job Description.pdf, Page 1] becomes a clickable badge.
   */
  function renderContentWithCitations(
    text: string,
    citations: ParsedCitation[],
    onCitationClick?: (c: ParsedCitation) => void
  ) {
    if (citations.length === 0) return <span className="whitespace-pre-wrap break-words">{text}</span>;

    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    citations.forEach((citation, idx) => {
      // Text before citation
      if (citation.index > lastIndex) {
        parts.push(
          <span key={`text-${idx}`} className="whitespace-pre-wrap break-words">
            {text.slice(lastIndex, citation.index)}
          </span>
        );
      }

      // Citation badge
      parts.push(
        <button
          key={`cite-${idx}`}
          onClick={() => onCitationClick?.(citation)}
          title={`Source: ${citation.documentName}, Page ${citation.pageNumber}`}
          className="inline-flex items-center gap-1 mx-1 px-2 py-0.5 rounded-md bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-[11px] font-mono font-medium hover:bg-cyan-500/25 transition-colors cursor-pointer align-middle"
        >
          <BookOpen className="w-3 h-3" />
          <span>Page {citation.pageNumber}</span>
        </button>
      );

      lastIndex = citation.index + citation.raw.length;
    });

    // Remaining text after last citation
    if (lastIndex < text.length) {
      parts.push(
        <span key="text-end" className="whitespace-pre-wrap break-words">
          {text.slice(lastIndex)}
        </span>
      );
    }

    return <span>{parts}</span>;
  }

  export function MessageBubble({
    message,
    isStreaming = false,
    onCitationClick,
  }: MessageBubbleProps) {
    const isUser = message.role === "user";

    // Parse citations only from assistant messages (not while streaming)
    const citations = !isUser && !isStreaming ? parseCitations(message.content) : [];

    return (
      <div
        className={`flex items-start gap-3 w-full max-w-3xl ${isUser ? "ml-auto flex-row-reverse" : "mr-auto"
          }`}
      >
        {/* Avatar Icon */}
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold ${isUser
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
              : "bg-slate-800 text-cyan-400 border border-slate-700/80 shadow-md shadow-slate-900/50"
            }`}
          aria-hidden="true"
        >
          {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
        </div>

        {/* Message Content Bubble */}
        <div
          className={`group relative rounded-2xl px-4 py-3 text-sm leading-relaxed ${isUser
              ? "bg-indigo-600 text-white rounded-tr-sm shadow-lg shadow-indigo-600/10"
              : "bg-slate-900/90 text-slate-200 border border-slate-800 rounded-tl-sm shadow-lg shadow-black/20"
            }`}
        >
          <div className="whitespace-pre-wrap break-words">
          {isUser || isStreaming ? (
              <>
                {message.content}
                {isStreaming && (
                  <span
                    className="inline-block w-1.5 h-4 ml-1 bg-cyan-400 animate-pulse align-middle rounded-sm"
                    aria-hidden="true"
                  />
                )}
              </>
            ) : (
              renderContentWithCitations(message.content, citations, onCitationClick)
            )}
          </div>

          {/* Citation Count Badge (shown on assistant messages with sources) */}
          {citations.length > 0 && (
            <div className="mt-2 pt-2 border-t border-slate-700/50 flex items-center gap-1.5 text-[11px] text-slate-500">
              <BookOpen className="w-3 h-3 text-cyan-500" />
              <span>
                {citations.length} source citation{citations.length > 1 ? "s" : ""} — click to inspect
              </span>
            </div>
          )}

          {/* Timestamp */}
          <div
            className={`text-[10px] mt-1.5 font-medium ${isUser ? "text-indigo-200 text-right" : "text-slate-500 text-left"
              }`}
          >
            {message.createdAt}
          </div>
        </div>
      </div>
    );
  }
