import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pause, Play, RotateCcw, StepBack, StepForward } from "lucide-react";
import { bfsSteps, dfsSteps, dijkstraSteps, SAMPLE_GRAPH, type Graph, type GraphStep } from "@/lib/dsa/graphEngines";
import { cn } from "@/lib/utils";

const ENGINES: Record<string, (g: Graph, s: string) => GraphStep[]> = {
  bfs: bfsSteps,
  dfs: dfsSteps,
  dijkstra: dijkstraSteps,
};

interface Props {
  algorithm: "bfs" | "dfs" | "dijkstra";
  start?: string;
  graph?: Graph;
}

export function GraphVisualizer({ algorithm, start = "A", graph = SAMPLE_GRAPH }: Props) {
  const engine = ENGINES[algorithm];
  const steps = useMemo(() => engine(graph, start), [engine, graph, start]);
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timer = useRef<number | null>(null);
  const step = steps[Math.min(idx, steps.length - 1)];

  useEffect(() => {
    if (!playing) return;
    if (idx >= steps.length - 1) return setPlaying(false);
    timer.current = window.setTimeout(() => setIdx((i) => i + 1), 900);
    return () => { if (timer.current) window.clearTimeout(timer.current); };
  }, [playing, idx, steps.length]);

  const isVisited = (id: string) => step.visited.includes(id);
  const isCurrent = (id: string) => step.current === id;
  const isFrontier = (id: string) => step.frontier.includes(id);

  return (
    <div className="panel-card overflow-hidden">
      <div className="grid gap-6 p-6 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="rounded-xl bg-secondary/40 p-4">
            <svg viewBox="0 0 600 320" className="h-72 w-full">
              {graph.edges.map((e, i) => {
                const from = graph.nodes.find((n) => n.id === e.from)!;
                const to = graph.nodes.find((n) => n.id === e.to)!;
                const highlighted =
                  step.edgeHighlight &&
                  ((step.edgeHighlight[0] === e.from && step.edgeHighlight[1] === e.to) ||
                    (step.edgeHighlight[0] === e.to && step.edgeHighlight[1] === e.from));
                return (
                  <g key={i}>
                    <line
                      x1={from.x}
                      y1={from.y}
                      x2={to.x}
                      y2={to.y}
                      stroke={highlighted ? "var(--viz-current)" : "var(--border)"}
                      strokeWidth={highlighted ? 4 : 2}
                    />
                    {e.weight !== undefined && (
                      <text
                        x={(from.x + to.x) / 2}
                        y={(from.y + to.y) / 2 - 6}
                        textAnchor="middle"
                        className="fill-muted-foreground text-[11px] font-semibold"
                      >
                        {e.weight}
                      </text>
                    )}
                  </g>
                );
              })}
              {graph.nodes.map((n) => {
                const color = isCurrent(n.id)
                  ? "var(--viz-current)"
                  : isVisited(n.id)
                    ? "var(--viz-done)"
                    : isFrontier(n.id)
                      ? "var(--viz-visit)"
                      : "var(--viz-idle)";
                return (
                  <g key={n.id}>
                    <motion.circle
                      cx={n.x}
                      cy={n.y}
                      r={22}
                      fill={color}
                      stroke="var(--card)"
                      strokeWidth={3}
                      animate={{ scale: isCurrent(n.id) ? 1.15 : 1 }}
                      style={{ transformOrigin: `${n.x}px ${n.y}px` }}
                    />
                    <text x={n.x} y={n.y + 4} textAnchor="middle" className="fill-white text-sm font-bold">
                      {n.id}
                    </text>
                    {step.distances && (
                      <text x={n.x} y={n.y + 38} textAnchor="middle" className="fill-foreground text-[11px] font-semibold">
                        {step.distances[n.id] === Infinity ? "∞" : step.distances[n.id]}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-border bg-card p-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                {algorithm === "dfs" ? "Stack" : algorithm === "bfs" ? "Queue" : "Unvisited"}
              </p>
              <p className="mt-1 font-mono text-sm">{step.frontier.join(" → ") || "empty"}</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Visited</p>
              <p className="mt-1 font-mono text-sm">{step.visited.join(", ") || "none"}</p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button onClick={() => setIdx((i) => Math.max(0, i - 1))} className="rounded-lg border border-border p-2 hover:bg-secondary">
              <StepBack className="h-4 w-4" />
            </button>
            <button
              onClick={() => setPlaying((p) => !p)}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {playing ? "Pause" : "Play"}
            </button>
            <button onClick={() => setIdx((i) => Math.min(steps.length - 1, i + 1))} className="rounded-lg border border-border p-2 hover:bg-secondary">
              <StepForward className="h-4 w-4" />
            </button>
            <button
              onClick={() => { setIdx(0); setPlaying(false); }}
              className="rounded-lg border border-border p-2 hover:bg-secondary"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <span className="ml-auto text-xs text-muted-foreground">
              Step <b className="text-foreground">{idx + 1}</b> / {steps.length}
            </span>
          </div>
        </div>

        <aside className="flex flex-col gap-3 rounded-xl border border-border bg-secondary/30 p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-primary">Current step</p>
          <AnimatePresence mode="wait">
            <motion.div
              key={step.what + step.decision}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="space-y-3 text-sm"
            >
              <Row label="What are we looking at?" value={step.what} />
              <Row label="What's the question?" value={step.question} />
              <Row label="Decision" value={step.decision} accent />
              <Row label="What happens next?" value={step.next} />
            </motion.div>
          </AnimatePresence>
        </aside>
      </div>
      <div className="flex flex-wrap gap-3 border-t border-border bg-secondary/20 px-6 py-3 text-xs">
        <LegendDot color="var(--viz-idle)" label="Not visited" />
        <LegendDot color="var(--viz-visit)" label="In queue/stack" />
        <LegendDot color="var(--viz-current)" label="Current" />
        <LegendDot color="var(--viz-done)" label="Visited" />
      </div>
    </div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className={cn("mt-0.5 leading-snug", accent && "font-semibold text-primary")}>{value}</p>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="inline-block h-3 w-3 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}
