// Graph engines: BFS, DFS, Dijkstra with step generation.

export interface GraphNode {
  id: string;
  x: number;
  y: number;
  label?: string;
}
export interface GraphEdge {
  from: string;
  to: string;
  weight?: number;
  directed?: boolean;
}

export interface Graph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface GraphStep {
  visited: string[];
  frontier: string[]; // queue or stack contents
  current: string | null;
  edgeHighlight?: [string, string];
  distances?: Record<string, number>;
  what: string;
  question: string;
  decision: string;
  next: string;
}

function neighbors(g: Graph, id: string): { id: string; w: number }[] {
  const out: { id: string; w: number }[] = [];
  for (const e of g.edges) {
    if (e.from === id) out.push({ id: e.to, w: e.weight ?? 1 });
    else if (!e.directed && e.to === id) out.push({ id: e.from, w: e.weight ?? 1 });
  }
  return out;
}

export function bfsSteps(g: Graph, start: string): GraphStep[] {
  const steps: GraphStep[] = [];
  const visited = new Set<string>();
  const queue: string[] = [start];
  visited.add(start);
  steps.push({
    visited: [...visited],
    frontier: [...queue],
    current: null,
    what: `Start at node ${start}. Add it to the queue.`,
    question: "Which node do we look at first?",
    decision: `${start} — it's the only one in the queue.`,
    next: "Take it out and visit its neighbours.",
  });
  while (queue.length) {
    const cur = queue.shift()!;
    steps.push({
      visited: [...visited],
      frontier: [...queue],
      current: cur,
      what: `Visit ${cur}.`,
      question: "Who are its neighbours?",
      decision: neighbors(g, cur).map((n) => n.id).join(", ") || "None.",
      next: "Add unvisited neighbours to the queue.",
    });
    for (const nb of neighbors(g, cur)) {
      if (!visited.has(nb.id)) {
        visited.add(nb.id);
        queue.push(nb.id);
        steps.push({
          visited: [...visited],
          frontier: [...queue],
          current: cur,
          edgeHighlight: [cur, nb.id],
          what: `Add ${nb.id} to the queue.`,
          question: "Have we seen it before?",
          decision: "No — mark it as visited.",
          next: "Continue with the next neighbour.",
        });
      }
    }
  }
  steps.push({
    visited: [...visited],
    frontier: [],
    current: null,
    what: "The queue is empty.",
    question: "Have we reached every reachable node?",
    decision: "Yes — traversal complete.",
    next: "Done.",
  });
  return steps;
}

export function dfsSteps(g: Graph, start: string): GraphStep[] {
  const steps: GraphStep[] = [];
  const visited = new Set<string>();
  const stack: string[] = [start];
  steps.push({
    visited: [],
    frontier: [...stack],
    current: null,
    what: `Push ${start} onto the stack.`,
    question: "Which node do we explore first?",
    decision: `${start}.`,
    next: "Pop it and visit.",
  });
  while (stack.length) {
    const cur = stack.pop()!;
    if (visited.has(cur)) continue;
    visited.add(cur);
    steps.push({
      visited: [...visited],
      frontier: [...stack],
      current: cur,
      what: `Visit ${cur}.`,
      question: "Any unvisited neighbours?",
      decision: "Push them onto the stack — we'll go as deep as possible.",
      next: "Explore the newest one first.",
    });
    for (const nb of neighbors(g, cur)) {
      if (!visited.has(nb.id)) {
        stack.push(nb.id);
        steps.push({
          visited: [...visited],
          frontier: [...stack],
          current: cur,
          edgeHighlight: [cur, nb.id],
          what: `Push ${nb.id}.`,
          question: "Should we go deeper?",
          decision: "Yes — that's what depth-first means.",
          next: "Continue.",
        });
      }
    }
  }
  steps.push({
    visited: [...visited],
    frontier: [],
    current: null,
    what: "Stack empty — nothing left to explore.",
    question: "Done?",
    decision: "Yes.",
    next: "Done.",
  });
  return steps;
}

export function dijkstraSteps(g: Graph, start: string): GraphStep[] {
  const steps: GraphStep[] = [];
  const dist: Record<string, number> = {};
  const visited = new Set<string>();
  g.nodes.forEach((n) => (dist[n.id] = Infinity));
  dist[start] = 0;
  steps.push({
    visited: [],
    frontier: [start],
    current: null,
    distances: { ...dist },
    what: `Start at ${start} with distance 0. Every other node is unknown (∞).`,
    question: "Which unvisited node has the smallest known distance?",
    decision: `${start}.`,
    next: "Visit it and update its neighbours.",
  });
  while (visited.size < g.nodes.length) {
    let cur: string | null = null;
    let best = Infinity;
    for (const n of g.nodes) {
      if (!visited.has(n.id) && dist[n.id] < best) {
        best = dist[n.id];
        cur = n.id;
      }
    }
    if (!cur) break;
    visited.add(cur);
    steps.push({
      visited: [...visited],
      frontier: g.nodes.filter((n) => !visited.has(n.id)).map((n) => n.id),
      current: cur,
      distances: { ...dist },
      what: `Visit ${cur} — the closest unvisited node (distance ${dist[cur]}).`,
      question: "Can we reach any neighbour more cheaply through here?",
      decision: "Check each neighbour.",
      next: "Update distances if a shorter path exists.",
    });
    for (const nb of neighbors(g, cur)) {
      const nd = dist[cur] + nb.w;
      const better = nd < dist[nb.id];
      steps.push({
        visited: [...visited],
        frontier: g.nodes.filter((n) => !visited.has(n.id)).map((n) => n.id),
        current: cur,
        edgeHighlight: [cur, nb.id],
        distances: { ...dist, [nb.id]: better ? nd : dist[nb.id] },
        what: `Look at edge ${cur} → ${nb.id} (weight ${nb.w}).`,
        question: `Is ${dist[cur]} + ${nb.w} = ${nd} better than the current best (${dist[nb.id] === Infinity ? "∞" : dist[nb.id]})?`,
        decision: better ? "Yes — update the best distance." : "No — keep the old distance.",
        next: "Check the next neighbour.",
      });
      if (better) dist[nb.id] = nd;
    }
  }
  steps.push({
    visited: [...visited],
    frontier: [],
    current: null,
    distances: { ...dist },
    what: "All reachable nodes visited.",
    question: "Do we know the shortest distance from the start to every node?",
    decision: "Yes.",
    next: "Done.",
  });
  return steps;
}

// Simple sample graphs
export const SAMPLE_GRAPH: Graph = {
  nodes: [
    { id: "A", x: 100, y: 80 },
    { id: "B", x: 260, y: 40 },
    { id: "C", x: 420, y: 100 },
    { id: "D", x: 160, y: 220 },
    { id: "E", x: 340, y: 240 },
    { id: "F", x: 500, y: 220 },
  ],
  edges: [
    { from: "A", to: "B", weight: 4 },
    { from: "A", to: "D", weight: 2 },
    { from: "B", to: "C", weight: 3 },
    { from: "B", to: "E", weight: 1 },
    { from: "D", to: "E", weight: 5 },
    { from: "C", to: "F", weight: 2 },
    { from: "E", to: "F", weight: 3 },
  ],
};
