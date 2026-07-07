import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Layers, Network, RefreshCw } from "lucide-react";

export const Route = createFileRoute("/learn-dsa")({
  head: () => ({
    meta: [
      { title: "What is DSA? — TechKnots Visualizer" },
      { name: "description", content: "A gentle, story-first introduction to Data Structures and Algorithms — no coding background required." },
      { property: "og:title", content: "What is DSA? — TechKnots Visualizer" },
      { property: "og:description", content: "Learn what an algorithm is through everyday stories: messy rooms, contact lists, ticket queues, and cafeteria plates." },
    ],
  }),
  component: LearnDSA,
});

function LearnDSA() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:px-8 md:py-20">
      <div className="text-xs text-muted-foreground">
        <Link to="/" className="hover:text-foreground">Home</Link> · <span className="text-foreground">Learn DSA</span>
      </div>

      <h1 className="mt-4 font-display text-4xl font-black md:text-6xl">What is DSA?</h1>
      <p className="mt-3 text-lg text-muted-foreground">
        Let's not start with a textbook definition. Let's start with a story.
      </p>

      {/* Messy room story */}
      <div className="story-card mt-8 p-8">
        <h2 className="font-display text-2xl font-bold">A messy room</h2>
        <p className="mt-3 text-base leading-relaxed">
          Imagine everything in your room is scattered everywhere — books on the floor, clothes on
          the bed, shoes on the desk, phone under the pillow.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            { icon: "📚", from: "Books", to: "Bookshelf" },
            { icon: "👕", from: "Clothes", to: "Wardrobe" },
            { icon: "👟", from: "Shoes", to: "Shoe rack" },
          ].map((item) => (
            <div key={item.from} className="rounded-xl bg-background/70 p-4">
              <div className="text-3xl">{item.icon}</div>
              <p className="mt-2 text-sm">
                <b>{item.from}</b> → <span className="text-muted-foreground">{item.to}</span>
              </p>
            </div>
          ))}
        </div>
        <p className="mt-5 rounded-xl bg-primary/10 p-4 text-base font-semibold">
          Organizing things so they are easy to find is called a <span className="gradient-text">Data Structure</span>.
        </p>

        <p className="mt-6 text-base leading-relaxed">
          Now imagine you want to find your blue shirt. You'd open the wardrobe, check the shelf,
          and pick it up.
        </p>
        <p className="mt-3 rounded-xl bg-primary/10 p-4 text-base font-semibold">
          The steps you followed to solve the problem are called an <span className="gradient-text">Algorithm</span>.
        </p>

        <div className="mt-6 rounded-2xl border border-primary/30 bg-background/70 p-5 text-center">
          <p className="font-display text-2xl">
            Data Structures <span className="text-primary">+</span> Algorithms{" "}
            <span className="text-primary">=</span> <b>DSA</b>
          </p>
        </div>
      </div>

      {/* Real-life examples */}
      <section className="mt-16">
        <h2 className="font-display text-3xl font-black">DSA is already all around you</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <ExampleCard
            emoji="📇"
            title="Contact list"
            people={["Calvin", "Arun", "Priya", "Rahul"]}
            body="Your phone stores names and numbers in an organized way — that's a Data Structure. Searching for 'Priya' is an Algorithm."
          />
          <ExampleCard
            emoji="🗺️"
            title="Google Maps"
            people={["City", "Road", "City"]}
            body="Cities are points, roads are connections — that's a Graph. Finding the shortest route is an Algorithm."
          />
          <ExampleCard
            emoji="🎫"
            title="Ticket queue"
            people={["1st", "2nd", "3rd"]}
            body="First person to arrive is the first person served — this is called a Queue."
          />
          <ExampleCard
            emoji="🍽️"
            title="Cafeteria plates"
            people={["Top", "Middle", "Bottom"]}
            body="The last plate placed is the first plate removed — this is called a Stack."
          />
        </div>
      </section>

      {/* Three worlds */}
      <section className="mt-16">
        <h2 className="font-display text-3xl font-black">Now pick a world to explore</h2>
        <p className="mt-2 text-muted-foreground">
          Every algorithm follows the same journey: story → visual → concept → code → real-world.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <WorldLink to="/sorting" emoji="📊" title="Sorting" line="Putting things in the correct order." icon={<Layers />} />
          <WorldLink to="/recursion" emoji="🎁" title="Recursion" line="Solving a big problem using smaller versions of itself." icon={<RefreshCw />} />
          <WorldLink to="/graph" emoji="🕸️" title="Graphs" line="Understanding connections between things." icon={<Network />} />
        </div>
      </section>

      {/* CTA */}
      <div className="panel-card mt-16 flex flex-col items-start gap-3 p-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <BookOpen className="h-6 w-6 text-primary" />
          <div>
            <p className="font-semibold">Ready for your first algorithm?</p>
            <p className="text-sm text-muted-foreground">Bubble Sort is a friendly place to start.</p>
          </div>
        </div>
        <Link to="/sorting/bubble-sort" className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground hover:brightness-110">
          Start with Bubble Sort
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

function ExampleCard({ emoji, title, body, people }: { emoji: string; title: string; body: string; people: string[] }) {
  return (
    <div className="panel-card p-5">
      <div className="flex items-center gap-3">
        <span className="text-3xl">{emoji}</span>
        <h3 className="font-display text-xl font-bold">{title}</h3>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {people.map((p, i) => (
          <span key={i} className="rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold">
            {p}
          </span>
        ))}
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}

function WorldLink({ to, emoji, title, line, icon }: { to: string; emoji: string; title: string; line: string; icon: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="group flex flex-col rounded-2xl border border-border bg-card p-5 transition hover:border-primary hover:shadow-lift"
    >
      <div className="flex items-center justify-between">
        <span className="text-4xl">{emoji}</span>
        <span className="text-muted-foreground group-hover:text-primary">{icon}</span>
      </div>
      <h3 className="mt-3 font-display text-xl font-bold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{line}</p>
    </Link>
  );
}
