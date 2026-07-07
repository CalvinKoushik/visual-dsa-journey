import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, PlayCircle, Sparkles, Zap } from "lucide-react";
import { HomeHeroStory } from "@/components/home/HeroStory";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 md:grid-cols-2 md:px-8 md:py-24">
          <div className="flex flex-col justify-center">
            <div className="mb-6">
  <img
    src="/images/techknots-logo.png"
    alt="TechKnots - One knot at a time"
    className="h-auto w-72 max-w-full object-contain md:w-80"
  />
</div>
            <h1 className="font-display text-5xl font-black leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
              What if you could <span className="gradient-text">see an algorithm thinking?</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg text-muted-foreground md:text-xl">
              Learn Data Structures and Algorithms through stories, real-life examples and
              step-by-step animations. No coding background required.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/learn-dsa" className="group inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-lift transition hover:brightness-110">
                Start from zero
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </Link>
              <Link to="/sorting" className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-bold hover:border-primary hover:bg-secondary">
                <PlayCircle className="h-4 w-4" />
                Explore visualizers
              </Link>
              <Link to="/compare" className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-bold hover:bg-secondary">
                I already know the basics
              </Link>
            </div>

            <p className="mt-8 text-sm text-muted-foreground">
              <b className="text-foreground">Every topic is unlocked.</b> No sign-up, no premium,
              no "coming soon" — just learn.
            </p>
          </div>

          <HomeHeroStory />
        </div>
      </section>

      {/* Three worlds */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="mb-10 max-w-2xl">
          <h2 className="font-display text-3xl font-black md:text-4xl">Three worlds to explore</h2>
          <p className="mt-2 text-muted-foreground">
            Every world starts with a real-life story, then gently walks you to the code.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          <WorldCard
            to="/sorting"
            emoji="📊"
            title="Sorting"
            oneLine="Putting things in the correct order."
            realLife="Arranging students by height."
            colorClass="from-[color-mix(in_oklab,var(--viz-normal)_20%,transparent)] to-transparent"
          />
          <WorldCard
            to="/recursion"
            emoji="🎁"
            title="Recursion"
            oneLine="Solving a big problem using smaller versions of itself."
            realLife="Opening a box that contains a smaller box."
            colorClass="from-[color-mix(in_oklab,var(--viz-pivot)_20%,transparent)] to-transparent"
          />
          <WorldCard
            to="/graph"
            emoji="🕸️"
            title="Graphs"
            oneLine="Understanding connections between things."
            realLife="Cities connected by roads."
            colorClass="from-[color-mix(in_oklab,var(--viz-done)_20%,transparent)] to-transparent"
          />
        </div>
      </section>

      {/* Learning philosophy */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="story-card p-8 md:p-12">
          <p className="font-display text-2xl font-bold md:text-3xl">
            First <em className="not-italic gradient-text">see it.</em> Then understand it. Then
            try it. Then code it.
          </p>
          <p className="mt-4 max-w-3xl text-muted-foreground">
            Every algorithm on this site follows the same journey: real-life story → visual idea →
            step-by-step explanation → pseudocode → Java → Python → complexity → real-world use →
            quick quiz.
          </p>
          <ol className="mt-6 grid gap-2 text-sm md:grid-cols-4">
            {["Real life", "Visual understanding", "Simple concept", "Step-by-step", "Pseudocode", "Java", "Python", "Where it's used"].map((s, i) => (
              <li key={s} className="flex items-center gap-2 rounded-lg bg-background/60 px-3 py-2">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {i + 1}
                </span>
                {s}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Quick access */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <h2 className="mb-6 font-display text-3xl font-black md:text-4xl">Jump into a visualizer</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["/sorting/bubble-sort", "Bubble Sort", "🫧"],
            ["/sorting/merge-sort", "Merge Sort", "🧩"],
            ["/sorting/quick-sort", "Quick Sort", "⚡"],
            ["/recursion/factorial", "Factorial", "🧮"],
            ["/recursion/fibonacci", "Fibonacci", "🐚"],
            ["/recursion/tower-of-hanoi", "Tower of Hanoi", "🗼"],
            ["/graph/bfs", "Breadth-First Search", "🌊"],
            ["/graph/dijkstra", "Dijkstra's Algorithm", "🗺️"],
          ].map(([to, name, emoji]) => (
            <Link
              key={to}
              to={to}
              className="group flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition hover:border-primary hover:shadow-soft"
            >
              <span className="text-2xl">{emoji}</span>
              <span className="flex-1 text-sm font-semibold">{name}</span>
              <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" />
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

function WorldCard({ to, emoji, title, oneLine, realLife, colorClass }: {
  to: string; emoji: string; title: string; oneLine: string; realLife: string; colorClass: string;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
      <Link
        to={to}
        className={`group block h-full rounded-3xl border border-border bg-gradient-to-b ${colorClass} p-6 transition hover:border-primary hover:shadow-lift`}
      >
        <div className="text-5xl">{emoji}</div>
        <h3 className="mt-4 font-display text-2xl font-bold">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{oneLine}</p>
        <div className="mt-4 rounded-xl bg-background/60 p-3 text-sm">
          <span className="font-semibold text-primary">Real life: </span>
          {realLife}
        </div>
        <span className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-primary">
          Explore
          <Zap className="h-3.5 w-3.5" />
          <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
        </span>
      </Link>
    </motion.div>
  );
}
