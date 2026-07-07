import type { LessonContent } from "@/components/lesson/LessonLayout";
import { FactorialVisualizer, FibonacciVisualizer, HanoiVisualizer } from "@/components/viz/RecursionVisualizers";

const ORDER = [
  "what-is-recursion", "base-case", "recursive-case", "call-stack",
  "direct-recursion", "indirect-recursion", "tail-recursion", "tree-recursion",
  "factorial", "fibonacci", "sum-natural", "reverse-string",
  "power", "recursive-binary-search", "tower-of-hanoi", "tree-traversal",
];

const nav = (slug: string) => {
  const i = ORDER.indexOf(slug);
  return {
    prev: i > 0 ? { to: `/recursion/${ORDER[i - 1]}`, label: title(ORDER[i - 1]) } : { to: "/recursion", label: "All recursion topics" },
    next: i < ORDER.length - 1 ? { to: `/recursion/${ORDER[i + 1]}`, label: title(ORDER[i + 1]) } : { to: "/graph", label: "On to Graphs →" },
  };
};

function title(slug: string) {
  return slug.split("-").map((s) => s[0].toUpperCase() + s.slice(1)).join(" ");
}

// Static "explanation" visualizer for concept-only pages
const StaticStory = ({ children }: { children: React.ReactNode }) => (
  <div className="story-card p-6 text-base leading-relaxed md:p-8">{children}</div>
);

