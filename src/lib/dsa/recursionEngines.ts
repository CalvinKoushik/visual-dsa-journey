// Recursion visualization engines.

export interface CallFrame {
  id: number;
  label: string;
  depth: number;
  args: string;
  result?: string;
}

export interface RecursionStep {
  frames: CallFrame[]; // current call stack (top of stack = last)
  action: "call" | "return" | "compute";
  what: string;
  question: string;
  decision: string;
  next: string;
  currentResult?: string;
}

// Factorial
export function factorialSteps(n: number): RecursionStep[] {
  const steps: RecursionStep[] = [];
  const stack: CallFrame[] = [];
  let idCounter = 0;

  function call(k: number, depth: number): number {
    const id = ++idCounter;
    const frame: CallFrame = { id, label: `factorial(${k})`, depth, args: String(k) };
    stack.push(frame);
    steps.push({
      frames: stack.map((f) => ({ ...f })),
      action: "call",
      what: `We call factorial(${k}).`,
      question: k <= 1 ? "Have we reached the base case?" : `Can we solve factorial(${k}) directly?`,
      decision:
        k <= 1
          ? "Yes — factorial(1) is 1 by definition."
          : `Not yet — we need factorial(${k - 1}) first.`,
      next: k <= 1 ? "Return 1 up the stack." : `Call factorial(${k - 1}).`,
    });
    if (k <= 1) {
      frame.result = "1";
      steps.push({
        frames: stack.map((f) => ({ ...f })),
        action: "return",
        what: `Base case reached.`,
        question: "What do we return?",
        decision: "1.",
        next: "Pop this frame and give 1 to the caller.",
        currentResult: "1",
      });
      stack.pop();
      return 1;
    }
    const sub = call(k - 1, depth + 1);
    const result = k * sub;
    frame.result = String(result);
    steps.push({
      frames: stack.map((f) => ({ ...f })),
      action: "compute",
      what: `factorial(${k}) = ${k} × factorial(${k - 1}) = ${k} × ${sub} = ${result}.`,
      question: "What do we return?",
      decision: `${result}.`,
      next: "Give the result to the caller.",
      currentResult: String(result),
    });
    stack.pop();
    return result;
  }
  call(n, 0);
  return steps;
}

// Fibonacci
export interface FibNode {
  id: number;
  n: number;
  parent: number | null;
  result?: number;
}

export interface FibStep {
  nodes: FibNode[];
  currentId: number;
  what: string;
  question: string;
  decision: string;
  next: string;
}

export function fibonacciSteps(n: number): FibStep[] {
  const steps: FibStep[] = [];
  const nodes: FibNode[] = [];
  let idc = 0;
  function fib(k: number, parent: number | null): number {
    const id = ++idc;
    const node: FibNode = { id, n: k, parent };
    nodes.push(node);
    steps.push({
      nodes: nodes.map((x) => ({ ...x })),
      currentId: id,
      what: `Call fib(${k}).`,
      question: k < 2 ? "Base case?" : `Do we know fib(${k}) directly?`,
      decision: k < 2 ? `Yes — fib(${k}) = ${k}.` : `No — need fib(${k - 1}) + fib(${k - 2}).`,
      next: k < 2 ? "Return the value up." : "Split into two calls.",
    });
    if (k < 2) {
      node.result = k;
      return k;
    }
    const a = fib(k - 1, id);
    const b = fib(k - 2, id);
    node.result = a + b;
    steps.push({
      nodes: nodes.map((x) => ({ ...x })),
      currentId: id,
      what: `fib(${k}) = fib(${k - 1}) + fib(${k - 2}) = ${a} + ${b} = ${a + b}.`,
      question: "Return value?",
      decision: `${a + b}.`,
      next: "Return to the caller.",
    });
    return a + b;
  }
  fib(n, null);
  return steps;
}

// Tower of Hanoi
export interface HanoiStep {
  towers: [number[], number[], number[]]; // top of stack = last element
  moving?: { from: number; to: number; disk: number };
  what: string;
  question: string;
  decision: string;
  next: string;
  moveNumber: number;
}

export function hanoiSteps(n: number): HanoiStep[] {
  const towers: [number[], number[], number[]] = [
    Array.from({ length: n }, (_, i) => n - i),
    [],
    [],
  ];
  const steps: HanoiStep[] = [];
  let move = 0;
  steps.push({
    towers: [towers[0].slice(), towers[1].slice(), towers[2].slice()],
    what: `Start — all ${n} disks are on tower A.`,
    question: "Where should they end up?",
    decision: "On tower C.",
    next: "Move the smaller disks out of the way first.",
    moveNumber: 0,
  });
  const names = ["A", "B", "C"];
  function solve(k: number, from: number, to: number, via: number) {
    if (k === 0) return;
    solve(k - 1, from, via, to);
    const disk = towers[from].pop()!;
    towers[to].push(disk);
    move++;
    steps.push({
      towers: [towers[0].slice(), towers[1].slice(), towers[2].slice()],
      moving: { from, to, disk },
      what: `Move disk ${disk} from tower ${names[from]} to tower ${names[to]}.`,
      question: "Is this legal?",
      decision: "Yes — we only move one disk and never place a bigger one on a smaller one.",
      next: k - 1 > 0 ? `Now shift the ${k - 1} disk(s) from ${names[via]} to ${names[to]}.` : "Continue.",
      moveNumber: move,
    });
    solve(k - 1, via, to, from);
  }
  solve(n, 0, 2, 1);
  return steps;
}
