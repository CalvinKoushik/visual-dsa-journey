import type { LessonContent } from "@/components/lesson/LessonLayout";
import { GraphVisualizer } from "@/components/viz/GraphVisualizer";

const ORDER = [
  "what-is-graph", "vertex", "edge",
  "directed", "undirected", "weighted", "unweighted",
  "connected", "disconnected", "cyclic", "acyclic",
  "adjacency-matrix", "adjacency-list",
  "bfs", "dfs",
  "dijkstra", "bellman-ford", "floyd-warshall",
  "prim", "kruskal",
  "topological-sort", "cycle-detection", "connected-components",
];

const nav = (slug: string) => {
  const i = ORDER.indexOf(slug);
  return {
    prev: i > 0 ? { to: `/graph/${ORDER[i - 1]}`, label: title(ORDER[i - 1]) } : { to: "/graph", label: "All graph topics" },
    next: i < ORDER.length - 1 ? { to: `/graph/${ORDER[i + 1]}`, label: title(ORDER[i + 1]) } : { to: "/compare", label: "Compare algorithms →" },
  };
};

function title(slug: string) {
  return slug.split("-").map((s) => s[0].toUpperCase() + s.slice(1)).join(" ");
}

const StaticStory = ({ children }: { children: React.ReactNode }) => (
  <div className="story-card p-6 text-base leading-relaxed md:p-8">{children}</div>
);

// A helper for concept pages that don't need code
const concept = (base: Partial<LessonContent>): LessonContent =>
  ({
    pseudocode: "// This page is a concept explanation — no algorithm to run.",
    java: "// See BFS, DFS or Dijkstra for concrete code.",
    python: "# See BFS, DFS or Dijkstra for concrete code.",
    timeComplexity: [
      { case: "Concept", value: "n/a", explain: "This is a definition, not an algorithm." },
      { case: "Applies to", value: "any graph", explain: "Used with any graph algorithm." },
      { case: "See also", value: "BFS/DFS", explain: "The traversal pages show real complexities." },
    ],
    spaceComplexity: "n/a — this page defines a concept.",
    ...base,
  }) as LessonContent;

