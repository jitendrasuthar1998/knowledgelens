import { ChatContainer } from "@/components/chat/ChatContainer";
import { BookOpen } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navigation */}
      <nav className="h-14 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md px-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-sm tracking-tight text-white">
              Knowledge<span className="text-cyan-400">Lens</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Phase 1: Basic Chat</span>
          </div>
        </div>
      </nav>

      {/* Main Chat View */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <ChatContainer />
      </main>
    </div>
  );
}
