"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrainCircuit, Wrench, ShieldCheck, Play, Server, Code, CheckCircle, AlertTriangle } from "lucide-react";

type AgentStatus = "idle" | "processing" | "passing" | "success" | "warning" | "starting" | "complete";

interface AgentLog {
  id: number;
  agent: string;
  message: string;
  status: AgentStatus;
}

const agents = [
  { id: "architect", name: "Architect Agent", role: "Repository Analysis", icon: BrainCircuit, color: "text-blue-400", border: "border-blue-500/50", bg: "bg-blue-500/10" },
  { id: "refactorer", name: "Refactor Agent", role: "Code Optimization", icon: Wrench, color: "text-purple-400", border: "border-purple-500/50", bg: "bg-purple-500/10" },
  { id: "qa", name: "QA Agent", role: "Static Analysis & Tests", icon: ShieldCheck, color: "text-emerald-400", border: "border-emerald-500/50", bg: "bg-emerald-500/10" }
];

export default function SwarmVisualizer() {
  const [activeNode, setActiveNode] = useState<string>("none");
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const startSwarm = () => {
    if (isRunning) return;
    setIsRunning(true);
    setLogs([]);
    setActiveNode("none");

    let logId = 0;
    const eventSource = new EventSource("/api/orchestrate");

    eventSource.addEventListener("active_node", (e) => {
      const data = JSON.parse(e.data);
      setActiveNode(data.nodeId);
    });

    eventSource.addEventListener("status", (e) => {
      const data = JSON.parse(e.data);
      setLogs((prev) => [...prev, { id: logId++, ...data }]);
    });

    eventSource.addEventListener("done", () => {
      setIsRunning(false);
      eventSource.close();
    });

    eventSource.addEventListener("error", () => {
      setIsRunning(false);
      eventSource.close();
    });
  };

  return (
    <div className="flex flex-col md:flex-row w-full max-w-7xl mx-auto gap-8 p-6">
      
      {/* Left Column: Visualization */}
      <div className="flex-1 flex flex-col gap-8 items-center justify-center relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-transparent to-purple-900/10 rounded-3xl blur-3xl -z-10" />
        
        <div className="w-full max-w-md flex flex-col gap-12 relative z-10">
          {agents.map((agent, index) => {
            const isActive = activeNode === agent.id;
            const Icon = agent.icon;
            
            return (
              <div key={agent.id} className="relative w-full flex justify-center">
                
                {/* Connecting Lines (Simulated) */}
                {index < agents.length - 1 && (
                  <div className="absolute h-12 w-0.5 bg-slate-800 -bottom-12 left-1/2 -translate-x-1/2">
                    <motion.div 
                      className={`w-full h-full ${isActive ? 'bg-gradient-to-b from-blue-400 to-purple-400' : ''}`}
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: isActive ? 1 : 0 }}
                      transition={{ duration: 1 }}
                      style={{ originY: 0 }}
                    />
                  </div>
                )}

                <motion.div
                  className={`relative w-full flex items-center gap-4 p-6 rounded-2xl border bg-slate-950/80 backdrop-blur-xl transition-all duration-500
                    ${isActive ? `scale-105 shadow-2xl ${agent.border} ${agent.bg}` : 'border-slate-800 scale-100 shadow-none'}
                  `}
                  animate={{
                    y: isActive ? -5 : 0,
                  }}
                >
                  <div className={`p-4 rounded-xl ${isActive ? agent.bg : 'bg-slate-900'}`}>
                    <Icon className={`w-8 h-8 ${isActive ? agent.color : 'text-slate-500'}`} />
                  </div>
                  <div>
                    <h3 className={`font-semibold text-lg ${isActive ? 'text-white' : 'text-slate-300'}`}>{agent.name}</h3>
                    <p className="text-sm text-slate-500">{agent.role}</p>
                  </div>

                  {isActive && (
                    <motion.div 
                      className="absolute -right-3 -top-3"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      <span className="flex h-6 w-6 relative">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${agent.bg}`}></span>
                        <span className={`relative inline-flex rounded-full h-6 w-6 border-2 border-slate-900 ${agent.bg}`}></span>
                      </span>
                    </motion.div>
                  )}
                </motion.div>
              </div>
            );
          })}
        </div>

        <button
          onClick={startSwarm}
          disabled={isRunning}
          className={`mt-8 px-8 py-4 rounded-xl font-bold flex items-center gap-2 transition-all
            ${isRunning 
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
              : 'bg-white text-black hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]'
            }`}
        >
          {isRunning ? <Server className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 fill-current" />}
          {isRunning ? "Orchestrating Swarm..." : "Execute Code Review Swarm"}
        </button>
      </div>

      {/* Right Column: Server Logs */}
      <div className="flex-1 w-full max-w-lg h-[600px] border border-slate-800 rounded-3xl bg-slate-950/50 backdrop-blur-2xl flex flex-col overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex items-center gap-3">
          <Code className="w-5 h-5 text-slate-400" />
          <h2 className="font-semibold text-slate-200">Swarm Telemetry</h2>
          <div className="ml-auto flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
            <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 font-mono text-sm flex flex-col gap-4">
          <AnimatePresence>
            {logs.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col gap-1"
              >
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 text-xs">[{new Date().toLocaleTimeString()}]</span>
                  <span className={`font-semibold ${
                    log.agent === 'System' ? 'text-slate-400' :
                    log.agent === 'Architect_Agent' ? 'text-blue-400' :
                    log.agent === 'Refactor_Agent' ? 'text-purple-400' :
                    'text-emerald-400'
                  }`}>{log.agent}</span>
                </div>
                
                <div className="flex items-start gap-2 pl-2">
                  {log.status === 'success' || log.status === 'complete' ? (
                    <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  ) : log.status === 'warning' ? (
                    <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 shrink-0" />
                  ) : log.status === 'processing' ? (
                    <div className="w-4 h-4 border-2 border-slate-600 border-t-slate-400 rounded-full animate-spin mt-0.5 shrink-0" />
                  ) : (
                    <div className="w-4 h-4 text-slate-600 mt-0.5 shrink-0 flex items-center justify-center">›</div>
                  )}
                  <span className={`${
                    log.status === 'warning' ? 'text-yellow-400/90' :
                    log.status === 'success' || log.status === 'complete' ? 'text-emerald-400/90' :
                    'text-slate-300'
                  }`}>
                    {log.message}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={logEndRef} />
        </div>
      </div>
    </div>
  );
}
