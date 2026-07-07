import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

const BASE_URL = "";

const paths = [
  "/", "/learn-dsa", "/sorting", "/recursion", "/graph", "/compare", "/practice",
  ...["bubble-sort", "selection-sort", "insertion-sort", "merge-sort", "quick-sort", "heap-sort", "counting-sort", "radix-sort", "bucket-sort"].map((s) => `/sorting/${s}`),
  ...["what-is-recursion", "base-case", "recursive-case", "call-stack", "direct-recursion", "indirect-recursion", "tail-recursion", "tree-recursion", "factorial", "fibonacci", "sum-natural", "reverse-string", "power", "recursive-binary-search", "tower-of-hanoi", "tree-traversal"].map((s) => `/recursion/${s}`),
  ...["what-is-graph", "vertex", "edge", "directed", "undirected", "weighted", "unweighted", "connected", "disconnected", "cyclic", "acyclic", "adjacency-matrix", "adjacency-list", "bfs", "dfs", "dijkstra", "bellman-ford", "floyd-warshall", "prim", "kruskal", "topological-sort", "cycle-detection", "connected-components"].map((s) => `/graph/${s}`),
];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const urls = paths.map((p) => `  <url><loc>${BASE_URL}${p}</loc><changefreq>weekly</changefreq></url>`).join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
        return new Response(xml, { headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" } });
      },
    },
  },
});