export const GRAPH_LESSONS: Record<string, LessonContent> = {
  "what-is-graph": concept({
    slug: "what-is-graph",
    category: "graph",
    name: "What is a Graph?",
    tagline: "A picture of things and how they're connected.",
    emoji: "🕸️",
    difficulty: "Beginner",
    imagine: (<><p>People connected by friendships. Cities connected by roads. Web pages connected by hyperlinks. Whenever things are connected, we can draw them as dots joined by lines.</p><p className="mt-3">The dots are called <b>nodes</b> (or vertices). The lines are called <b>edges</b>.</p></>),
    whatIsHappening: (<p>A graph is a mathematical object <code>G = (V, E)</code> where V is the set of nodes and E is the set of edges. Graphs are how computers model networks, maps, social connections, and dependencies.</p>),
    steps: ["Identify what the 'things' are — those become nodes.", "Identify what 'connection' means — those become edges.", "Decide whether the connection has direction (arrow) or weight (number)."],
    howComputerDoesIt: "Computers store graphs as either an adjacency matrix (a table of yes/no) or an adjacency list (each node keeps a list of its neighbours).",
    realWorld: [
      { title: "Social networks", body: "Friends and followers form a graph." },
      { title: "Maps", body: "Cities and roads form a weighted graph." },
      { title: "The internet", body: "Every web page linking to another is an edge." },
      { title: "Software dependencies", body: "Packages depending on other packages." },
    ],
    quiz: [{ q: "In graph terminology, the connections between things are called…", options: ["Nodes", "Edges", "Weights", "Paths"], answer: 1, why: "Nodes/vertices are the things; edges are the connections." }],
    visualizer: <StaticStory>The visualizers on BFS, DFS and Dijkstra all use the same sample graph — take a peek there to see a graph in action.</StaticStory>,
    ...nav("what-is-graph"),
  }),

  "vertex": concept({
    slug: "vertex", category: "graph", name: "Vertex (Node)",
    tagline: "A 'thing' in the graph.", emoji: "🔵", difficulty: "Beginner",
    imagine: (<p>Each person in a friend group is a vertex.</p>),
    whatIsHappening: (<p>A vertex represents one entity — a person, a city, a web page, a task. Vertices carry an identifier and can hold extra data.</p>),
    steps: ["Choose what a vertex means for your problem.", "Give it a unique ID.", "Optionally attach data (name, coordinates, etc.)."],
    howComputerDoesIt: "Usually a simple object with an id and metadata, stored in a list or dictionary.",
    realWorld: [{ title: "User accounts", body: "Each user in a social network is one vertex." }, { title: "Airports", body: "Each airport is a vertex in a flight-route graph." }],
    quiz: [{ q: "'Vertex' and 'node' mean…", options: ["Different things", "The same thing", "Only in trees", "Only in graphs"], answer: 1, why: "The two words are interchangeable." }],
    visualizer: <StaticStory>See the circles in the BFS visualizer — each one is a vertex.</StaticStory>,
    ...nav("vertex"),
  }),

  "edge": concept({
    slug: "edge", category: "graph", name: "Edge",
    tagline: "A connection between two vertices.", emoji: "↔️", difficulty: "Beginner",
    imagine: (<p>A friendship between two people. A road between two cities.</p>),
    whatIsHappening: (<p>An edge joins two vertices. It may have a direction (arrow) and a weight (cost, distance, capacity).</p>),
    steps: ["Decide what a connection means.", "Decide if it goes one way (directed) or both ways (undirected).", "Optionally attach a weight."],
    howComputerDoesIt: "Stored as pairs (u, v) with optional weight and direction.",
    realWorld: [{ title: "Roads", body: "Weighted (distance) and often undirected." }, { title: "Twitter follows", body: "Directed — following isn't always mutual." }],
    quiz: [{ q: "A directed edge from A to B means…", options: ["Both A→B and B→A", "Only A→B", "Only B→A", "No connection"], answer: 1, why: "Arrows indicate one-way." }],
    visualizer: <StaticStory>The lines between circles in the BFS visualizer are edges. Weights (numbers) appear in the Dijkstra visualizer.</StaticStory>,
    ...nav("edge"),
  }),

  "directed": concept({
    slug: "directed", category: "graph", name: "Directed Graph",
    tagline: "Edges have arrows: A → B doesn't mean B → A.", emoji: "➡️", difficulty: "Beginner",
    imagine: (<p>Instagram follows — you can follow someone without them following back.</p>),
    whatIsHappening: (<p>A directed graph's edges are ordered pairs. Traversal must respect direction.</p>),
    steps: ["Draw edges as arrows.", "In algorithms, only follow arrows out of the current node."],
    howComputerDoesIt: "Adjacency list stores only (u, v) — not (v, u).",
    realWorld: [{ title: "Web links", body: "Page A can link to B without B linking back." }, { title: "Dependencies", body: "A → B means 'A depends on B'." }],
    quiz: [{ q: "In a directed graph, edge A → B guarantees…", options: ["B → A", "No path A → B", "You can go A → B, not B → A", "The graph is a tree"], answer: 2, why: "Direction is one-way unless a reverse edge is also present." }],
    visualizer: <StaticStory>Try drawing a directed graph of your app's page routes.</StaticStory>,
    ...nav("directed"),
  }),

  "undirected": concept({
    slug: "undirected", category: "graph", name: "Undirected Graph",
    tagline: "Edges are symmetric: A — B means both A → B and B → A.", emoji: "🤝", difficulty: "Beginner",
    imagine: (<p>Facebook friendship — always mutual.</p>),
    whatIsHappening: (<p>An undirected graph treats each edge as a two-way street.</p>),
    steps: ["Draw edges as plain lines (no arrow).", "In algorithms, follow the edge from either end."],
    howComputerDoesIt: "Adjacency list adds both (u, v) and (v, u).",
    realWorld: [{ title: "Roads", body: "Most streets are two-way." }, { title: "Chat friendships", body: "Symmetric by design." }],
    quiz: [{ q: "In an undirected graph, edge A — B implies…", options: ["Only A → B", "Both directions", "A must equal B", "A cycle"], answer: 1, why: "Undirected edges are symmetric." }],
    visualizer: <StaticStory>The sample graph in BFS/DFS is undirected.</StaticStory>,
    ...nav("undirected"),
  }),

  "weighted": concept({
    slug: "weighted", category: "graph", name: "Weighted Graph",
    tagline: "Each edge carries a number (distance, cost, capacity…).", emoji: "⚖️", difficulty: "Beginner",
    imagine: (<p>A map where each road has a distance in kilometres.</p>),
    whatIsHappening: (<p>Weights let us ask "what is the cheapest path?" or "shortest distance?" — that's what Dijkstra, Bellman-Ford and MST algorithms solve.</p>),
    steps: ["Attach a number to each edge.", "Sum weights along a path to get total cost.", "Choose the path with the minimum sum."],
    howComputerDoesIt: "Store weight alongside each edge in the adjacency list.",
    realWorld: [{ title: "Google Maps", body: "Distance or travel time as edge weights." }, { title: "Airfares", body: "Weights become ticket prices." }],
    quiz: [{ q: "Which algorithm handles weighted shortest paths with non-negative weights?", options: ["BFS", "DFS", "Dijkstra", "Kruskal"], answer: 2, why: "Dijkstra picks the cheapest unvisited node at each step." }],
    visualizer: <StaticStory>Open the Dijkstra page to see a weighted graph in action.</StaticStory>,
    ...nav("weighted"),
  }),

  "unweighted": concept({
    slug: "unweighted", category: "graph", name: "Unweighted Graph",
    tagline: "Every edge counts the same — usually as 1.", emoji: "1️⃣", difficulty: "Beginner",
    imagine: (<p>A social network where friendship strength doesn't matter — you're either friends or you're not.</p>),
    whatIsHappening: (<p>Without weights, "shortest path" simply means fewest edges — perfect for BFS.</p>),
    steps: ["Treat each edge as cost 1.", "Use BFS to compute shortest paths in edges."],
    howComputerDoesIt: "No weight field needed on edges.",
    realWorld: [{ title: "Degrees of separation", body: "Six degrees of Kevin Bacon uses unweighted BFS." }],
    quiz: [{ q: "Shortest path in an unweighted graph is best found with…", options: ["Dijkstra", "BFS", "DFS", "Prim"], answer: 1, why: "BFS explores layer by layer — fewest-edges = fewest layers." }],
    visualizer: <StaticStory>The BFS page uses the sample graph as if it were unweighted.</StaticStory>,
    ...nav("unweighted"),
  }),

  "connected": concept({
    slug: "connected", category: "graph", name: "Connected Graph",
    tagline: "You can reach any node from any other.", emoji: "🔗", difficulty: "Beginner",
    imagine: (<p>Every city on the map has some road path to every other city.</p>),
    whatIsHappening: (<p>An undirected graph is connected if there's a path between every pair of vertices. In directed graphs the equivalent is 'strongly connected'.</p>),
    steps: ["Pick any node.", "Run BFS or DFS.", "If every node was visited, the graph is connected."],
    howComputerDoesIt: "A single BFS/DFS from any start node reveals connectivity in O(V + E).",
    realWorld: [{ title: "Networking", body: "A LAN must be connected for every machine to reach every other." }],
    quiz: [{ q: "How can you check if an undirected graph is connected?", options: ["Count edges", "Run BFS from any node", "Sort vertices", "Colour it"], answer: 1, why: "If BFS visits every vertex, the graph is connected." }],
    visualizer: <StaticStory>Run BFS on the sample graph — every vertex gets visited, so it's connected.</StaticStory>,
    ...nav("connected"),
  }),

  "disconnected": concept({
    slug: "disconnected", category: "graph", name: "Disconnected Graph",
    tagline: "Some nodes can't reach others — the graph is in pieces.", emoji: "🧩", difficulty: "Beginner",
    imagine: (<p>Two separate friend groups with no shared friends.</p>),
    whatIsHappening: (<p>The graph splits into two or more connected components — each is an island of reachability.</p>),
    steps: ["Run BFS/DFS from each unvisited node.", "Each run discovers one component."],
    howComputerDoesIt: "Iterate over all nodes; for any node not yet visited, start a new BFS/DFS.",
    realWorld: [{ title: "Isolated systems", body: "Two office LANs with no bridge between them." }],
    quiz: [{ q: "How many BFS runs do you need to explore a disconnected graph?", options: ["Always 1", "One per component", "One per edge", "One per vertex"], answer: 1, why: "Each disconnected piece needs its own start." }],
    visualizer: <StaticStory>Imagine deleting the edge between C and F in the sample graph — F would become its own component.</StaticStory>,
    ...nav("disconnected"),
  }),

  "cyclic": concept({
    slug: "cyclic", category: "graph", name: "Cyclic Graph",
    tagline: "Contains at least one cycle — a path that returns to itself.", emoji: "🔄", difficulty: "Intermediate",
    imagine: (<p>A round-trip through three cities that returns to the start.</p>),
    whatIsHappening: (<p>A cycle is a path A → B → C → … → A that visits at least one intermediate node without repeating edges. Detecting cycles is important in dependency analysis and deadlock detection.</p>),
    steps: ["Run DFS.", "If you encounter a visited node that's on the current path, a cycle exists."],
    howComputerDoesIt: "DFS with a 'currently-in-stack' set. See the Cycle Detection page.",
    realWorld: [{ title: "Deadlocks", body: "A cycle in a resource-wait graph = a deadlock." }, { title: "Circular imports", body: "Package A imports B, B imports A." }],
    quiz: [{ q: "A cycle needs at least how many distinct nodes (in a simple graph)?", options: ["1", "2", "3", "0"], answer: 2, why: "You need at least three distinct nodes to form a non-trivial cycle." }],
    visualizer: <StaticStory>Try adding an edge from F back to A in the sample graph — you've created a cycle.</StaticStory>,
    ...nav("cyclic"),
  }),

  "acyclic": concept({
    slug: "acyclic", category: "graph", name: "Acyclic Graph",
    tagline: "No cycles — never returns to a node it already visited.", emoji: "🌱", difficulty: "Intermediate",
    imagine: (<p>A tree — you never loop back on yourself.</p>),
    whatIsHappening: (<p>A Directed Acyclic Graph (DAG) is central to build systems, task scheduling and topological sorting.</p>),
    steps: ["Verify no cycles via DFS.", "Use topological sort to produce a linear order that respects dependencies."],
    howComputerDoesIt: "DFS + colour marking (white/grey/black) detects any back edges.",
    realWorld: [{ title: "Build systems", body: "Make, Bazel and CI pipelines schedule DAGs of tasks." }, { title: "Course prerequisites", body: "A DAG of subjects." }],
    quiz: [{ q: "'DAG' stands for…", options: ["Data Access Graph", "Directed Acyclic Graph", "Dynamic Array Group", "Distributed Adjacency Graph"], answer: 1, why: "It's the standard abbreviation used in scheduling and compilers." }],
    visualizer: <StaticStory>Draw your app's build steps as a DAG — you can topologically sort them.</StaticStory>,
    ...nav("acyclic"),
  }),

  "adjacency-matrix": concept({
    slug: "adjacency-matrix", category: "graph", name: "Adjacency Matrix",
    tagline: "A V×V table where cell [u][v] = 1 if edge u→v exists.", emoji: "🔳", difficulty: "Beginner",
    imagine: (<p>A yes/no table with rows and columns labelled by node.</p>),
    whatIsHappening: (<p>Adjacency matrices give instant edge lookup but use O(V²) memory — wasteful for sparse graphs.</p>),
    steps: ["Create a V×V matrix.", "Set matrix[u][v] = weight (or 1) for each edge.", "For undirected graphs, also set matrix[v][u]."],
    howComputerDoesIt: "A 2D array. Great for dense graphs and algorithms like Floyd-Warshall.",
    pseudocode: `matrix = [[0] * V for _ in range(V)]\nfor (u, v, w) in edges: matrix[u][v] = w`,
    java: `int[][] m = new int[V][V];\nfor (Edge e : edges) m[e.u][e.v] = e.w;`,
    python: `m = [[0]*V for _ in range(V)]\nfor u,v,w in edges: m[u][v] = w`,
    timeComplexity: [
      { case: "Add edge", value: "O(1)", explain: "Direct index." },
      { case: "Check edge", value: "O(1)", explain: "Look up a single cell." },
      { case: "Iterate neighbours", value: "O(V)", explain: "Scan a whole row." },
    ],
    spaceComplexity: "O(V²) — even for sparse graphs.",
    realWorld: [{ title: "Small dense graphs", body: "Great when almost every pair is connected." }],
    quiz: [{ q: "Adjacency matrix uses…", options: ["O(V) memory", "O(V²) memory", "O(E) memory", "O(1) memory"], answer: 1, why: "One cell per pair of vertices." }],
    visualizer: <StaticStory>Sketch a 4×4 matrix for a graph of 4 nodes and 3 edges — you'll see most cells are 0.</StaticStory>,
    ...nav("adjacency-matrix"),
  }),

  "adjacency-list": concept({
    slug: "adjacency-list", category: "graph", name: "Adjacency List",
    tagline: "Each node stores a list of its neighbours.", emoji: "📇", difficulty: "Beginner",
    imagine: (<p>Each person keeps a small notebook of their friends' names.</p>),
    whatIsHappening: (<p>Adjacency lists use O(V + E) memory and are the go-to representation for real-world sparse graphs.</p>),
    steps: ["For each vertex, create an empty list.", "For each edge (u, v, w), append v (and optionally w) to u's list."],
    howComputerDoesIt: "A dictionary or array of lists. Neighbour iteration is proportional to the vertex's degree.",
    pseudocode: `adj = { v: [] for v in vertices }\nfor (u, v, w) in edges: adj[u].append((v, w))`,
    java: `Map<Integer, List<int[]>> adj = new HashMap<>();\nfor (Edge e : edges) adj.computeIfAbsent(e.u, k -> new ArrayList<>()).add(new int[]{e.v, e.w});`,
    python: `from collections import defaultdict\nadj = defaultdict(list)\nfor u,v,w in edges: adj[u].append((v, w))`,
    timeComplexity: [
      { case: "Add edge", value: "O(1)", explain: "Append to a list." },
      { case: "Check edge", value: "O(deg)", explain: "Scan the neighbour list." },
      { case: "Iterate neighbours", value: "O(deg)", explain: "Just the ones that exist." },
    ],
    spaceComplexity: "O(V + E) — memory grows only with actual edges.",
    realWorld: [{ title: "Social networks", body: "Most users have hundreds of friends, not millions." }],
    quiz: [{ q: "Adjacency list memory grows with…", options: ["V² always", "V + E", "V only", "E²"], answer: 1, why: "Each vertex plus each edge takes constant space." }],
    visualizer: <StaticStory>Write out the adjacency list for the sample graph in the BFS visualizer.</StaticStory>,
    ...nav("adjacency-list"),
  }),

  "bfs": {
    slug: "bfs", category: "graph", name: "Breadth-First Search",
    tagline: "Explore level by level — like ripples spreading out.", emoji: "🌊", difficulty: "Intermediate",
    imagine: (<><p>Imagine you tell a rumour to your two best friends. They tell their two best friends. Their friends tell theirs.</p><p className="mt-3">The rumour spreads in <b>waves</b> — one layer at a time. That's BFS.</p></>),
    whatIsHappening: (<p>BFS visits all direct neighbours first, then all neighbours of those, and so on. It's driven by a queue and guarantees the shortest number of edges from the start to any other node.</p>),
    steps: ["Put the start node in a queue and mark it visited.", "Dequeue a node. Look at each neighbour.", "If a neighbour is not visited, mark and enqueue it.", "Repeat until the queue is empty."],
    howComputerDoesIt: "Uses a FIFO queue and a 'visited' set. Every node is enqueued once and dequeued once, giving O(V + E) time.",
    pseudocode: `procedure bfs(G, start):
  queue = [start]
  mark start visited
  while queue not empty:
    u = queue.dequeue()
    for each neighbour v of u:
      if v not visited:
        mark v visited
        queue.enqueue(v)`,
    java: `void bfs(Map<Integer, List<Integer>> g, int start){
    Queue<Integer> q = new ArrayDeque<>();
    Set<Integer> seen = new HashSet<>();
    q.add(start); seen.add(start);
    while (!q.isEmpty()){
        int u = q.poll();
        for (int v : g.getOrDefault(u, List.of()))
            if (seen.add(v)) q.add(v);
    }
}`,
    python: `from collections import deque
def bfs(g, start):
    q = deque([start]); seen = {start}
    while q:
        u = q.popleft()
        for v in g.get(u, []):
            if v not in seen:
                seen.add(v); q.append(v)`,
    timeComplexity: [
      { case: "Best/Avg/Worst", value: "O(V + E)", explain: "Every vertex and edge is looked at once." },
      { case: "Space", value: "O(V)", explain: "The queue and visited set." },
      { case: "Shortest path", value: "yes (edges)", explain: "For unweighted graphs, BFS gives the shortest path in edges." },
    ],
    spaceComplexity: "O(V) for the queue and visited marker.",
    realWorld: [
      { title: "Shortest hops", body: "'6 degrees of separation' problems." },
      { title: "Web crawlers", body: "Crawl outward from a seed URL layer by layer." },
      { title: "Broadcast networks", body: "Propagate messages level by level." },
    ],
    quiz: [{ q: "BFS uses which data structure?", options: ["Stack", "Queue", "Heap", "Tree"], answer: 1, why: "FIFO queues ensure nodes are processed in the order they were discovered." }],
    visualizer: <GraphVisualizer algorithm="bfs" start="A" />,
    ...nav("bfs"),
  },

  "dfs": {
    slug: "dfs", category: "graph", name: "Depth-First Search",
    tagline: "Go as deep as possible, then backtrack.", emoji: "🧭", difficulty: "Intermediate",
    imagine: (<><p>You enter a maze. At every fork you pick a path and keep going. When you hit a dead end, you backtrack to the last fork and try another path.</p></>),
    whatIsHappening: (<p>DFS explores one branch fully before trying the next. It uses a stack (or recursion). Great for cycle detection, topological sort and finding connected components.</p>),
    steps: ["Push start onto a stack (or recurse).", "Pop the top. If unvisited, mark visited and push its neighbours.", "Repeat until the stack is empty."],
    howComputerDoesIt: "Either a manual stack or the call stack (recursion). Time O(V + E).",
    pseudocode: `procedure dfs(G, u, visited):
  mark u visited
  for each neighbour v of u:
    if v not in visited:
      dfs(G, v, visited)`,
    java: `void dfs(Map<Integer, List<Integer>> g, int u, Set<Integer> seen){
    if (!seen.add(u)) return;
    for (int v : g.getOrDefault(u, List.of())) dfs(g, v, seen);
}`,
    python: `def dfs(g, u, seen=None):
    if seen is None: seen = set()
    if u in seen: return
    seen.add(u)
    for v in g.get(u, []):
        dfs(g, v, seen)`,
    timeComplexity: [
      { case: "Best/Avg/Worst", value: "O(V + E)", explain: "Same as BFS." },
      { case: "Space (recursion)", value: "O(V)", explain: "Deepest possible call stack." },
      { case: "Cycle detection", value: "yes", explain: "Track 'in-stack' nodes to spot back-edges." },
    ],
    spaceComplexity: "O(V) for the stack / recursion depth.",
    realWorld: [
      { title: "Maze solving", body: "Explore paths deeply, backtrack on dead ends." },
      { title: "Topological sort", body: "DAG scheduling relies on post-order DFS." },
      { title: "Connected components", body: "Repeated DFS from unvisited nodes." },
    ],
    quiz: [{ q: "DFS uses which data structure?", options: ["Queue", "Stack (or recursion)", "Heap", "Hash table"], answer: 1, why: "LIFO order takes you deeper before wider." }],
    visualizer: <GraphVisualizer algorithm="dfs" start="A" />,
    ...nav("dfs"),
  },

  "dijkstra": {
    slug: "dijkstra", category: "graph", name: "Dijkstra's Algorithm",
    tagline: "Shortest paths in a weighted graph — no negative edges allowed.", emoji: "🗺️", difficulty: "Advanced",
    imagine: (<><p>You're at home and want to know the shortest driving distance to every other place on the map.</p><p className="mt-3">Start with 'distance to home = 0' and 'distance to everywhere else = unknown'. Repeatedly pick the nearest unvisited place, then see if going through it makes any of its neighbours closer than what you knew before.</p></>),
    whatIsHappening: (<p>Dijkstra maintains a best-known distance from the start to every node. At each step it picks the smallest unvisited distance, marks it done, and relaxes its outgoing edges. Works only with non-negative weights.</p>),
    steps: ["Set dist[start] = 0 and dist[everything else] = ∞.", "Pick the unvisited node with the smallest dist.", "For each neighbour, check if dist[u] + weight < dist[v]. Update if so.", "Mark u as visited.", "Repeat until every node is visited."],
    howComputerDoesIt: "Uses a min-heap (priority queue) to pick the closest unvisited node in O(log V). Total time is O((V + E) log V).",
    pseudocode: `procedure dijkstra(G, start):
  dist[v] = infinity for all v
  dist[start] = 0
  PQ = min-heap of (0, start)
  while PQ not empty:
    (d, u) = PQ.pop()
    if u already finalized: continue
    finalize u
    for each (v, w) in neighbours(u):
      if d + w < dist[v]:
        dist[v] = d + w
        PQ.push((dist[v], v))`,
    java: `void dijkstra(Map<Integer, List<int[]>> g, int start, int V){
    int[] dist = new int[V]; Arrays.fill(dist, Integer.MAX_VALUE);
    dist[start] = 0;
    PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[0]));
    pq.add(new int[]{0, start});
    while (!pq.isEmpty()){
        int[] top = pq.poll();
        int d = top[0], u = top[1];
        if (d > dist[u]) continue;
        for (int[] nb : g.getOrDefault(u, List.of())){
            int v = nb[0], w = nb[1];
            if (dist[u] + w < dist[v]){
                dist[v] = dist[u] + w;
                pq.add(new int[]{dist[v], v});
            }
        }
    }
}`,
    python: `import heapq
def dijkstra(g, start):
    dist = {v: float('inf') for v in g}
    dist[start] = 0
    pq = [(0, start)]
    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]: continue
        for v, w in g[u]:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                heapq.heappush(pq, (dist[v], v))
    return dist`,
    timeComplexity: [
      { case: "With min-heap", value: "O((V+E) log V)", explain: "Standard priority-queue implementation." },
      { case: "With array", value: "O(V²)", explain: "Naive scan for min." },
      { case: "Space", value: "O(V)", explain: "Distances plus heap." },
    ],
    spaceComplexity: "O(V) for the distance array and heap.",
    realWorld: [
      { title: "GPS navigation", body: "Turn-by-turn directions." },
      { title: "Network routing", body: "OSPF and IS-IS use Dijkstra internally." },
      { title: "Game AI pathfinding", body: "A* is Dijkstra with a heuristic." },
    ],
    quiz: [{ q: "Dijkstra requires…", options: ["Negative weights", "Non-negative weights", "A DAG", "Directed edges only"], answer: 1, why: "Negative edges break the 'closest so far is final' invariant." }],
    visualizer: <GraphVisualizer algorithm="dijkstra" start="A" />,
    ...nav("dijkstra"),
  },

  "bellman-ford": concept({
    slug: "bellman-ford", category: "graph", name: "Bellman-Ford Algorithm",
    tagline: "Shortest paths that also tolerate negative weights.", emoji: "🧮", difficulty: "Advanced",
    imagine: (<p>Currency exchange: some 'edges' can effectively be negative. Dijkstra can't handle that — Bellman-Ford can.</p>),
    whatIsHappening: (<p>Bellman-Ford relaxes every edge V − 1 times. If any edge can still be relaxed, a negative cycle exists.</p>),
    steps: ["Set dist[start] = 0, others = ∞.", "Repeat V − 1 times: for each edge (u, v, w), if dist[u] + w < dist[v], update dist[v].", "Do one more pass — any further update means a negative cycle."],
    howComputerDoesIt: "Simple triple-loop; no priority queue needed. Time O(V·E).",
    pseudocode: `for i from 1 to V - 1:
  for each edge (u, v, w):
    if dist[u] + w < dist[v]:
      dist[v] = dist[u] + w`,
    java: `for (int i = 1; i < V; i++)
    for (int[] e : edges)
        if (dist[e[0]] + e[2] < dist[e[1]])
            dist[e[1]] = dist[e[0]] + e[2];`,
    python: `for _ in range(V - 1):
    for u, v, w in edges:
        if dist[u] + w < dist[v]:
            dist[v] = dist[u] + w`,
    timeComplexity: [
      { case: "Time", value: "O(V·E)", explain: "V − 1 passes over every edge." },
      { case: "Space", value: "O(V)", explain: "Distance array." },
      { case: "Negative cycles", value: "detected", explain: "An extra relaxation pass exposes them." },
    ],
    spaceComplexity: "O(V).",
    realWorld: [{ title: "Currency arbitrage", body: "Detect profitable exchange cycles." }, { title: "Routing protocols", body: "RIP uses Bellman-Ford." }],
    quiz: [{ q: "Bellman-Ford's advantage over Dijkstra is…", options: ["Faster", "Handles negative weights", "Uses less memory", "Works only on trees"], answer: 1, why: "Its exhaustive relaxation copes with edges that reduce distance." }],
    visualizer: <StaticStory>Try Bellman-Ford on paper with a small graph containing one negative edge — notice the distance can shrink after a later pass.</StaticStory>,
    ...nav("bellman-ford"),
  }),

  "floyd-warshall": concept({
    slug: "floyd-warshall", category: "graph", name: "Floyd-Warshall Algorithm",
    tagline: "Shortest paths between every pair of nodes.", emoji: "🔁", difficulty: "Advanced",
    imagine: (<p>Not just "how do I get from A to B?" — but "what's the shortest distance between every pair of cities?".</p>),
    whatIsHappening: (<p>Dynamic programming that considers every possible intermediate node k for improving dist[i][j].</p>),
    steps: ["Initialise dist[i][j] with edge weights (∞ if no edge).", "For each k, i, j: dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])."],
    howComputerDoesIt: "Three nested loops on the adjacency matrix. Time O(V³) — best for small dense graphs.",
    pseudocode: `for k in V:
  for i in V:
    for j in V:
      dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])`,
    java: `for (int k = 0; k < V; k++)
  for (int i = 0; i < V; i++)
    for (int j = 0; j < V; j++)
      if (dist[i][k] + dist[k][j] < dist[i][j])
        dist[i][j] = dist[i][k] + dist[k][j];`,
    python: `for k in range(V):
    for i in range(V):
        for j in range(V):
            if dist[i][k] + dist[k][j] < dist[i][j]:
                dist[i][j] = dist[i][k] + dist[k][j]`,
    timeComplexity: [
      { case: "Time", value: "O(V³)", explain: "Triple loop." },
      { case: "Space", value: "O(V²)", explain: "The full distance matrix." },
      { case: "Best for", value: "small V", explain: "Impractical past a few hundred nodes." },
    ],
    spaceComplexity: "O(V²).",
    realWorld: [{ title: "Transitive closure", body: "Determine which nodes can reach which." }, { title: "Routing tables", body: "Full mesh distances between routers." }],
    quiz: [{ q: "Floyd-Warshall computes…", options: ["Single-source paths", "Paths between all pairs", "Minimum spanning tree", "Cycles"], answer: 1, why: "It answers dist(u, v) for every pair (u, v)." }],
    visualizer: <StaticStory>Trace the algorithm on a 3-node graph — you'll see the matrix improve after each k.</StaticStory>,
    ...nav("floyd-warshall"),
  }),

  "prim": concept({
    slug: "prim", category: "graph", name: "Prim's Algorithm",
    tagline: "Grow a minimum spanning tree from a starting node.", emoji: "🌿", difficulty: "Advanced",
    imagine: (<p>A company wants to connect five offices with fibre. It should connect all offices using the least total cable.</p>),
    whatIsHappening: (<p>Start from any node. Repeatedly add the cheapest edge that connects the tree to an unvisited node. Stops when every node is included.</p>),
    steps: ["Pick a start node; add it to the tree.", "Find the cheapest edge from the tree to an outside node.", "Add that edge and node to the tree.", "Repeat until all nodes are in the tree."],
    howComputerDoesIt: "A min-heap of candidate edges gives O(E log V).",
    pseudocode: `mark start as in-tree
add start's edges to PQ
while PQ not empty:
  (w, u, v) = PQ.pop()
  if v in tree: continue
  add v to tree; add edge (u,v)
  for each edge (v, x, w): PQ.push((w, v, x))`,
    java: `// See tanstack docs — Prim implementation with PriorityQueue`,
    python: `import heapq
def prim(g, start):
    in_tree = {start}; pq = [(w, start, v) for v, w in g[start]]
    heapq.heapify(pq); mst = []
    while pq and len(in_tree) < len(g):
        w, u, v = heapq.heappop(pq)
        if v in in_tree: continue
        in_tree.add(v); mst.append((u, v, w))
        for x, wx in g[v]:
            if x not in in_tree: heapq.heappush(pq, (wx, v, x))
    return mst`,
    timeComplexity: [
      { case: "With heap", value: "O(E log V)", explain: "Each edge pushed at most once." },
      { case: "Dense graphs", value: "O(V²)", explain: "Array-based Prim." },
      { case: "Space", value: "O(V + E)", explain: "Heap and tree." },
    ],
    spaceComplexity: "O(V + E).",
    realWorld: [{ title: "Network cabling", body: "Connect offices with the least fibre." }, { title: "Utility grids", body: "Water, gas or electrical distribution." }],
    quiz: [{ q: "Prim's builds a…", options: ["Shortest path tree", "Minimum spanning tree", "Cycle", "Sorted list"], answer: 1, why: "It grows a tree that spans all nodes with minimum total edge weight." }],
    visualizer: <StaticStory>Trace Prim on the sample graph starting from A — pick the smallest edge out of the tree at each step.</StaticStory>,
    ...nav("prim"),
  }),

  "kruskal": concept({
    slug: "kruskal", category: "graph", name: "Kruskal's Algorithm",
    tagline: "Sort all edges cheapest first, add them if they don't form a cycle.", emoji: "🪜", difficulty: "Advanced",
    imagine: (<p>Same office-cabling problem — but instead of growing from one office, you look at the whole list of possible cables and greedily pick the cheapest ones.</p>),
    whatIsHappening: (<p>Kruskal sorts edges by weight, then uses a Disjoint Set Union (DSU) to skip edges that would create a cycle.</p>),
    steps: ["Sort all edges by weight.", "For each edge (u, v): if u and v are in different components, add the edge and merge the components.", "Stop when V − 1 edges are added."],
    howComputerDoesIt: "Sort in O(E log E), then DSU operations in near O(α(V)) each — nearly linear.",
    pseudocode: `sort edges by weight
mst = []
for (u, v, w) in edges:
  if find(u) != find(v):
    union(u, v)
    mst.append((u, v, w))`,
    java: `// See any algorithms textbook for a full DSU-based Kruskal in Java.`,
    python: `def kruskal(V, edges):
    parent = list(range(V))
    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]; x = parent[x]
        return x
    edges.sort(key=lambda e: e[2])
    mst = []
    for u, v, w in edges:
        ru, rv = find(u), find(v)
        if ru != rv:
            parent[ru] = rv; mst.append((u, v, w))
    return mst`,
    timeComplexity: [
      { case: "Time", value: "O(E log E)", explain: "Dominated by the initial edge sort." },
      { case: "DSU ops", value: "O(α V)", explain: "Nearly O(1) with union-by-rank + path compression." },
      { case: "Space", value: "O(V + E)", explain: "DSU + edge list." },
    ],
    spaceComplexity: "O(V + E).",
    realWorld: [{ title: "Clustering", body: "Related to single-linkage hierarchical clustering." }, { title: "Sparse networks", body: "Faster than Prim on sparse graphs." }],
    quiz: [{ q: "Kruskal uses which auxiliary data structure?", options: ["Priority queue", "Disjoint Set Union", "Stack", "Trie"], answer: 1, why: "DSU quickly answers 'are u and v already connected?' to prevent cycles." }],
    visualizer: <StaticStory>Sort the sample graph's edges by weight and add them one by one, skipping any that would create a cycle.</StaticStory>,
    ...nav("kruskal"),
  }),

  "topological-sort": concept({
    slug: "topological-sort", category: "graph", name: "Topological Sort",
    tagline: "A linear order that respects every dependency.", emoji: "📋", difficulty: "Advanced",
    imagine: (<p>Your morning routine: put on socks before shoes; brew coffee before drinking. A topological sort is a valid order that respects every 'before' rule.</p>),
    whatIsHappening: (<p>Only works on DAGs. Two common approaches: (1) DFS + push nodes on finish; (2) Kahn's algorithm using in-degrees and a queue.</p>),
    steps: ["Compute in-degree for every node.", "Enqueue nodes with in-degree 0.", "Repeatedly dequeue u, add to order, and decrement in-degree of each neighbour; enqueue any that hit 0.", "If order has fewer than V nodes, the graph has a cycle."],
    howComputerDoesIt: "Kahn's algorithm runs in O(V + E) using a queue and in-degree counts.",
    pseudocode: `compute in_degree[v] for all v
queue = all v with in_degree 0
while queue not empty:
  u = dequeue
  append u to order
  for each edge u -> v:
    in_degree[v] -= 1
    if in_degree[v] == 0: enqueue v`,
    java: `// Kahn's algorithm — see the standard implementation.`,
    python: `from collections import deque, defaultdict
def topo(V, edges):
    indeg = [0]*V; adj = defaultdict(list)
    for u,v in edges: adj[u].append(v); indeg[v] += 1
    q = deque([i for i in range(V) if indeg[i] == 0])
    order = []
    while q:
        u = q.popleft(); order.append(u)
        for v in adj[u]:
            indeg[v] -= 1
            if indeg[v] == 0: q.append(v)
    return order if len(order) == V else None`,
    timeComplexity: [
      { case: "Time", value: "O(V + E)", explain: "Each vertex and edge processed once." },
      { case: "Space", value: "O(V)", explain: "Queue + in-degree array." },
      { case: "Applies to", value: "DAGs only", explain: "Cycles make a valid order impossible." },
    ],
    spaceComplexity: "O(V).",
    realWorld: [{ title: "Course prerequisites", body: "Schedule classes so every prerequisite is taken first." }, { title: "Build systems", body: "Compile files in dependency order." }],
    quiz: [{ q: "Topological sort works on…", options: ["Any graph", "Only DAGs", "Trees only", "Weighted graphs only"], answer: 1, why: "A cycle makes ordering impossible." }],
    visualizer: <StaticStory>List your morning routine steps as edges (e.g., socks → shoes) and topologically sort them.</StaticStory>,
    ...nav("topological-sort"),
  }),

  "cycle-detection": concept({
    slug: "cycle-detection", category: "graph", name: "Cycle Detection",
    tagline: "Does the graph contain a cycle?", emoji: "🔍", difficulty: "Advanced",
    imagine: (<p>A deadlock happens when two processes wait on each other. That's a cycle in the resource-wait graph.</p>),
    whatIsHappening: (<p>For undirected graphs, use DSU or DFS with parent tracking. For directed graphs, DFS with three colours (white/grey/black) — a grey → grey edge means a cycle.</p>),
    steps: ["Start DFS from any unvisited node.", "Mark the node grey (in progress).", "Recurse into neighbours; if you meet a grey node, you found a cycle.", "Mark the node black when done."],
    howComputerDoesIt: "DFS with a colour array or 'in-stack' set — O(V + E).",
    pseudocode: `dfs(u):
  color[u] = grey
  for each neighbour v of u:
    if color[v] == grey: return "cycle found"
    if color[v] == white: dfs(v)
  color[u] = black`,
    java: `// See DFS-based cycle detection in any algorithms text.`,
    python: `WHITE, GREY, BLACK = 0, 1, 2
def has_cycle(g):
    color = {v: WHITE for v in g}
    def dfs(u):
        color[u] = GREY
        for v in g[u]:
            if color[v] == GREY: return True
            if color[v] == WHITE and dfs(v): return True
        color[u] = BLACK
        return False
    return any(color[v] == WHITE and dfs(v) for v in g)`,
    timeComplexity: [
      { case: "Time", value: "O(V + E)", explain: "Standard DFS pass." },
      { case: "Space", value: "O(V)", explain: "Colours + recursion stack." },
      { case: "Detects", value: "any cycle", explain: "Not just simple cycles." },
    ],
    spaceComplexity: "O(V).",
    realWorld: [{ title: "Deadlock detection", body: "OS kernel checks a wait-for graph." }, { title: "Configuration validation", body: "Detect circular imports." }],
    quiz: [{ q: "In directed cycle detection, a 'grey' colour means…", options: ["Not visited", "Currently being explored", "Already finished", "Cycle found"], answer: 1, why: "A back-edge to a grey node closes a cycle." }],
    visualizer: <StaticStory>Add an edge from F back to A in the sample graph and mentally run DFS — you'll trip the cycle detector.</StaticStory>,
    ...nav("cycle-detection"),
  }),

  "connected-components": concept({
    slug: "connected-components", category: "graph", name: "Connected Components",
    tagline: "Find all the 'islands' of a graph.", emoji: "🏝️", difficulty: "Intermediate",
    imagine: (<p>Two isolated friend groups. Each is one connected component.</p>),
    whatIsHappening: (<p>Loop over all nodes; whenever you hit an unvisited one, run BFS or DFS to discover its entire component. Count how many times you had to start.</p>),
    steps: ["Mark all nodes unvisited.", "For each node v: if unvisited, run BFS/DFS from v — that's one new component."],
    howComputerDoesIt: "Total work is still O(V + E) because each vertex and edge is processed once across all BFS/DFS runs.",
    pseudocode: `components = 0
for each vertex v:
  if v not visited:
    bfs(v)
    components += 1`,
    java: `// Loop over vertices; run DFS from each unvisited one.`,
    python: `def components(g):
    seen = set(); count = 0
    for v in g:
        if v not in seen:
            stack = [v]
            while stack:
                x = stack.pop()
                if x in seen: continue
                seen.add(x)
                stack.extend(g[x])
            count += 1
    return count`,
    timeComplexity: [
      { case: "Time", value: "O(V + E)", explain: "Every node/edge touched once total." },
      { case: "Space", value: "O(V)", explain: "Visited set + BFS/DFS structures." },
      { case: "Also gives", value: "component id", explain: "Assign each vertex a label." },
    ],
    spaceComplexity: "O(V).",
    realWorld: [{ title: "Social clusters", body: "Find isolated communities in a network." }, { title: "Image segmentation", body: "Group pixels of the same colour into regions." }],
    quiz: [{ q: "Total time to find all connected components is…", options: ["O(V²)", "O(V + E)", "O(E²)", "O(V log V)"], answer: 1, why: "Each vertex and edge is visited exactly once across all runs." }],
    visualizer: <StaticStory>Delete the C–F edge in the sample graph and count how many components remain.</StaticStory>,
    ...nav("connected-components"),
  }),
};
