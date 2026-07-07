import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-background/70">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-4 md:px-8">
        <div>
          <p className="font-display text-xl font-bold">TechKnots</p>
          <p className="mt-2 text-sm text-muted-foreground">
            See It. Understand It. Remember It.
          </p>
        </div>
        <FooterCol
          title="Learn"
          items={[
            { to: "/learn-dsa", label: "What is DSA?" },
            { to: "/sorting", label: "Sorting" },
            { to: "/recursion", label: "Recursion" },
            { to: "/graph", label: "Graphs" },
          ]}
        />
        <FooterCol
          title="Explore"
          items={[
            { to: "/compare", label: "Compare algorithms" },
            { to: "/practice", label: "Practice mode" },
            { to: "/sorting/bubble-sort", label: "Bubble Sort" },
            { to: "/graph/bfs", label: "Breadth-First Search" },
          ]}
        />
        <div>
          <p className="text-sm font-semibold">Every topic is unlocked</p>
          <p className="mt-2 text-sm text-muted-foreground">
            No sign up. No premium. Every visualizer, story and code sample is
            free to explore.
          </p>
        </div>
      </div>
      <div className="border-t border-border/60 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} TechKnots. Built for learners everywhere.
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  items,
}: {
  title: string;
  items: { to: string; label: string }[];
}) {
  return (
    <div>
      <p className="text-sm font-semibold">{title}</p>
      <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
        {items.map((i) => (
          <li key={i.to}>
            <Link to={i.to} className="hover:text-foreground">
              {i.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
