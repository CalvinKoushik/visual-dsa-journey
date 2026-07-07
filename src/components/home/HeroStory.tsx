import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Animated three-scene hero story that runs on the home page.
 * Scene 1: five people rearrange from unsorted → sorted (Sorting).
 * Scene 2: a person asks a smaller version of themselves for help (Recursion).
 * Scene 3: cities connected by roads with a traveller (Graphs).
 */
export function HomeHeroStory() {
  const [scene, setScene] = useState(0);
  useEffect(() => {
    const t = window.setInterval(() => setScene((s) => (s + 1) % 3), 5500);
    return () => window.clearInterval(t);
  }, []);

  return (
    <div className="story-card relative flex h-[420px] flex-col overflow-hidden p-6 md:h-[500px]">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold uppercase tracking-widest text-muted-foreground">Live story</span>
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <button
              key={i}
              onClick={() => setScene(i)}
              className={`h-1.5 w-6 rounded-full transition ${scene === i ? "bg-primary" : "bg-muted-foreground/30"}`}
              aria-label={`Scene ${i + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="relative mt-4 flex-1">
        <AnimatePresence mode="wait">
          {scene === 0 && <SortScene key="sort" />}
          {scene === 1 && <RecursionScene key="rec" />}
          {scene === 2 && <GraphScene key="g" />}
        </AnimatePresence>
      </div>
    </div>
  );
}

function SortScene() {
  const heights = [5, 3, 8, 4, 2];
  const [sorted, setSorted] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setSorted(true), 1200);
    return () => window.clearTimeout(t);
  }, []);
  const order = sorted ? [...heights].sort((a, b) => a - b) : heights;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex h-full flex-col items-center justify-between">
      <p className="text-center text-lg font-semibold">
        {sorted ? "You just understood Sorting." : "Imagine asking people to stand from shortest to tallest."}
      </p>
      <div className="flex w-full items-end justify-center gap-3">
        {order.map((h, i) => (
          <motion.div
            key={h}
            layout
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="flex flex-col items-center"
          >
            <motion.div
              animate={{ height: `${h * 22 + 40}px` }}
              transition={{ duration: 0.6 }}
              className="w-14 rounded-t-2xl bar-normal shadow-sm"
              style={{ background: `oklch(0.6 0.16 ${180 + h * 20})` }}
            />
            <div className="mt-1 text-xs font-bold">{h}</div>
          </motion.div>
        ))}
      </div>
      <p className="text-center text-xs text-muted-foreground">
        {sorted ? "2 → 3 → 4 → 5 → 8" : "5, 3, 8, 4, 2"}
      </p>
    </motion.div>
  );
}

function RecursionScene() {
  const boxes = [1, 2, 3, 4];
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex h-full flex-col items-center justify-between">
      <p className="text-center text-lg font-semibold">
        A big problem asks a smaller version of itself for help. That's Recursion.
      </p>
      <div className="flex items-center justify-center gap-3">
        {boxes.map((b, i) => (
          <motion.div
            key={b}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.3, type: "spring" }}
            className="grid place-items-center rounded-xl border-2 border-primary/40 bg-card text-lg font-bold shadow-sm"
            style={{ width: 40 + (boxes.length - i) * 20, height: 40 + (boxes.length - i) * 20 }}
          >
            {b}
          </motion.div>
        ))}
      </div>
      <p className="text-center text-xs text-muted-foreground">
        solve(4) → solve(3) → solve(2) → solve(1) → done
      </p>
    </motion.div>
  );
}

function GraphScene() {
  const cities = [
    { id: "A", x: 15, y: 30 },
    { id: "B", x: 50, y: 15 },
    { id: "C", x: 85, y: 25 },
    { id: "D", x: 30, y: 75 },
    { id: "E", x: 70, y: 80 },
  ];
  const edges = [
    ["A", "B"], ["B", "C"], ["A", "D"], ["B", "E"], ["D", "E"], ["C", "E"],
  ];
  const [path, setPath] = useState(0);
  useEffect(() => {
    const t = window.setInterval(() => setPath((p) => (p + 1) % cities.length), 900);
    return () => window.clearInterval(t);
  }, []);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex h-full flex-col items-center justify-between">
      <p className="text-center text-lg font-semibold">
        Cities connected by roads. Someone travels between them. That's a Graph.
      </p>
      <div className="relative h-56 w-full max-w-md">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
          {edges.map(([a, b], i) => {
            const A = cities.find((c) => c.id === a)!;
            const B = cities.find((c) => c.id === b)!;
            return (
              <line
                key={i}
                x1={A.x}
                y1={A.y}
                x2={B.x}
                y2={B.y}
                stroke="var(--border)"
                strokeWidth={0.5}
              />
            );
          })}
        </svg>
        {cities.map((c, i) => (
          <motion.div
            key={c.id}
            animate={{ scale: path === i ? 1.4 : 1 }}
            className="absolute grid h-9 w-9 place-items-center rounded-full border-2 border-card text-sm font-bold text-white shadow-lift"
            style={{
              left: `calc(${c.x}% - 18px)`,
              top: `calc(${c.y}% - 18px)`,
              background: path === i ? "var(--viz-current)" : "var(--viz-normal)",
            }}
          >
            {c.id}
          </motion.div>
        ))}
      </div>
      <p className="text-center text-xs text-muted-foreground">
        DSA is not difficult when you can see it.
      </p>
    </motion.div>
  );
}
