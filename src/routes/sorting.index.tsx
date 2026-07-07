import { createFileRoute, Link } from "@tanstack/react-router";
import { SORTING_LESSONS } from "@/lib/dsa/content/sorting";

export const Route = createFileRoute("/sorting/")({
  head: () => ({
    meta: [
      { title: "Sorting Algorithms — TechKnots" },
      { name: "description", content: "Learn every sorting algorithm — Bubble, Selection, Insertion, Merge, Quick, Heap, Counting, Radix, Bucket — through stories and animations." },
      { property: "og:title", content: "Sorting Algorithms — TechKnots" },
      { property: "og:description", content: "Interactive lessons on every major sorting algorithm." },
    ],
  }),
  component: SortingHub,
});

const GROUPS = [
  { title: "Beginner sorting", slugs: ["bubble-sort", "selection-sort", "insertion-sort"] },
  { title: "Efficient sorting", slugs: ["merge-sort", "quick-sort", "heap-sort"] },
  { title: "Special sorting", slugs: ["counting-sort", "radix-sort", "bucket-sort"] },
];

function SortingHub() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-8 md:py-20">
      <div className="text-xs text-muted-foreground">
        <Link to="/" className="hover:text-foreground">Home</Link> · <span className="text-foreground">Sorting</span>
      </div>
      <h1 className="mt-4 font-display text-5xl font-black">Sorting — Putting things in order</h1>
      <p className="mt-3 max-w-3xl text-lg text-muted-foreground">
        Have you ever arranged students by height, books from A to Z, or numbers from smallest to
        largest? You already use sorting every day. Now let's see how a computer does it — nine
        different ways.
      </p>

      <div className="story-card mt-8 p-6 md:p-8">
        <p className="font-display text-xl font-bold">Why so many algorithms?</p>
        <p className="mt-2 text-base leading-relaxed">
          Give three people 100 books to sort. Person A compares two books at a time. Person B
          finds the smallest first. Person C divides the pile into smaller groups. All three
          finish — but with very different speeds. That's why we have different sorting algorithms.
        </p>
      </div>

      {GROUPS.map((g) => (
        <section key={g.title} className="mt-12">
          <h2 className="font-display text-2xl font-bold md:text-3xl">{g.title}</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {g.slugs.map((slug) => {
              const l = SORTING_LESSONS[slug];
              return (
                <Link
                  key={slug}
                  to="/sorting/$algo"
                  params={{ algo: slug }}
                  className="group panel-card flex flex-col p-5 transition hover:border-primary hover:shadow-lift"
                >
                  <div className="flex items-start justify-between">
                    <span className="text-4xl">{l.emoji}</span>
                    <span className="rounded-full bg-accent/40 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest">
                      {l.difficulty}
                    </span>
                  </div>
                  <h3 className="mt-3 font-display text-xl font-bold">{l.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{l.tagline}</p>
                  <span className="mt-4 text-xs font-bold text-primary group-hover:underline">Visualize →</span>
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
