import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SortVisualizer } from "@/components/viz/SortVisualizer";
import { SORTING_LESSONS } from "@/lib/dsa/content/sorting";

export const Route = createFileRoute("/compare")({
  head: () => ({
    meta: [
      { title: "Compare Algorithms — TechKnots" },
      { name: "description", content: "Run two sorting algorithms side by side on the same input and see how they compare." },
      { property: "og:title", content: "Compare Algorithms — TechKnots" },
      { property: "og:description", content: "Side-by-side visual comparison of any two sorting algorithms." },
    ],
  }),
  component: Compare,
});

const SORTS = Object.keys(SORTING_LESSONS);

function Compare() {
  const [a, setA] = useState("bubble-sort");
  const [b, setB] = useState("merge-sort");
  const [input, setInput] = useState("5, 3, 8, 4, 2, 7");
  const [committed, setCommitted] = useState([5, 3, 8, 4, 2, 7]);

  const apply = () => {
    const parsed = input
      .split(/[,\s]+/)
      .map((s) => parseInt(s, 10))
      .filter((n) => Number.isFinite(n) && n >= 0 && n <= 99);
    if (parsed.length >= 2 && parsed.length <= 10) setCommitted(parsed);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-20">
      <h1 className="font-display text-5xl font-black">Compare algorithms</h1>
      <p className="mt-3 max-w-3xl text-lg text-muted-foreground">
        Both algorithms produce the same sorted list — but they take very different paths. Pick
        two, hit play, and watch how they differ in comparisons, swaps and speed.
      </p>

      <div className="panel-card mt-8 flex flex-wrap items-end gap-3 p-5">
        <label className="flex-1 min-w-40">
          <span className="text-xs font-semibold text-muted-foreground">Left</span>
          <select value={a} onChange={(e) => setA(e.target.value)} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
            {SORTS.map((s) => <option key={s} value={s}>{SORTING_LESSONS[s].name}</option>)}
          </select>
        </label>
        <label className="flex-1 min-w-40">
          <span className="text-xs font-semibold text-muted-foreground">Right</span>
          <select value={b} onChange={(e) => setB(e.target.value)} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
            {SORTS.map((s) => <option key={s} value={s}>{SORTING_LESSONS[s].name}</option>)}
          </select>
        </label>
        <label className="flex-[2] min-w-60">
          <span className="text-xs font-semibold text-muted-foreground">Numbers (2–10)</span>
          <input value={input} onChange={(e) => setInput(e.target.value)} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
        </label>
        <button onClick={apply} className="rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:brightness-110">
          Apply
        </button>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="mb-2 font-display text-xl font-bold">{SORTING_LESSONS[a].name}</h2>
          <SortVisualizer slug={a} defaultInput={committed} editable={false} />
        </div>
        <div>
          <h2 className="mb-2 font-display text-xl font-bold">{SORTING_LESSONS[b].name}</h2>
          <SortVisualizer slug={b} defaultInput={committed} editable={false} />
        </div>
      </div>

      <div className="panel-card mt-8 p-6">
        <h3 className="font-display text-xl font-bold">The takeaway</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Watch the step counts and the number of comparisons and swaps. Simple algorithms like
          Bubble and Selection use lots of comparisons; divide-and-conquer methods like Merge and
          Quick get there in dramatically fewer steps as the input grows.
        </p>
      </div>
    </div>
  );
}
