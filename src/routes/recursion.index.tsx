import { createFileRoute, Link } from "@tanstack/react-router";
import { RECURSION_LESSONS } from "@/lib/dsa/content/recursion";

export const Route = createFileRoute("/recursion/")({
  head: () => ({
    meta: [
      { title: "Recursion — TechKnots" },
      { name: "description", content: "Learn recursion through boxes-inside-boxes stories, factorials, Fibonacci and Tower of Hanoi — with live call-stack visualizations." },
      { property: "og:title", content: "Recursion — TechKnots" },
      { property: "og:description", content: "Every recursion concept explained through real-life stories and live animations." },
    ],
  }),
  component: Hub,
});

const GROUPS = [
  { title: "Core concepts", slugs: ["what-is-recursion", "base-case", "recursive-case", "call-stack"] },
  { title: "Types of recursion", slugs: ["direct-recursion", "indirect-recursion", "tail-recursion", "tree-recursion"] },
  { title: "Classic examples", slugs: ["factorial", "fibonacci", "sum-natural", "reverse-string", "power", "recursive-binary-search", "tower-of-hanoi", "tree-traversal"] },
];

function Hub() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-8 md:py-20">
      <div className="text-xs text-muted-foreground">
        <Link to="/" className="hover:text-foreground">Home</Link> · <span className="text-foreground">Recursion</span>
      </div>
      <h1 className="mt-4 font-display text-5xl font-black">Recursion — a problem that calls itself</h1>
      <p className="mt-3 max-w-3xl text-lg text-muted-foreground">
        You unwrap a box. Inside is a smaller box. Inside <em>that</em> is a smaller box. You keep
        doing the same action until there's no more box. That's recursion.
      </p>

      {GROUPS.map((g) => (
        <section key={g.title} className="mt-10">
          <h2 className="font-display text-2xl font-bold">{g.title}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {g.slugs.map((slug) => {
              const l = RECURSION_LESSONS[slug];
              return (
                <Link
                  key={slug}
                  to="/recursion/$topic"
                  params={{ topic: slug }}
                  className="group panel-card flex items-start gap-3 p-4 transition hover:border-primary"
                >
                  <span className="text-3xl">{l.emoji}</span>
                  <div className="flex-1">
                    <p className="font-display text-base font-bold group-hover:text-primary">{l.name}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{l.tagline}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