export const RECURSION_LESSONS: Record<string, LessonContent> = {
  "what-is-recursion": {
    slug: "what-is-recursion",
    category: "recursion",
    name: "What is Recursion?",
    tagline: "A problem that solves itself by asking a smaller version of itself.",
    emoji: "🎁",
    difficulty: "Beginner",
    imagine: (
      <>
        <p>You unwrap a big gift box. Inside is a smaller box. You unwrap that one — inside is an even smaller box.</p>
        <p className="mt-3">You keep doing the <b>same action</b> — unwrap the next box — until finally there's no box left. That last empty box is the <b>base case</b>: the moment you stop.</p>
      </>
    ),
    whatIsHappening: (
      <p>Recursion is when a function calls itself with a slightly smaller version of the same problem. It needs two parts: a <b>base case</b> that stops the calls, and a <b>recursive case</b> that reduces the problem before calling itself.</p>
    ),
    steps: [
      "Ask: is this the smallest possible version of the problem? If yes → return the answer directly (base case).",
      "Otherwise, break the problem into a slightly smaller version.",
      "Call the same function on the smaller version.",
      "Use its answer to build your answer.",
      "Return that answer to whoever called you.",
    ],
    howComputerDoesIt: "Every function call is placed on a data structure called the call stack. When a function returns, its frame is removed and the caller resumes. Without a base case the stack grows forever — that's a stack overflow.",
    pseudocode: `function solve(problem):
  if problem is smallest possible:
    return direct answer   # base case
  smaller = reduce(problem)
  answer = solve(smaller)  # recursive call
  return combine(answer)`,
    java: `int solve(int n) {
    if (n == 0) return 0;   // base case
    return n + solve(n - 1); // recursive call
}`,
    python: `def solve(n):
    if n == 0:
        return 0            # base case
    return n + solve(n - 1) # recursive call`,
    timeComplexity: [
      { case: "Depends", value: "varies", explain: "Recursion's cost depends on how many calls are made." },
      { case: "Depth", value: "O(depth)", explain: "The stack grows to the recursion depth." },
      { case: "Rule", value: "T(n)=T(n−1)+…", explain: "Cost is described by a recurrence relation." },
    ],
    spaceComplexity: "Each call adds a frame to the call stack.",
    realWorld: [
      { title: "Folder structures", body: "A folder can contain folders that contain folders — traverse them recursively." },
      { title: "Mathematics", body: "Definitions like factorial and Fibonacci are naturally recursive." },
    ],
    quiz: [
      { q: "What happens if a recursive function has no base case?", options: ["It returns 0", "Stack overflow", "It sorts the input", "Nothing"], answer: 1, why: "Every call adds a frame; without a stopping condition the call stack runs out of memory." },
    ],
    visualizer: <StaticStory>Recursion is best learned by seeing it in action. Try the <b>Factorial</b> and <b>Tower of Hanoi</b> pages to watch the call stack grow and shrink.</StaticStory>,
    ...nav("what-is-recursion"),
  },

  "base-case": {
    slug: "base-case",
    category: "recursion",
    name: "Base Case",
    tagline: "The stopping point of every recursion.",
    emoji: "🛑",
    difficulty: "Beginner",
    imagine: (<><p>You're going down a staircase. Eventually you hit the bottom step and stop. That last step is the base case.</p></>),
    whatIsHappening: (<p>The base case is the simplest input that we can answer directly, without any more recursion. It stops the chain of calls and lets answers flow back up the stack.</p>),
    steps: [
      "Identify the smallest possible input.",
      "Return its answer directly with no further calls.",
      "Ensure every recursive call moves closer to this input.",
    ],
    howComputerDoesIt: "When the base case matches, the function returns immediately. The caller then continues and returns its own value, all the way up.",
    pseudocode: `if input is smallest:
  return known answer`,
    java: `if (n <= 1) return 1;`,
    python: `if n <= 1:\n    return 1`,
    timeComplexity: [
      { case: "Best", value: "O(1)", explain: "Base cases return immediately." },
      { case: "Rule", value: "n/a", explain: "The base case alone is constant time." },
      { case: "Guard", value: "required", explain: "Without it, recursion never ends." },
    ],
    spaceComplexity: "O(1) for the base case itself.",
    realWorld: [
      { title: "Loops in disguise", body: "Every loop has an exit condition — recursion's base case plays the same role." },
    ],
    quiz: [
      { q: "The base case should…", options: ["Call the function again", "Return an answer directly", "Log an error", "Do nothing"], answer: 1, why: "It ends recursion by returning a known answer without further calls." },
    ],
    visualizer: <StaticStory>Every recursion example on this site (Factorial, Fibonacci, Hanoi) contains a base case — watch what happens the moment it triggers.</StaticStory>,
    ...nav("base-case"),
  },

  "recursive-case": {
    slug: "recursive-case",
    category: "recursion",
    name: "Recursive Case",
    tagline: "The rule that breaks the problem into a smaller one.",
    emoji: "🔁",
    difficulty: "Beginner",
    imagine: (<><p>A big Russian doll opens to reveal a slightly smaller doll. The rule "open the doll" is the recursive case; the last, tiny solid doll is the base case.</p></>),
    whatIsHappening: (<p>The recursive case reduces the problem — say from n to n − 1 — and calls the function again, then uses the returned answer to build its own.</p>),
    steps: [
      "Take the input.",
      "Produce a smaller sub-problem.",
      "Call the function recursively on it.",
      "Combine the sub-answer with the current level's work.",
    ],
    howComputerDoesIt: "The recursive call adds a new frame to the stack. Execution jumps into the new call, runs to completion, returns, and the current frame resumes with the result.",
    pseudocode: `answer = f(smaller)\nreturn combine(current, answer)`,
    java: `return n * factorial(n - 1);`,
    python: `return n * factorial(n - 1)`,
    timeComplexity: [
      { case: "Depends", value: "varies", explain: "Depends on how much the input shrinks." },
      { case: "Linear shrink", value: "O(n)", explain: "If it goes n → n−1 each call." },
      { case: "Halving", value: "O(log n)", explain: "If it goes n → n/2 each call." },
    ],
    spaceComplexity: "O(depth of recursion).",
    realWorld: [
      { title: "Divide and conquer", body: "Merge Sort, Quick Sort, binary search — all define a recursive case that reduces work." },
    ],
    quiz: [
      { q: "A recursive case must always…", options: ["Return immediately", "Reduce the input toward the base case", "Print something", "Sort the input"], answer: 1, why: "Otherwise the recursion never reaches the base case." },
    ],
    visualizer: <StaticStory>Open the <b>Factorial</b> visualizer to see the recursive case (n × factorial(n−1)) build up and then collapse.</StaticStory>,
    ...nav("recursive-case"),
  },

  "call-stack": {
    slug: "call-stack",
    category: "recursion",
    name: "The Call Stack",
    tagline: "Where the computer remembers every unfinished function.",
    emoji: "🥞",
    difficulty: "Beginner",
    imagine: (<><p>Imagine a stack of plates in a canteen. When a new function starts, you place a plate on top. When it finishes, you take the top plate off.</p></>),
    whatIsHappening: (<p>Every time a function is called, its local variables and location are stored in a small memory area called a <b>stack frame</b>. Frames stack up as calls nest. When a function returns, its frame is popped and control resumes in the caller.</p>),
    steps: [
      "A function is called → a frame is pushed onto the stack.",
      "If it calls another function → another frame is pushed.",
      "When a function returns → its frame is popped and the caller resumes.",
      "Stack size grows to the recursion depth.",
    ],
    howComputerDoesIt: "The stack is a fixed region of memory. Each frame holds parameters, local variables and the return address. Too deep a recursion exhausts this region and throws a stack overflow.",
    pseudocode: `push frame(f, args)  // on call\npop frame            // on return`,
    java: `// Every method call adds a StackFrame to the JVM stack.`,
    python: `# Each call adds a frame; check sys.getrecursionlimit()`,
    timeComplexity: [
      { case: "Push", value: "O(1)", explain: "One frame per call." },
      { case: "Depth", value: "O(depth)", explain: "Stack size grows with recursion depth." },
      { case: "Overflow", value: "risk", explain: "Deep recursion can crash the program." },
    ],
    spaceComplexity: "O(depth) — the biggest cost of recursion.",
    realWorld: [
      { title: "Undo / redo history", body: "Editors keep a stack of user actions so you can undo them one by one." },
      { title: "Browser back button", body: "The last page you visited is 'on top' of the history stack." },
    ],
    quiz: [
      { q: "When a function returns, its stack frame is…", options: ["Kept forever", "Popped off the stack", "Sent to disk", "Copied"], answer: 1, why: "Popping frees the memory for the next call." },
    ],
    visualizer: <StaticStory>The Factorial visualizer <i>is</i> a live call-stack view — try n = 5 and watch frames pile up, then unwind.</StaticStory>,
    ...nav("call-stack"),
  },

  "direct-recursion": {
    slug: "direct-recursion",
    category: "recursion",
    name: "Direct Recursion",
    tagline: "A function that calls itself.",
    emoji: "➡️",
    difficulty: "Beginner",
    imagine: (<p>You ask yourself to solve a simpler version of the same problem — no one else in the middle.</p>),
    whatIsHappening: (<p>Direct recursion is the plain form: <code>f</code> calls <code>f</code>. Almost every recursion example you'll see is direct recursion.</p>),
    steps: ["Function f is called.", "Inside f, f is called again with smaller input.", "Continue until base case."],
    howComputerDoesIt: "Just repeated frames of the same function on the stack.",
    pseudocode: `function f(n):\n  if base: return\n  f(n - 1)`,
    java: `void f(int n){ if(n==0) return; f(n-1); }`,
    python: `def f(n):\n    if n == 0: return\n    f(n - 1)`,
    timeComplexity: [
      { case: "Best", value: "O(base)", explain: "Base case returns immediately." },
      { case: "Rule", value: "T(n)=T(n−1)+O(1)", explain: "Linear number of calls." },
      { case: "Depth", value: "O(n)", explain: "Stack grows with n." },
    ],
    spaceComplexity: "O(n) for the stack.",
    realWorld: [{ title: "Everywhere", body: "This is the default form of recursion in most codebases." }],
    quiz: [{ q: "Direct recursion means…", options: ["A calls B calls A", "A calls itself", "A is iterative", "A has no base case"], answer: 1, why: "The function's own body calls the same function." }],
    visualizer: <StaticStory>Factorial and Fibonacci on this site are direct recursion.</StaticStory>,
    ...nav("direct-recursion"),
  },

  "indirect-recursion": {
    slug: "indirect-recursion",
    category: "recursion",
    name: "Indirect Recursion",
    tagline: "A calls B, B calls A.",
    emoji: "🔀",
    difficulty: "Intermediate",
    imagine: (<p>You ask your friend for help, and your friend asks you for help back. Both of you are involved in solving the problem.</p>),
    whatIsHappening: (<p>Indirect recursion involves two or more functions calling each other in a cycle. It's useful when the problem naturally alternates between two states (e.g., even/odd checks).</p>),
    steps: ["f calls g.", "g does some work and calls f.", "Continue until a base case in either function stops the cycle."],
    howComputerDoesIt: "The call stack alternates frames from f and g. As long as each recursion eventually hits a base case, it terminates safely.",
    pseudocode: `function isEven(n):\n  if n == 0: return true\n  return isOdd(n - 1)\n\nfunction isOdd(n):\n  if n == 0: return false\n  return isEven(n - 1)`,
    java: `boolean isEven(int n){ return n==0 ? true : isOdd(n-1); }\nboolean isOdd(int n){ return n==0 ? false : isEven(n-1); }`,
    python: `def is_even(n): return True if n == 0 else is_odd(n - 1)\ndef is_odd(n):  return False if n == 0 else is_even(n - 1)`,
    timeComplexity: [
      { case: "Same as direct", value: "varies", explain: "Depends on how each call reduces the input." },
      { case: "Alternation", value: "O(n)", explain: "For the even/odd example." },
      { case: "Depth", value: "O(n)", explain: "Stack grows with combined depth." },
    ],
    spaceComplexity: "O(depth of interleaved calls).",
    realWorld: [{ title: "Parsers", body: "Recursive-descent parsers use functions that call one another according to grammar rules." }],
    quiz: [{ q: "In indirect recursion…", options: ["One function loops", "Two functions call each other", "Nothing calls anything", "There is no base case"], answer: 1, why: "The chain of calls passes through more than one function." }],
    visualizer: <StaticStory>Trace the even/odd example on paper for n = 4 to see the alternation.</StaticStory>,
    ...nav("indirect-recursion"),
  },

  "tail-recursion": {
    slug: "tail-recursion",
    category: "recursion",
    name: "Tail Recursion",
    tagline: "The recursive call is the very last thing the function does.",
    emoji: "🐈",
    difficulty: "Intermediate",
    imagine: (<p>You finish everything you had to do, and just before leaving, you hand the whole remaining task to someone else. You don't wait around.</p>),
    whatIsHappening: (<p>A tail-recursive function's final statement is the recursive call itself — nothing depends on its return value at the current level. Some compilers can reuse the current stack frame, making it as efficient as a loop.</p>),
    steps: ["Perform any needed work.", "As the final step, call the function again.", "No arithmetic or logic happens after the return."],
    howComputerDoesIt: "In languages with tail-call optimization (TCO), the stack frame is reused instead of pushed. In Java and Python, TCO is not applied, so tail recursion still uses stack space.",
    pseudocode: `function fact(n, acc):\n  if n <= 1: return acc\n  return fact(n - 1, n * acc)   # tail call`,
    java: `int fact(int n, int acc){ return n <= 1 ? acc : fact(n-1, n*acc); }`,
    python: `def fact(n, acc=1):\n    return acc if n <= 1 else fact(n - 1, n * acc)`,
    timeComplexity: [
      { case: "Same work", value: "O(n)", explain: "Same number of steps as non-tail version." },
      { case: "With TCO", value: "O(1) space", explain: "Stack frame is reused each call." },
      { case: "Without TCO", value: "O(n) space", explain: "Stack still grows in Java/Python." },
    ],
    spaceComplexity: "O(1) with TCO, O(n) otherwise.",
    realWorld: [{ title: "Functional languages", body: "Scheme, OCaml and Scala rely on tail recursion instead of loops." }],
    quiz: [{ q: "Tail recursion is efficient because…", options: ["It skips the base case", "The recursive call is the last operation", "It uses less memory always", "It never returns"], answer: 1, why: "Compilers can reuse the current frame since nothing else needs it." }],
    visualizer: <StaticStory>Rewrite factorial as a tail-recursive function on paper: notice the accumulator argument.</StaticStory>,
    ...nav("tail-recursion"),
  },

  "tree-recursion": {
    slug: "tree-recursion",
    category: "recursion",
    name: "Tree Recursion",
    tagline: "One call branches into multiple recursive calls.",
    emoji: "🌳",
    difficulty: "Intermediate",
    imagine: (<p>Each recursive call splits into two or more sub-problems, which each split again — the call structure forms a tree.</p>),
    whatIsHappening: (<p>Tree recursion is common in problems that explore many possibilities: Fibonacci, tree traversal, permutations, and combinatorial search.</p>),
    steps: ["Base case returns immediately.", "Recursive case makes two or more calls.", "Combine the results (sum, count, minimum, etc.)."],
    howComputerDoesIt: "The call tree can grow exponentially. Memoization (caching results of sub-problems) turns exponential blow-up into linear time.",
    pseudocode: `function fib(n):\n  if n < 2: return n\n  return fib(n-1) + fib(n-2)`,
    java: `int fib(int n){ return n<2 ? n : fib(n-1)+fib(n-2); }`,
    python: `def fib(n): return n if n < 2 else fib(n-1) + fib(n-2)`,
    timeComplexity: [
      { case: "Fibonacci naive", value: "O(2ⁿ)", explain: "Every call spawns two more — the tree doubles at each level." },
      { case: "With memoization", value: "O(n)", explain: "Each n is computed once and reused." },
      { case: "Depth", value: "O(n)", explain: "Longest path from root to leaf." },
    ],
    spaceComplexity: "O(depth) for the stack, plus any cache.",
    realWorld: [{ title: "Game trees", body: "Chess and Go engines explore possible moves recursively." }],
    quiz: [{ q: "The naive Fibonacci recursion is slow because…", options: ["It has no base case", "It repeats the same sub-problems many times", "Recursion is always slow", "Additions are expensive"], answer: 1, why: "The recursion tree recomputes fib(k) exponentially many times." }],
    visualizer: <StaticStory>Open the <b>Fibonacci</b> visualizer to literally see the tree growing.</StaticStory>,
    ...nav("tree-recursion"),
  },

  "factorial": {
    slug: "factorial",
    category: "recursion",
    name: "Factorial",
    tagline: "5! = 5 × 4 × 3 × 2 × 1.",
    emoji: "🧮",
    difficulty: "Beginner",
    imagine: (<><p>You want to count the number of different ways to arrange 5 books on a shelf. First slot: 5 choices. Second: 4. Third: 3. Fourth: 2. Fifth: 1. Total = 5 × 4 × 3 × 2 × 1 = 120.</p><p className="mt-3">That's factorial — <code>n! = n × (n − 1)!</code>. It naturally repeats a smaller version of itself.</p></>),
    whatIsHappening: (<p>factorial(n) calls factorial(n − 1), which calls factorial(n − 2), and so on down to factorial(1) which returns 1 directly. Then the answers multiply back up.</p>),
    steps: ["If n ≤ 1, return 1 (base case).", "Otherwise, compute factorial(n − 1).", "Return n multiplied by that result."],
    howComputerDoesIt: "Each call pushes a frame with n. Frames pile up until n reaches 1. Then results multiply back as frames pop.",
    pseudocode: `function factorial(n):\n  if n <= 1: return 1\n  return n * factorial(n - 1)`,
    java: `int factorial(int n){ return n <= 1 ? 1 : n * factorial(n - 1); }`,
    python: `def factorial(n): return 1 if n <= 1 else n * factorial(n - 1)`,
    timeComplexity: [
      { case: "Best/Avg/Worst", value: "O(n)", explain: "n calls total." },
      { case: "Depth", value: "O(n)", explain: "The stack grows to depth n." },
      { case: "Growth", value: "n!", explain: "The result itself grows very fast." },
    ],
    spaceComplexity: "O(n) — one frame per call.",
    realWorld: [{ title: "Counting arrangements", body: "How many ways can k items be ordered?" }, { title: "Probability", body: "Factorials appear in permutation and combination formulas." }],
    quiz: [{ q: "factorial(0) equals…", options: ["0", "1", "undefined", "0!"], answer: 1, why: "By convention, 0! = 1 (there's exactly one way to arrange zero items — do nothing)." }],
    visualizer: <FactorialVisualizer defaultN={5} />,
    ...nav("factorial"),
  },

  "fibonacci": {
    slug: "fibonacci",
    category: "recursion",
    name: "Fibonacci",
    tagline: "Each number is the sum of the two before it.",
    emoji: "🐚",
    difficulty: "Beginner",
    imagine: (<><p>0, 1, 1, 2, 3, 5, 8, 13, 21, 34… every new number is the sum of the two before it.</p><p className="mt-3">In nature: sunflower seed spirals, pinecones, the shape of a nautilus shell — Fibonacci everywhere.</p></>),
    whatIsHappening: (<p>fib(n) calls fib(n − 1) and fib(n − 2). Each of those calls does the same. The call structure is a tree with a lot of repeated work — a great motivation for memoization.</p>),
    steps: ["If n &lt; 2, return n.", "Otherwise return fib(n − 1) + fib(n − 2)."],
    howComputerDoesIt: "Two recursive calls per invocation. Without memoization, fib(30) takes over a million calls. With memoization, it's just 30.",
    pseudocode: `function fib(n):\n  if n < 2: return n\n  return fib(n - 1) + fib(n - 2)`,
    java: `int fib(int n){ return n < 2 ? n : fib(n-1) + fib(n-2); }`,
    python: `def fib(n): return n if n < 2 else fib(n-1) + fib(n-2)`,
    timeComplexity: [
      { case: "Naive", value: "O(2ⁿ)", explain: "Exponential — repeats sub-problems." },
      { case: "Memoized", value: "O(n)", explain: "Cache each fib(k) once." },
      { case: "Iterative", value: "O(n)", explain: "Loop is even simpler and O(1) space." },
    ],
    spaceComplexity: "O(n) recursion depth.",
    realWorld: [{ title: "Nature and art", body: "Golden ratio, spiral patterns." }, { title: "Dynamic programming intro", body: "The classic teaching example for memoization." }],
    quiz: [{ q: "Why is naive Fibonacci slow?", options: ["Addition is slow", "It repeats calculations", "It's tail recursive", "Base case runs forever"], answer: 1, why: "fib(n-2) is computed inside both fib(n-1) and directly — every sub-problem is solved many times." }],
    visualizer: <FibonacciVisualizer defaultN={5} />,
    ...nav("fibonacci"),
  },

  "sum-natural": {
    slug: "sum-natural",
    category: "recursion",
    name: "Sum of Natural Numbers",
    tagline: "1 + 2 + 3 + … + n, recursively.",
    emoji: "➕",
    difficulty: "Beginner",
    imagine: (<p>Adding numbers from 1 to n. You can add n to the sum of 1 to n − 1.</p>),
    whatIsHappening: (<p>sum(n) = n + sum(n − 1), with base case sum(0) = 0. Same structure as factorial, but with + instead of ×.</p>),
    steps: ["If n == 0, return 0.", "Otherwise return n + sum(n − 1)."],
    howComputerDoesIt: "One recursive call per level; n frames deep.",
    pseudocode: `function sum(n):\n  if n == 0: return 0\n  return n + sum(n - 1)`,
    java: `int sum(int n){ return n == 0 ? 0 : n + sum(n - 1); }`,
    python: `def sum_to(n): return 0 if n == 0 else n + sum_to(n - 1)`,
    timeComplexity: [
      { case: "Recursion", value: "O(n)", explain: "n calls." },
      { case: "Formula", value: "O(1)", explain: "n(n+1)/2 solves it instantly." },
      { case: "Depth", value: "O(n)", explain: "Stack depth = n." },
    ],
    spaceComplexity: "O(n) frames.",
    realWorld: [{ title: "Teaching example", body: "A great intro to writing your first recursion." }],
    quiz: [{ q: "Closed-form for sum(n)?", options: ["n²", "n(n+1)/2", "2n", "n!"], answer: 1, why: "This is Gauss's formula — provable by induction." }],
    visualizer: <StaticStory>Try tracing sum(4): 4 + sum(3) = 4 + (3 + sum(2)) = 4 + 3 + (2 + sum(1)) = 10.</StaticStory>,
    ...nav("sum-natural"),
  },

  "reverse-string": {
    slug: "reverse-string",
    category: "recursion",
    name: "Reverse a String",
    tagline: "Reverse the tail, then put the first character at the end.",
    emoji: "🔁",
    difficulty: "Beginner",
    imagine: (<p>Take the first letter aside, reverse the rest, then paste that first letter at the end.</p>),
    whatIsHappening: (<p>reverse(s) = reverse(s[1:]) + s[0]. Peel off the head, recurse on the tail, glue the head at the end.</p>),
    steps: ["If the string is empty, return \"\".", "Otherwise return reverse(rest) + first character."],
    howComputerDoesIt: "One recursive call per character; produces the reversed string one character at a time.",
    pseudocode: `function reverse(s):\n  if s == "": return ""\n  return reverse(s[1:]) + s[0]`,
    java: `String reverse(String s){ return s.isEmpty() ? s : reverse(s.substring(1)) + s.charAt(0); }`,
    python: `def reverse(s): return s if s == "" else reverse(s[1:]) + s[0]`,
    timeComplexity: [
      { case: "Recursion", value: "O(n²)", explain: "Each substring copy is O(n)." },
      { case: "Two-pointer swap", value: "O(n)", explain: "Iterative swap in place is faster." },
      { case: "Depth", value: "O(n)", explain: "Stack grows with string length." },
    ],
    spaceComplexity: "O(n) for the stack and intermediate strings.",
    realWorld: [{ title: "String manipulation classics", body: "Common interview warm-up." }],
    quiz: [{ q: "Base case for reversing a string?", options: ["s has one char", "s is empty", "s is uppercase", "s is null"], answer: 1, why: "Empty string reversed is empty; single-char also works but empty is the cleanest base case." }],
    visualizer: <StaticStory>Trace reverse("cat"): reverse("at") + "c" = (reverse("t") + "a") + "c" = ("" + "t" + "a") + "c" = "tac".</StaticStory>,
    ...nav("reverse-string"),
  },

  "power": {
    slug: "power",
    category: "recursion",
    name: "Power Calculation",
    tagline: "aⁿ — solved recursively (fast version uses halving).",
    emoji: "⚡",
    difficulty: "Intermediate",
    imagine: (<p>a⁸ = a⁴ × a⁴ = (a² × a²) × (a² × a²). Halving the exponent turns n multiplications into log₂(n).</p>),
    whatIsHappening: (<p>Naively power(a, n) = a × power(a, n − 1) — O(n). Fast power uses recursion on n / 2: if n is even, aⁿ = (aⁿ/²)²; if odd, aⁿ = a × aⁿ⁻¹.</p>),
    steps: ["If n == 0, return 1.", "If n is even, compute h = power(a, n / 2), return h × h.", "If n is odd, return a × power(a, n − 1)."],
    howComputerDoesIt: "Recursion depth is log₂(n) for the fast version. Each level does a constant amount of work.",
    pseudocode: `function power(a, n):\n  if n == 0: return 1\n  if n % 2 == 0:\n    h = power(a, n / 2)\n    return h * h\n  return a * power(a, n - 1)`,
    java: `long power(long a, int n){\n  if (n == 0) return 1;\n  if (n % 2 == 0){ long h = power(a, n/2); return h*h; }\n  return a * power(a, n-1);\n}`,
    python: `def power(a, n):\n    if n == 0: return 1\n    if n % 2 == 0:\n        h = power(a, n // 2); return h * h\n    return a * power(a, n - 1)`,
    timeComplexity: [
      { case: "Naive", value: "O(n)", explain: "n multiplications." },
      { case: "Fast", value: "O(log n)", explain: "Halve the exponent each step." },
      { case: "Space", value: "O(log n)", explain: "Recursion depth." },
    ],
    spaceComplexity: "O(log n) for fast power.",
    realWorld: [{ title: "Cryptography", body: "Modular exponentiation for RSA uses this exact trick." }, { title: "Graphics transforms", body: "Matrix powers use the same halving idea." }],
    quiz: [{ q: "Fast power's time complexity?", options: ["O(n²)", "O(n)", "O(log n)", "O(1)"], answer: 2, why: "Halving n each step gives log₂(n) recursion depth." }],
    visualizer: <StaticStory>Trace power(2, 10): 10 is even → h = power(2, 5); 5 is odd → 2 × power(2, 4); 4 → h × h where h = power(2, 2); …</StaticStory>,
    ...nav("power"),
  },

  "recursive-binary-search": {
    slug: "recursive-binary-search",
    category: "recursion",
    name: "Recursive Binary Search",
    tagline: "Search a sorted list by repeatedly halving.",
    emoji: "🔎",
    difficulty: "Intermediate",
    imagine: (<p>Looking up a word in a physical dictionary. Open the middle. If your word is later, throw away the left half. Otherwise throw away the right half. Repeat.</p>),
    whatIsHappening: (<p>Binary search halves the search space each step. Recursion expresses this naturally: search either the left half or the right half.</p>),
    steps: ["If l > r, the value is missing — return −1.", "Compute mid = (l + r) / 2.", "If A[mid] == target, return mid.", "If target < A[mid], recurse on left half.", "Else recurse on right half."],
    howComputerDoesIt: "Recursion depth is log₂(n). Each call decides which half to keep.",
    pseudocode: `function search(A, l, r, target):\n  if l > r: return -1\n  m = (l + r) / 2\n  if A[m] == target: return m\n  if target < A[m]: return search(A, l, m - 1, target)\n  return search(A, m + 1, r, target)`,
    java: `int search(int[] a, int l, int r, int t){\n  if (l > r) return -1;\n  int m = (l + r) / 2;\n  if (a[m] == t) return m;\n  return t < a[m] ? search(a, l, m-1, t) : search(a, m+1, r, t);\n}`,
    python: `def search(a, l, r, t):\n    if l > r: return -1\n    m = (l + r) // 2\n    if a[m] == t: return m\n    return search(a, l, m-1, t) if t < a[m] else search(a, m+1, r, t)`,
    timeComplexity: [
      { case: "Best", value: "O(1)", explain: "Target is at the middle." },
      { case: "Average", value: "O(log n)", explain: "Halves the range each step." },
      { case: "Worst", value: "O(log n)", explain: "Even a missing value ends in log₂(n) steps." },
    ],
    spaceComplexity: "O(log n) recursion depth.",
    realWorld: [{ title: "Dictionaries", body: "Physical and digital lookup by keyword." }, { title: "Database indexes", body: "B-trees generalize binary search to disk pages." }],
    quiz: [{ q: "Binary search requires…", options: ["Any list", "A sorted list", "A tree", "A hash map"], answer: 1, why: "Halving only works when values are ordered." }],
    visualizer: <StaticStory>Try mentally searching for 42 in [1, 5, 10, 20, 42, 60, 88] — you'll take only 3 steps.</StaticStory>,
    ...nav("recursive-binary-search"),
  },

  "tower-of-hanoi": {
    slug: "tower-of-hanoi",
    category: "recursion",
    name: "Tower of Hanoi",
    tagline: "Move all disks from A to C — one at a time, never a big disk on a small one.",
    emoji: "🗼",
    difficulty: "Intermediate",
    imagine: (<><p>Three towers labelled A, B, C. On A there are n disks stacked from big at the bottom to small on top.</p><p className="mt-3">Move all of them to C. Rules: move one disk at a time, and never place a larger disk on a smaller one.</p><p className="mt-3">Trick: to move n disks from A to C, first move n − 1 disks out of the way to B, move the biggest disk to C, then bring the n − 1 disks from B on top.</p></>),
    whatIsHappening: (<p>Tower of Hanoi is the canonical demonstration of recursion. The solution to n disks is defined in terms of the solution to n − 1 disks — twice.</p>),
    steps: ["Move n − 1 disks from source to auxiliary (recursion).", "Move the biggest disk from source to destination.", "Move n − 1 disks from auxiliary to destination (recursion)."],
    howComputerDoesIt: "Two recursive calls per invocation, with the largest disk moved between them. Total moves = 2ⁿ − 1.",
    pseudocode: `function hanoi(n, from, to, via):\n  if n == 0: return\n  hanoi(n - 1, from, via, to)\n  move disk n from -> to\n  hanoi(n - 1, via, to, from)`,
    java: `void hanoi(int n, char a, char c, char b){\n  if (n == 0) return;\n  hanoi(n - 1, a, b, c);\n  System.out.println("Move " + n + " from " + a + " to " + c);\n  hanoi(n - 1, b, c, a);\n}`,
    python: `def hanoi(n, a, c, b):\n    if n == 0: return\n    hanoi(n - 1, a, b, c)\n    print(f"Move {n} from {a} to {c}")\n    hanoi(n - 1, b, c, a)`,
    timeComplexity: [
      { case: "Moves", value: "2ⁿ − 1", explain: "5 disks → 31 moves. 20 disks → over a million." },
      { case: "Rule", value: "T(n)=2T(n−1)+1", explain: "Two recursive calls plus one move." },
      { case: "Depth", value: "O(n)", explain: "Stack depth stays linear." },
    ],
    spaceComplexity: "O(n) recursion depth.",
    realWorld: [{ title: "Backup rotation", body: "Some backup schemes rotate media in a Hanoi-like pattern." }, { title: "Puzzle theory", body: "A classical example of recursive problem decomposition." }],
    quiz: [{ q: "Total moves for 6 disks?", options: ["6", "36", "63", "128"], answer: 2, why: "2⁶ − 1 = 63." }],
    visualizer: <HanoiVisualizer defaultDisks={3} />,
    ...nav("tower-of-hanoi"),
  },

  "tree-traversal": {
    slug: "tree-traversal",
    category: "recursion",
    name: "Tree Traversal",
    tagline: "Visit every node of a tree recursively.",
    emoji: "🌲",
    difficulty: "Intermediate",
    imagine: (<p>A family tree with a root person, their children, grandchildren, and so on. Recursion lets you visit everyone — starting from the root and diving into every branch.</p>),
    whatIsHappening: (<p>The three classical binary-tree orders are <b>in-order</b> (left, node, right), <b>pre-order</b> (node, left, right), and <b>post-order</b> (left, right, node). Each is a tiny recursive function.</p>),
    steps: ["Base case: node is null — return.", "Recursively visit the left subtree.", "Do something with the node's value (position depends on the traversal).", "Recursively visit the right subtree."],
    howComputerDoesIt: "The recursion depth matches the height of the tree. For a balanced tree that's O(log n); for a skewed tree it can be O(n).",
    pseudocode: `function inorder(node):\n  if node == null: return\n  inorder(node.left)\n  visit(node)\n  inorder(node.right)`,
    java: `void inorder(Node n){ if(n==null) return; inorder(n.left); visit(n); inorder(n.right); }`,
    python: `def inorder(n):\n    if n is None: return\n    inorder(n.left); visit(n); inorder(n.right)`,
    timeComplexity: [
      { case: "All traversals", value: "O(n)", explain: "Every node is visited once." },
      { case: "Balanced", value: "O(log n) depth", explain: "Recursion depth ≈ tree height." },
      { case: "Skewed", value: "O(n) depth", explain: "Worst-case depth equals node count." },
    ],
    spaceComplexity: "O(h) — h is the tree height.",
    realWorld: [{ title: "File systems", body: "Walking directories is a recursive tree traversal." }, { title: "Expression evaluation", body: "Post-order traversal of an expression tree computes its value." }],
    quiz: [{ q: "In-order traversal of a Binary Search Tree gives…", options: ["Random order", "Values in sorted order", "Reverse sorted", "Level order"], answer: 1, why: "BST guarantees left < node < right, so in-order visits values in ascending order." }],
    visualizer: <StaticStory>Practice on paper: draw a small tree and trace in-order, pre-order and post-order until it becomes second nature.</StaticStory>,
    ...nav("tree-traversal"),
  },
};
