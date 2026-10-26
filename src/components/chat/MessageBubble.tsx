"use client";

import { ChatMessage } from "@/types/chat";
import { Bot, User } from "lucide-react";

interface MessageBubbleProps {
  message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex items-start gap-3 w-full max-w-3xl ${
        isUser ? "ml-auto flex-row-reverse" : "mr-auto"
      }`}
    >
      {/* Avatar Icon */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold ${
          isUser
            ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
            : "bg-slate-800 text-cyan-400 border border-slate-700/80 shadow-md shadow-slate-900/50"
        }`}
        aria-hidden="true"
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      {/* Message Content Bubble */}
      <div
        className={`group relative rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? "bg-indigo-600 text-white rounded-tr-sm shadow-lg shadow-indigo-600/10"
            : "bg-slate-900/90 text-slate-200 border border-slate-800 rounded-tl-sm shadow-lg shadow-black/20"
        }`}
      >
        <div className="whitespace-pre-wrap break-words">{message.content}</div>

        {/* Timestamp */}
        <div
          className={`text-[10px] mt-1.5 font-medium ${
            isUser ? "text-indigo-200 text-right" : "text-slate-500 text-left"
          }`}
        >
          {message.createdAt}
        </div>
      </div>
    </div>
  );
}
