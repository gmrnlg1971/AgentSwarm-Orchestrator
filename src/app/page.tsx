import SwarmVisualizer from "./components/SwarmVisualizer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050505] text-slate-200 selection:bg-blue-500/30 overflow-hidden relative">
      {/* Background Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-900/20 blur-[120px]" />
        <div className="absolute top-[60%] -right-[10%] w-[50%] h-[50%] rounded-full bg-purple-900/20 blur-[120px]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-24 flex flex-col items-center">
        <div className="text-center max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm font-medium text-slate-300">Live Multi-Agent Orchestration</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-500">
            AgentSwarm
            <br />
            <span className="text-4xl md:text-5xl">Orchestrator</span>
          </h1>
          
          <p className="text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
            A visual demonstration of a LangGraph-style state machine routing a codebase refactor across a Swarm of specialized AI Agents. Watch the context token pass in real-time.
          </p>
        </div>

        <SwarmVisualizer />
      </div>
    </main>
  );
}
