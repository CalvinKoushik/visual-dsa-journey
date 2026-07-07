import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/practice")({
  head: () => ({
    meta: [
      { title: "Practice — TechKnots" },
      { name: "description", content: "Test what you've learned with interactive DSA challenges. Wrong answers are explained, never punished." },
      { property: "og:title", content: "Practice — TechKnots" },
      { property: "og:description", content: "Interactive DSA practice challenges with explanations." },
    ],
  }),
  component: Practice,
});

const QUESTIONS = [
  {
    q: "Given [5, 3, 8, 4, 2], which pair will Bubble Sort compare FIRST?",
    options: ["3 and 8", "5 and 3", "8 and 4", "4 and 2"],
    answer: 1,
    why: "Bubble Sort starts at the very beginning — position 0 and position 1.",
  },
  {
    q: "After one full pass of Bubble Sort on [5, 3, 8, 4, 2], which value sits at the last position?",
    options: ["2", "5", "8", "4"],
    answer: 2,
    why: "The largest value bubbles all the way to the end after the first pass.",
  },
  {
    q: "In BFS on a graph starting at A, which nodes are visited before deeper ones?",
    options: ["The furthest ones", "The direct neighbours of A", "Random nodes", "None of A's neighbours"],
    answer: 1,
    why: "BFS explores level by level — all direct neighbours are visited before their neighbours.",
  },
  {
    q: "What is the base case in a recursive factorial function?",
    options: ["n == 100", "n <= 1", "n == n", "There is no base case"],
    answer: 1,
    why: "factorial(0) and factorial(1) both equal 1 — no more recursion needed.",
  },
  {
    q: "In Quick Sort, after partitioning, the pivot is…",
    options: ["Discarded", "In its final sorted position", "At index 0", "Duplicated"],
    answer: 1,
    why: "Everything smaller goes left of the pivot, everything larger goes right — the pivot lands in its correct place.",
  },
  {
    q: "Which data structure does DFS use?",
    options: ["Queue", "Stack (or recursion)", "Heap", "Hash map"],
    answer: 1,
    why: "LIFO ordering makes it go deep before wide.",
  },
  {
    q: "In Tower of Hanoi with 4 disks, how many moves are required minimum?",
    options: ["4", "8", "15", "16"],
    answer: 2,
    why: "2⁴ − 1 = 15.",
  },
];

function Practice() {
  const [picks, setPicks] = useState<Record<number, number>>({});
  const [i, setI] = useState(0);
  const q = QUESTIONS[i];
  const picked = picks[i];
  const answered = picked !== undefined;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:px-8 md:py-20">
      <h1 className="font-display text-5xl font-black">Practice</h1>
      <p className="mt-3 text-lg text-muted-foreground">
        Answer at your own pace. Wrong answers are explained, never punished.
      </p>

      <div className="panel-card mt-8 p-6 md:p-8">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Question {i + 1} of {QUESTIONS.length}</span>
          <span>Score: {Object.entries(picks).filter(([k, v]) => QUESTIONS[+k].answer === v).length} / {Object.keys(picks).length || 0}</span>
        </div>
        <h2 className="mt-3 font-display text-2xl font-bold">{q.q}</h2>
        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          {q.options.map((o, oi) => {
            const isCorrect = oi === q.answer;
            const isPicked = picked === oi;
            return (
              <button
                key={oi}
                onClick={() => setPicks((p) => ({ ...p, [i]: oi }))}
                disabled={answered}
                className={cn(
                  "flex items-center justify-between gap-2 rounded-xl border-2 px-4 py-3 text-left text-sm font-semibold transition",
                  !answered && "border-border hover:border-primary hover:bg-secondary",
                  answered && isCorrect && "border-[var(--viz-done)] bg-[color-mix(in_oklab,var(--viz-done)_12%,var(--card))]",
                  answered && isPicked && !isCorrect && "border-[var(--viz-swap)] bg-[color-mix(in_oklab,var(--viz-swap)_10%,var(--card))]",
                )}
              >
                {o}
                {answered && isCorrect && <CheckCircle2 className="h-4 w-4 text-[var(--viz-done)]" />}
                {answered && isPicked && !isCorrect && <XCircle className="h-4 w-4 text-[var(--viz-swap)]" />}
              </button>
            );
          })}
        </div>
        {answered && (
          <p className="mt-4 rounded-xl bg-secondary/50 p-4 text-sm">
            <b className="text-primary">Why: </b>{q.why}
          </p>
        )}
        <div className="mt-6 flex items-center justify-between">
          <button onClick={() => setI((v) => Math.max(0, v - 1))} disabled={i === 0} className="rounded-lg border border-border px-4 py-2 text-sm font-semibold disabled:opacity-40">
            Previous
          </button>
          <button onClick={() => setI((v) => Math.min(QUESTIONS.length - 1, v + 1))} disabled={i === QUESTIONS.length - 1} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-40">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
