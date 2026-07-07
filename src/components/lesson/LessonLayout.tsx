import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export interface QuizQ {
  q: string;
  options: string[];
  answer: number;
  why: string;
}

export interface LessonContent {
  slug: string;
  category: "sorting" | "recursion" | "graph";
  name: string;
  tagline: string;
  emoji: string;
  difficulty?: "Beginner" | "Intermediate" | "Advanced";

  imagine: ReactNode;      // "Imagine this" story
  whatIsHappening: ReactNode; // simple concept
  steps: string[];         // step-by-step in plain english
  howComputerDoesIt: string;
  pseudocode: string;
  java: string;
  python: string;
  timeComplexity: { case: string; value: string; explain: string }[];
  spaceComplexity: string;
  realWorld: { title: string; body: string }[];
  quiz: QuizQ[];

  visualizer: ReactNode;   // the interactive component
  prev?: { to: string; label: string };
  next?: { to: string; label: string };
}

export function LessonLayout({ content }: { content: LessonContent }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-8 md:py-16">
      <Breadcrumb category={content.category} name={content.name} />

      <header className="mt-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-4xl">{content.emoji}</span>
            <h1 className="font-display text-4xl font-black tracking-tight md:text-5xl">
              {content.name}
            </h1>
          </div>
          <p className="mt-2 max-w-2xl text-lg text-muted-foreground">{content.tagline}</p>
        </div>
        {content.difficulty && (
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">
            <Sparkles className="h-3.5 w-3.5" />
            {content.difficulty}
          </span>
        )}
      </header>

      <Section id="imagine" number="1" title="Imagine this">
        <div className="story-card p-6 text-lg leading-relaxed md:p-8">{content.imagine}</div>
      </Section>

      <Section id="what" number="2" title="What is happening?">
        <div className="panel-card p-6 text-base leading-relaxed md:p-8">{content.whatIsHappening}</div>
      </Section>

      <Section id="try" number="3" title="Try it yourself">
        {content.visualizer}
      </Section>

      <Section id="steps" number="4" title="Step-by-step, in plain words">
        <ol className="panel-card space-y-3 p-6 md:p-8">
          {content.steps.map((s, i) => (
            <li key={i} className="flex gap-3">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {i + 1}
              </span>
              <span className="pt-0.5 text-base leading-relaxed">{s}</span>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="computer" number="5" title="How does the computer do it?">
        <div className="panel-card p-6 md:p-8">
          <p className="text-base leading-relaxed">{content.howComputerDoesIt}</p>
        </div>
      </Section>

      <Section id="code" number="6" title="From idea to code">
        <CodeTabs pseudocode={content.pseudocode} java={content.java} python={content.python} />
      </Section>

      <Section id="complexity" number="7" title="Time & space — what does it cost?">
        <ComplexityBlock time={content.timeComplexity} space={content.spaceComplexity} />
      </Section>

      <Section id="uses" number="8" title="Where is it used in real life?">
        <div className="grid gap-4 md:grid-cols-2">
          {content.realWorld.map((r) => (
            <div key={r.title} className="panel-card p-5">
              <h3 className="mb-1.5 font-display text-lg font-bold">{r.title}</h3>
              <p className="text-sm text-muted-foreground">{r.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="quiz" number="9" title="Quick quiz">
        <Quiz questions={content.quiz} />
      </Section>

      <nav className="mt-16 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-8">
        {content.prev ? (
          <Link to={content.prev.to} className="group flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 transition hover:border-primary">
            <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-0.5" />
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Previous</p>
              <p className="text-sm font-semibold">{content.prev.label}</p>
            </div>
          </Link>
        ) : <span />}
        {content.next && (
          <Link to={content.next.to} className="group flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-primary-foreground transition hover:brightness-110">
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-widest opacity-80">Next</p>
              <p className="text-sm font-semibold">{content.next.label}</p>
            </div>
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </Link>
        )}
      </nav>
    </div>
  );
}

function Breadcrumb({ category, name }: { category: string; name: string }) {
  const catLabel = category === "sorting" ? "Sorting" : category === "recursion" ? "Recursion" : "Graphs";
  const catPath = category === "sorting" ? "/sorting" : category === "recursion" ? "/recursion" : "/graph";
  return (
    <div className="text-xs text-muted-foreground">
      <Link to="/" className="hover:text-foreground">Home</Link> ·{" "}
      <Link to={catPath} className="hover:text-foreground">{catLabel}</Link> ·{" "}
      <span className="text-foreground">{name}</span>
    </div>
  );
}

function Section({ id, number, title, children }: { id: string; number: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="mt-12 scroll-mt-24">
      <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.4 }}>
        <h2 className="mb-4 flex items-center gap-3 font-display text-2xl font-bold md:text-3xl">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-sm font-bold text-primary">{number}</span>
          {title}
        </h2>
        {children}
      </motion.div>
    </section>
  );
}

function CodeTabs({ pseudocode, java, python }: { pseudocode: string; java: string; python: string }) {
  const [tab, setTab] = useState<"plain" | "java" | "python">("plain");
  const code = tab === "plain" ? pseudocode : tab === "java" ? java : python;
  const tabs = [
    { id: "plain", label: "Pseudocode" },
    { id: "java", label: "Java" },
    { id: "python", label: "Python" },
  ] as const;

  return (
    <div className="panel-card overflow-hidden">
      <div className="flex border-b border-border bg-secondary/40">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "px-4 py-2.5 text-sm font-semibold transition",
              tab === t.id ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      <pre className="overflow-x-auto p-5 text-sm leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function ComplexityBlock({ time, space }: { time: { case: string; value: string; explain: string }[]; space: string }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {time.map((t) => (
        <div key={t.case} className="panel-card p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t.case}</p>
          <p className="mt-1 font-display text-3xl font-black gradient-text">{t.value}</p>
          <p className="mt-2 text-sm text-muted-foreground">{t.explain}</p>
        </div>
      ))}
      <div className="panel-card p-5 md:col-span-3">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Space</p>
        <p className="mt-1 text-sm">{space}</p>
      </div>
    </div>
  );
}

function Quiz({ questions }: { questions: QuizQ[] }) {
  const [picks, setPicks] = useState<Record<number, number>>({});
  return (
    <div className="space-y-4">
      {questions.map((q, qi) => {
        const picked = picks[qi];
        const answered = picked !== undefined;
        return (
          <div key={qi} className="panel-card p-5">
            <p className="font-semibold">{qi + 1}. {q.q}</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {q.options.map((opt, oi) => {
                const isCorrect = oi === q.answer;
                const isPicked = picked === oi;
                return (
                  <button
                    key={oi}
                    onClick={() => setPicks((p) => ({ ...p, [qi]: oi }))}
                    disabled={answered}
                    className={cn(
                      "rounded-lg border-2 px-3 py-2 text-left text-sm transition",
                      !answered && "border-border hover:border-primary hover:bg-secondary",
                      answered && isCorrect && "border-[var(--viz-done)] bg-[color-mix(in_oklab,var(--viz-done)_12%,var(--card))]",
                      answered && isPicked && !isCorrect && "border-[var(--viz-swap)] bg-[color-mix(in_oklab,var(--viz-swap)_10%,var(--card))]",
                      answered && !isPicked && !isCorrect && "opacity-60",
                    )}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
            {answered && (
              <p className="mt-3 rounded-lg bg-secondary/50 p-3 text-sm">
                <b className="text-primary">Why:</b> {q.why}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
