import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pause, Play, RotateCcw, StepBack, StepForward } from "lucide-react";
import { factorialSteps, fibonacciSteps, hanoiSteps } from "@/lib/dsa/recursionEngines";
import { cn } from "@/lib/utils";

/* ---------------- Factorial call-stack viz ---------------- */
export function FactorialVisualizer({ defaultN = 5 }: { defaultN?: number }) {
  const [n, setN] = useState(defaultN);
  const steps = useMemo(() => factorialSteps(n), [n]);
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

  return (
    <div className="panel-card overflow-hidden">
      <div className="grid gap-6 p-6 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="mb-3 flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm">
              n =
              <input
                type="number"
                min={0}
                max={7}
                value={n}
                onChange={(e) => { setN(Math.max(0, Math.min(7, parseInt(e.target.value) || 0))); setIdx(0); setPlaying(false); }}
                className="w-16 rounded-lg border border-input bg-background px-2 py-1"
              />
            </label>
          </div>

          <div className="min-h-72 rounded-xl bg-secondary/40 p-4">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">Call stack (top = current)</p>
            <div className="flex flex-col-reverse gap-1.5">
              <AnimatePresence>
                {step.frames.map((f) => (
                  <motion.div
                    key={f.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className={cn(
                      "flex items-center justify-between rounded-lg border-l-4 bg-card px-3 py-2 shadow-sm",
                      f.result !== undefined ? "border-l-[var(--viz-done)]" : "border-l-[var(--viz-current)]",
                    )}
                    style={{ marginLeft: f.depth * 16 }}
                  >
                    <span className="font-mono text-sm font-semibold">{f.label}</span>
                    <span className="text-xs text-muted-foreground">
                      {f.result !== undefined ? `returns ${f.result}` : "waiting…"}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <Controls
            idx={idx}
            total={steps.length}
            playing={playing}
            onPlay={() => setPlaying((p) => !p)}
            onPrev={() => setIdx((i) => Math.max(0, i - 1))}
            onNext={() => setIdx((i) => Math.min(steps.length - 1, i + 1))}
            onReset={() => { setIdx(0); setPlaying(false); }}
          />
        </div>
        <StepPanel step={step} />
      </div>
    </div>
  );
}

/* ---------------- Fibonacci tree viz ---------------- */
export function FibonacciVisualizer({ defaultN = 5 }: { defaultN?: number }) {
  const [n, setN] = useState(defaultN);
  const steps = useMemo(() => fibonacciSteps(n), [n]);
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timer = useRef<number | null>(null);
  const step = steps[Math.min(idx, steps.length - 1)];

  useEffect(() => {
    if (!playing) return;
    if (idx >= steps.length - 1) return setPlaying(false);
    timer.current = window.setTimeout(() => setIdx((i) => i + 1), 700);
    return () => { if (timer.current) window.clearTimeout(timer.current); };
  }, [playing, idx, steps.length]);

  return (
    <div className="panel-card overflow-hidden">
      <div className="grid gap-6 p-6 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="mb-3 flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm">
              n =
              <input
                type="number"
                min={0}
                max={6}
                value={n}
                onChange={(e) => { setN(Math.max(0, Math.min(6, parseInt(e.target.value) || 0))); setIdx(0); setPlaying(false); }}
                className="w-16 rounded-lg border border-input bg-background px-2 py-1"
              />
            </label>
          </div>
          <div className="min-h-72 rounded-xl bg-secondary/40 p-4">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">Recursion tree</p>
            <div className="flex flex-wrap gap-2">
              <AnimatePresence>
                {step.nodes.map((nd) => (
                  <motion.div
                    key={nd.id}
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={cn(
                      "grid place-items-center rounded-full border-2 text-xs font-bold",
                      nd.id === step.currentId
                        ? "border-[var(--viz-current)] bg-[color-mix(in_oklab,var(--viz-current)_15%,var(--card))]"
                        : nd.result !== undefined
                          ? "border-[var(--viz-done)] bg-[color-mix(in_oklab,var(--viz-done)_15%,var(--card))]"
                          : "border-border bg-card",
                    )}
                    style={{ width: 56, height: 56 }}
                    title={`fib(${nd.n})`}
                  >
                    <div>
                      <div>fib({nd.n})</div>
                      {nd.result !== undefined && <div className="text-[10px] font-normal text-muted-foreground">= {nd.result}</div>}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
          <Controls
            idx={idx}
            total={steps.length}
            playing={playing}
            onPlay={() => setPlaying((p) => !p)}
            onPrev={() => setIdx((i) => Math.max(0, i - 1))}
            onNext={() => setIdx((i) => Math.min(steps.length - 1, i + 1))}
            onReset={() => { setIdx(0); setPlaying(false); }}
          />
        </div>
        <StepPanel step={step} />
      </div>
    </div>
  );
}

/* ---------------- Tower of Hanoi ---------------- */
export function HanoiVisualizer({ defaultDisks = 3 }: { defaultDisks?: number }) {
  const [n, setN] = useState(defaultDisks);
  const steps = useMemo(() => hanoiSteps(n), [n]);
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timer = useRef<number | null>(null);
  const step = steps[Math.min(idx, steps.length - 1)];

  useEffect(() => {
    if (!playing) return;
    if (idx >= steps.length - 1) return setPlaying(false);
    timer.current = window.setTimeout(() => setIdx((i) => i + 1), 700);
    return () => { if (timer.current) window.clearTimeout(timer.current); };
  }, [playing, idx, steps.length]);

  const names = ["A", "B", "C"];

  return (
    <div className="panel-card overflow-hidden">
      <div className="grid gap-6 p-6 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="mb-3 flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm">
              Disks =
              <input
                type="number"
                min={2}
                max={6}
                value={n}
                onChange={(e) => { setN(Math.max(2, Math.min(6, parseInt(e.target.value) || 2))); setIdx(0); setPlaying(false); }}
                className="w-16 rounded-lg border border-input bg-background px-2 py-1"
              />
            </label>
            <span className="text-xs text-muted-foreground">Move {step.moveNumber} of {(1 << n) - 1}</span>
          </div>

          <div className="grid h-72 grid-cols-3 items-end gap-4 rounded-xl bg-secondary/40 p-4">
            {step.towers.map((tower, ti) => (
              <div key={ti} className="relative flex h-full flex-col items-center justify-end">
                <div className="absolute bottom-6 h-full w-1 rounded bg-muted-foreground/40" />
                <div className="relative z-10 flex w-full flex-col items-center justify-end gap-1">
                  <AnimatePresence>
                    {tower.map((disk) => (
                      <motion.div
                        key={disk}
                        layoutId={`disk-${disk}`}
                        transition={{ type: "spring", stiffness: 260, damping: 22 }}
                        className={cn(
                          "rounded-md text-center text-[10px] font-bold text-white",
                          step.moving?.disk === disk ? "bar-current" : "bar-normal",
                        )}
                        style={{ width: `${20 + disk * 22}px`, height: 22, lineHeight: "22px" }}
                      >
                        {disk}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
                <div className="mt-1 h-1.5 w-full rounded bg-muted-foreground/50" />
                <span className="mt-1 text-xs font-bold">{names[ti]}</span>
              </div>
            ))}
          </div>

          <Controls
            idx={idx}
            total={steps.length}
            playing={playing}
            onPlay={() => setPlaying((p) => !p)}
            onPrev={() => setIdx((i) => Math.max(0, i - 1))}
            onNext={() => setIdx((i) => Math.min(steps.length - 1, i + 1))}
            onReset={() => { setIdx(0); setPlaying(false); }}
          />
        </div>
        <StepPanel step={step} />
      </div>
    </div>
  );
}

/* ---------------- Shared UI ---------------- */
function StepPanel({ step }: { step: { what: string; question: string; decision: string; next: string } }) {
  return (
    <aside className="flex flex-col gap-3 rounded-xl border border-border bg-secondary/30 p-4">
      <p className="text-xs font-bold uppercase tracking-wider text-primary">Current step</p>
      <AnimatePresence mode="wait">
        <motion.div key={step.what + step.decision} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-3 text-sm">
          <Row label="What are we looking at?" value={step.what} />
          <Row label="What's the question?" value={step.question} />
          <Row label="Decision" value={step.decision} accent />
          <Row label="What happens next?" value={step.next} />
        </motion.div>
      </AnimatePresence>
    </aside>
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

function Controls({ idx, total, playing, onPlay, onPrev, onNext, onReset }: any) {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      <button onClick={onPrev} className="rounded-lg border border-border p-2 hover:bg-secondary">
        <StepBack className="h-4 w-4" />
      </button>
      <button onClick={onPlay} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
        {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        {playing ? "Pause" : "Play"}
      </button>
      <button onClick={onNext} className="rounded-lg border border-border p-2 hover:bg-secondary">
        <StepForward className="h-4 w-4" />
      </button>
      <button onClick={onReset} className="rounded-lg border border-border p-2 hover:bg-secondary">
        <RotateCcw className="h-4 w-4" />
      </button>
      <span className="ml-auto text-xs text-muted-foreground">
        Step <b className="text-foreground">{idx + 1}</b> / {total}
      </span>
    </div>
  );
}
