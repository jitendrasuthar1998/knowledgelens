export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-xl w-full border border-slate-800 bg-slate-900/60 backdrop-blur rounded-2xl p-8 shadow-2xl text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Phase 0 Initialized
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          KnowledgeLens
        </h1>
        <p className="text-slate-400 text-sm leading-relaxed">
          AI Document Intelligence Assistant. Next.js 16, React 19, TypeScript,
          and Tailwind CSS setup verified. Ready for Phase 1 (Foundation &amp; Basic LLM Chat).
        </p>
      </div>
    </main>
  );
}
