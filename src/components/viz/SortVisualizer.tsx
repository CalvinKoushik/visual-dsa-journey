import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pause, Play, RotateCcw, StepBack, StepForward } from "lucide-react";
import { SORT_ENGINES, type SortStep } from "@/lib/dsa/sortingEngines";
import { cn } from "@/lib/utils";

interface Props {
  slug: string;
  defaultInput: number[];
  editable?: boolean;
}

export function SortVisualizer({ slug, defaultInput, editable = true }: Props) {
  const [input, setInput] = useState(defaultInput.join(", "));
  const [array, setArray] = useState<number[]>(defaultInput);
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(700);
  const timer = useRef<number | null>(null);

  const engine = SORT_ENGINES[slug];
  const steps = useMemo<SortStep[]>(() => engine(array), [engine, array]);
  const step = steps[Math.min(stepIdx, steps.length - 1)];

  useEffect(() => {
    if (!playing) return;
    if (stepIdx >= steps.length - 1) {
      setPlaying(false);
      return;
    }
    timer.current = window.setTimeout(() => setStepIdx((i) => i + 1), speed);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [playing, stepIdx, steps.length, speed]);

  const applyInput = () => {
    const parsed = input
      .split(/[,\s]+/)
      .map((s) => parseInt(s, 10))
      .filter((n) => Number.isFinite(n) && n >= 0 && n <= 99);
    if (parsed.length >= 2 && parsed.length <= 12) {
      setArray(parsed);
      setStepIdx(0);
      setPlaying(false);
    }
  };

  const shuffle = () => {
    const n = 6 + Math.floor(Math.random() * 3);
    const arr = Array.from({ length: n }, () => Math.floor(Math.random() * 60) + 5);
    setArray(arr);
    setInput(arr.join(", "));
    setStepIdx(0);
    setPlaying(false);
  };

  const maxV = Math.max(...step.array, 1);

  const colorFor = (i: number): string => {
    if (step.sorted.includes(i)) return "bar-done";
    if (step.highlight.includes(i)) {
      if (step.action === "swap") return "bar-swap";
      if (step.action === "pivot") return "bar-pivot";
      if (step.action === "insert" || step.action === "place") return "bar-current";
      return "bar-compare";
    }
    if (step.secondary?.includes(i)) return "bar-pivot";
    return "bar-normal";
  };

  return (
    <div className="panel-card overflow-hidden">
      <div className="grid gap-6 p-6 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="mb-4 flex flex-wrap items-end gap-2">
            {editable && (
              <>
                <label className="flex-1">
                  <span className="text-xs font-semibold text-muted-foreground">Your numbers (2–12)</span>
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                    placeholder="5, 3, 8, 4, 2"
                  />
                </label>
                <button onClick={applyInput} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
                  Use these
                </button>
                <button onClick={shuffle} className="rounded-lg border border-border px-4 py-2 text-sm font-semibold hover:bg-secondary">
                  Random
                </button>
              </>
            )}
          </div>

          <div className="relative flex h-72 items-end justify-center gap-2 rounded-xl bg-secondary/40 p-4">
            {step.array.map((v, i) => (
              <motion.div
                key={i}
                layout
                transition={{ type: "spring", stiffness: 260, damping: 24 }}
                className="flex flex-1 flex-col items-center"
                style={{ maxWidth: 64 }}
              >
                <motion.div
                  className={cn("w-full rounded-t-lg text-center text-xs font-bold text-white/95", colorFor(i))}
                  animate={{ height: `${(v / maxV) * 220 + 24}px` }}
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                >
                  <span className="block pt-2">{v}</span>
                </motion.div>
                <span className="mt-1 text-[10px] text-muted-foreground">{i}</span>
              </motion.div>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              onClick={() => setStepIdx((i) => Math.max(0, i - 1))}
              className="rounded-lg border border-border p-2 hover:bg-secondary"
              aria-label="Previous"
            >
              <StepBack className="h-4 w-4" />
            </button>
            <button
              onClick={() => setPlaying((p) => !p)}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {playing ? "Pause" : "Play"}
            </button>
            <button
              onClick={() => setStepIdx((i) => Math.min(steps.length - 1, i + 1))}
              className="rounded-lg border border-border p-2 hover:bg-secondary"
              aria-label="Next"
            >
              <StepForward className="h-4 w-4" />
            </button>
            <button
              onClick={() => {
                setStepIdx(0);
                setPlaying(false);
              }}
              className="rounded-lg border border-border p-2 hover:bg-secondary"
              aria-label="Reset"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <label className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
              Speed
              <input
                type="range"
                min={150}
                max={1500}
                step={50}
                value={1650 - speed}
                onChange={(e) => setSpeed(1650 - parseInt(e.target.value))}
                className="w-32"
              />
            </label>
          </div>

          <div className="mt-3 flex justify-between text-xs text-muted-foreground">
            <span>
              Step <b className="text-foreground">{stepIdx + 1}</b> / {steps.length}
            </span>
            <span>
              Comparisons: <b className="text-foreground">{step.compareCount}</b> · Swaps:{" "}
              <b className="text-foreground">{step.swapCount}</b>
            </span>
          </div>
        </div>

        <StepPanel step={step} />
      </div>
      <Legend />
    </div>
  );
}

function StepPanel({ step }: { step: SortStep }) {
  return (
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
          <PanelRow label="What are we looking at?" value={step.what} />
          <PanelRow label="What's the question?" value={step.question} />
          <PanelRow label="Decision" value={step.decision} accent />
          <PanelRow label="What happens next?" value={step.next} />
        </motion.div>
      </AnimatePresence>
    </aside>
  );
}

function PanelRow({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className={cn("mt-0.5 leading-snug", accent && "font-semibold text-primary")}>{value}</p>
    </div>
  );
}

function Legend() {
  const items = [
    ["bar-normal", "Normal"],
    ["bar-compare", "Comparing"],
    ["bar-swap", "Swapping"],
    ["bar-pivot", "Pivot / helper"],
    ["bar-current", "Current"],
    ["bar-done", "In place"],
  ];
  return (
    <div className="flex flex-wrap gap-3 border-t border-border bg-secondary/20 px-6 py-3 text-xs">
      {items.map(([c, l]) => (
        <span key={l} className="flex items-center gap-1.5">
          <span className={cn("inline-block h-3 w-4 rounded", c)} />
          {l}
        </span>
      ))}
    </div>
  );
}
