import { createFileRoute, Link } from "@tanstack/react-router";
import { GRAPH_LESSONS } from "@/lib/dsa/content/graph";

export const Route = createFileRoute("/graph/")({
  head: () => ({
    meta: [
      { title: "Graphs — TechKnots" },
      { name: "description", content: "Learn graphs through friendships, cities and maps — with live BFS, DFS and Dijkstra visualizations." },
      { property: "og:title", content: "Graphs — TechKnots" },
      { property: "og:description", content: "Vertices, edges, BFS, DFS, Dijkstra, Prim, Kruskal and more — all with animated stories." },
    ],
  }),
  component: Hub,
});

const GROUPS = [
  { title: "Graph basics", slugs: ["what-is-graph", "vertex", "edge", "directed", "undirected", "weighted", "unweighted", "connected", "disconnected", "cyclic", "acyclic"] },
  { title: "Representation", slugs: ["adjacency-matrix", "adjacency-list"] },
  { title: "Traversal", slugs: ["bfs", "dfs"] },
  { title: "Shortest path", slugs: ["dijkstra", "bellman-ford", "floyd-warshall"] },
  { title: "Minimum spanning tree", slugs: ["prim", "kruskal"] },
  { title: "Other important topics", slugs: ["topological-sort", "cycle-detection", "connected-components"] },
];

function Hub() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-8 md:py-20">
      <div className="text-xs text-muted-foreground">
        <Link to="/" className="hover:text-foreground">Home</Link> · <span className="text-foreground">Graphs</span>
      </div>
      <h1 className="mt-4 font-display text-5xl font-black">Graphs — understanding connections</h1>
      <p className="mt-3 max-w-3xl text-lg text-muted-foreground">
        Whenever things are connected — friends, cities, web pages, computers — you can draw them
        as dots joined by lines. Those dots are <b>nodes</b>. The lines are <b>edges</b>. That's a
        graph.
      </p>

      {GROUPS.map((g) => (
        <section key={g.title} className="mt-10">
          <h2 className="font-display text-2xl font-bold">{g.title}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {g.slugs.map((slug) => {
              const l = GRAPH_LESSONS[slug];
              return (
                <Link
                  key={slug}
                  to="/graph/$topic"
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
