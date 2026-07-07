// Sorting engines — produce step-by-step visualization frames from real algorithm logic.
// Each step includes the current array, indices being touched, action label,
// and a plain-English explanation so the visualizer can teach at every frame.

export type SortAction =
  | "compare"
  | "swap"
  | "set"
  | "select"
  | "insert"
  | "pivot"
  | "partition"
  | "merge"
  | "place"
  | "done";

export interface SortStep {
  array: number[];
  highlight: number[]; // indices being actively touched
  secondary?: number[]; // supporting indices (e.g. current min, boundary)
  sorted: number[]; // indices already in final position
  action: SortAction;
  what: string;
  question: string;
  decision: string;
  next: string;
  compareCount: number;
  swapCount: number;
  codeLine?: number;
}

const clone = (a: number[]) => a.slice();

// ---------------- Bubble Sort ----------------
export function bubbleSortSteps(input: number[]): SortStep[] {
  const a = clone(input);
  const steps: SortStep[] = [];
  const n = a.length;
  let comps = 0;
  let swaps = 0;
  const sorted: number[] = [];

  steps.push({
    array: clone(a),
    highlight: [],
    sorted: [],
    action: "compare",
    what: "We start with an unsorted list.",
    question: "Which pair should we look at first?",
    decision: "Begin at the very first two items.",
    next: "Compare them and decide if they should swap.",
    compareCount: 0,
    swapCount: 0,
  });

  for (let pass = 0; pass < n - 1; pass++) {
    let swappedThisPass = false;
    for (let i = 0; i < n - 1 - pass; i++) {
      comps++;
      const left = a[i];
      const right = a[i + 1];
      steps.push({
        array: clone(a),
        highlight: [i, i + 1],
        sorted: [...sorted],
        action: "compare",
        what: `We look at the two neighbours at position ${i} and ${i + 1}.`,
        question: `Is ${left} bigger than ${right}?`,
        decision: left > right ? "Yes — they are in the wrong order." : "No — they are already in order.",
        next: left > right ? "So they must swap places." : "Move on to the next pair.",
        compareCount: comps,
        swapCount: swaps,
        codeLine: 3,
      });
      if (left > right) {
        [a[i], a[i + 1]] = [a[i + 1], a[i]];
        swaps++;
        swappedThisPass = true;
        steps.push({
          array: clone(a),
          highlight: [i, i + 1],
          sorted: [...sorted],
          action: "swap",
          what: `We swap ${right} and ${left}.`,
          question: "Are they in the right order now?",
          decision: `Yes — ${right} now comes before ${left}.`,
          next: "Continue with the next pair.",
          compareCount: comps,
          swapCount: swaps,
          codeLine: 4,
        });
      }
    }
    sorted.unshift(n - 1 - pass);
    steps.push({
      array: clone(a),
      highlight: [],
      sorted: [...sorted],
      action: "done",
      what: `Pass ${pass + 1} finished.`,
      question: "Where is the biggest unsorted value now?",
      decision: `At position ${n - 1 - pass} — it has bubbled to its final spot.`,
      next: swappedThisPass ? "Start another pass on the remaining values." : "No swaps happened — the list is already sorted.",
      compareCount: comps,
      swapCount: swaps,
    });
    if (!swappedThisPass) break;
  }
  // mark remaining as sorted
  for (let i = 0; i < n; i++) if (!sorted.includes(i)) sorted.push(i);
  steps.push({
    array: clone(a),
    highlight: [],
    sorted: Array.from({ length: n }, (_, i) => i),
    action: "done",
    what: "Every value is now in its correct place.",
    question: "Are we done?",
    decision: "Yes — the list is sorted.",
    next: "Great work!",
    compareCount: comps,
    swapCount: swaps,
  });
  return steps;
}

// ---------------- Selection Sort ----------------
export function selectionSortSteps(input: number[]): SortStep[] {
  const a = clone(input);
  const steps: SortStep[] = [];
  const n = a.length;
  let comps = 0, swaps = 0;
  const sorted: number[] = [];

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    steps.push({
      array: clone(a),
      highlight: [i],
      secondary: [minIdx],
      sorted: [...sorted],
      action: "select",
      what: `We want to fill position ${i} with the smallest remaining value.`,
      question: "Which value is the smallest so far?",
      decision: `We start by guessing position ${i} (${a[i]}) is smallest.`,
      next: "Check every value after it.",
      compareCount: comps,
      swapCount: swaps,
    });
    for (let j = i + 1; j < n; j++) {
      comps++;
      steps.push({
        array: clone(a),
        highlight: [j],
        secondary: [minIdx, i],
        sorted: [...sorted],
        action: "compare",
        what: `Compare current smallest ${a[minIdx]} with ${a[j]}.`,
        question: `Is ${a[j]} smaller than ${a[minIdx]}?`,
        decision: a[j] < a[minIdx] ? "Yes — new smallest found." : "No — keep the current smallest.",
        next: "Continue searching.",
        compareCount: comps,
        swapCount: swaps,
      });
      if (a[j] < a[minIdx]) minIdx = j;
    }
    if (minIdx !== i) {
      [a[i], a[minIdx]] = [a[minIdx], a[i]];
      swaps++;
      steps.push({
        array: clone(a),
        highlight: [i, minIdx],
        sorted: [...sorted],
        action: "swap",
        what: `Move the smallest value to position ${i}.`,
        question: "Where does it belong?",
        decision: `At the front of the unsorted part.`,
        next: "Repeat for the next position.",
        compareCount: comps,
        swapCount: swaps,
      });
    }
    sorted.push(i);
  }
  sorted.push(n - 1);
  steps.push({
    array: clone(a),
    highlight: [],
    sorted: Array.from({ length: n }, (_, i) => i),
    action: "done",
    what: "All positions are filled with the correct value.",
    question: "Is the list sorted?",
    decision: "Yes.",
    next: "Done.",
    compareCount: comps,
    swapCount: swaps,
  });
  return steps;
}

// ---------------- Insertion Sort ----------------
export function insertionSortSteps(input: number[]): SortStep[] {
  const a = clone(input);
  const steps: SortStep[] = [];
  const n = a.length;
  let comps = 0, swaps = 0;
  const sorted = [0];

  for (let i = 1; i < n; i++) {
    const key = a[i];
    let j = i - 1;
    steps.push({
      array: clone(a),
      highlight: [i],
      sorted: [...sorted],
      action: "select",
      what: `Pick up the next card: ${key}.`,
      question: "Where does it belong in the sorted part on the left?",
      decision: "We'll slide it left until it fits.",
      next: "Compare with the card just to its left.",
      compareCount: comps,
      swapCount: swaps,
    });
    while (j >= 0 && a[j] > key) {
      comps++;
      steps.push({
        array: clone(a),
        highlight: [j, j + 1],
        sorted: [...sorted],
        action: "compare",
        what: `Compare ${a[j]} with our card ${key}.`,
        question: `Is ${a[j]} bigger than ${key}?`,
        decision: "Yes — shift it one step to the right to make room.",
        next: "Look at the next card on the left.",
        compareCount: comps,
        swapCount: swaps,
      });
      a[j + 1] = a[j];
      swaps++;
      j--;
    }
    if (j >= 0) comps++;
    a[j + 1] = key;
    sorted.push(i);
    steps.push({
      array: clone(a),
      highlight: [j + 1],
      sorted: [...sorted],
      action: "insert",
      what: `Place ${key} into position ${j + 1}.`,
      question: "Is the left part sorted now?",
      decision: "Yes — the sorted part is one card bigger.",
      next: "Pick up the next unsorted card.",
      compareCount: comps,
      swapCount: swaps,
    });
  }
  steps.push({
    array: clone(a),
    highlight: [],
    sorted: Array.from({ length: n }, (_, i) => i),
    action: "done",
    what: "Every card is in its correct place.",
    question: "Are we done?",
    decision: "Yes.",
    next: "Done.",
    compareCount: comps,
    swapCount: swaps,
  });
  return steps;
}

// ---------------- Merge Sort ----------------
export function mergeSortSteps(input: number[]): SortStep[] {
  const a = clone(input);
  const steps: SortStep[] = [];
  let comps = 0;
  const n = a.length;

  const explain = (extra: Partial<SortStep>) => {
    steps.push({
      array: clone(a),
      highlight: [],
      sorted: [],
      action: "merge",
      what: "",
      question: "",
      decision: "",
      next: "",
      compareCount: comps,
      swapCount: 0,
      ...extra,
    } as SortStep);
  };

  function mergeSort(l: number, r: number) {
    if (l >= r) return;
    const m = Math.floor((l + r) / 2);
    explain({
      highlight: Array.from({ length: r - l + 1 }, (_, k) => l + k),
      action: "partition",
      what: `Split the piece from position ${l} to ${r} in half.`,
      question: "Can we sort a smaller piece first?",
      decision: "Yes — split it and solve each half.",
      next: "Recursively split until each piece has one item.",
    });
    mergeSort(l, m);
    mergeSort(m + 1, r);
    // merge
    const merged: number[] = [];
    let i = l, j = m + 1;
    while (i <= m && j <= r) {
      comps++;
      explain({
        highlight: [i, j],
        secondary: Array.from({ length: r - l + 1 }, (_, k) => l + k),
        action: "compare",
        what: `Compare ${a[i]} (left half) with ${a[j]} (right half).`,
        question: `Which one is smaller?`,
        decision: a[i] <= a[j] ? `${a[i]} — take it from the left.` : `${a[j]} — take it from the right.`,
        next: "Add it to the merged result.",
      });
      if (a[i] <= a[j]) merged.push(a[i++]);
      else merged.push(a[j++]);
    }
    while (i <= m) merged.push(a[i++]);
    while (j <= r) merged.push(a[j++]);
    for (let k = 0; k < merged.length; k++) a[l + k] = merged[k];
    explain({
      highlight: Array.from({ length: r - l + 1 }, (_, k) => l + k),
      action: "merge",
      what: `Merged the two halves into a single sorted piece from ${l} to ${r}.`,
      question: "Is this piece sorted?",
      decision: "Yes.",
      next: r - l + 1 === n ? "The whole list is sorted." : "Move up to merge the next larger piece.",
    });
  }
  mergeSort(0, n - 1);
  steps.push({
    array: clone(a),
    highlight: [],
    sorted: Array.from({ length: n }, (_, i) => i),
    action: "done",
    what: "All pieces have been merged.",
    question: "Sorted?",
    decision: "Yes.",
    next: "Done.",
    compareCount: comps,
    swapCount: 0,
  });
  return steps;
}

// ---------------- Quick Sort ----------------
export function quickSortSteps(input: number[]): SortStep[] {
  const a = clone(input);
  const steps: SortStep[] = [];
  let comps = 0, swaps = 0;
  const n = a.length;

  function partition(l: number, r: number) {
    const pivot = a[r];
    steps.push({
      array: clone(a),
      highlight: [r],
      secondary: Array.from({ length: r - l + 1 }, (_, k) => l + k),
      sorted: [],
      action: "pivot",
      what: `Choose ${pivot} as the pivot (reference value).`,
      question: "Is every other value smaller or larger than the pivot?",
      decision: "Split them into two groups.",
      next: "Walk through the range and place small values on the left.",
      compareCount: comps,
      swapCount: swaps,
    });
    let i = l - 1;
    for (let j = l; j < r; j++) {
      comps++;
      steps.push({
        array: clone(a),
        highlight: [j],
        secondary: [r],
        sorted: [],
        action: "compare",
        what: `Compare ${a[j]} with pivot ${pivot}.`,
        question: `Is ${a[j]} ≤ ${pivot}?`,
        decision: a[j] <= pivot ? "Yes — belongs on the small side." : "No — leave it on the large side.",
        next: "Continue scanning.",
        compareCount: comps,
        swapCount: swaps,
      });
      if (a[j] <= pivot) {
        i++;
        if (i !== j) {
          [a[i], a[j]] = [a[j], a[i]];
          swaps++;
          steps.push({
            array: clone(a),
            highlight: [i, j],
            sorted: [],
            action: "swap",
            what: `Swap so that ${a[i]} is on the small side.`,
            question: "Is the small side still contiguous?",
            decision: "Yes.",
            next: "Keep scanning.",
            compareCount: comps,
            swapCount: swaps,
          });
        }
      }
    }
    [a[i + 1], a[r]] = [a[r], a[i + 1]];
    swaps++;
    steps.push({
      array: clone(a),
      highlight: [i + 1, r],
      sorted: [i + 1],
      action: "place",
      what: `Put the pivot into its final position (${i + 1}).`,
      question: "Is the pivot done?",
      decision: "Yes — everything left of it is smaller, right is larger.",
      next: "Repeat on each side.",
      compareCount: comps,
      swapCount: swaps,
    });
    return i + 1;
  }

  function qs(l: number, r: number) {
    if (l < r) {
      const p = partition(l, r);
      qs(l, p - 1);
      qs(p + 1, r);
    }
  }

  qs(0, n - 1);
  steps.push({
    array: clone(a),
    highlight: [],
    sorted: Array.from({ length: n }, (_, i) => i),
    action: "done",
    what: "All pivots have been placed.",
    question: "Sorted?",
    decision: "Yes.",
    next: "Done.",
    compareCount: comps,
    swapCount: swaps,
  });
  return steps;
}

// ---------------- Heap Sort (simplified narration) ----------------
export function heapSortSteps(input: number[]): SortStep[] {
  const a = clone(input);
  const n = a.length;
  const steps: SortStep[] = [];
  let comps = 0, swaps = 0;
  const sorted: number[] = [];

  function heapify(size: number, i: number) {
    let largest = i;
    const l = 2 * i + 1, r = 2 * i + 2;
    if (l < size) { comps++; if (a[l] > a[largest]) largest = l; }
    if (r < size) { comps++; if (a[r] > a[largest]) largest = r; }
    if (largest !== i) {
      [a[i], a[largest]] = [a[largest], a[i]];
      swaps++;
      steps.push({
        array: clone(a),
        highlight: [i, largest],
        sorted: [...sorted],
        action: "swap",
        what: `Bubble the larger child up so the biggest value stays at the top.`,
        question: "Is the parent bigger than both children?",
        decision: "Not yet — swap and check again.",
        next: "Continue heapifying.",
        compareCount: comps,
        swapCount: swaps,
      });
      heapify(size, largest);
    }
  }

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(n, i);
  steps.unshift({
    array: clone(input),
    highlight: [],
    sorted: [],
    action: "select",
    what: "Arrange the list as a binary heap so the biggest value is at the top.",
    question: "Where is the largest value?",
    decision: "At index 0.",
    next: "Swap it to the end, then rebuild the heap on the smaller part.",
    compareCount: 0,
    swapCount: 0,
  });

  for (let i = n - 1; i > 0; i--) {
    [a[0], a[i]] = [a[i], a[0]];
    swaps++;
    sorted.unshift(i);
    steps.push({
      array: clone(a),
      highlight: [0, i],
      sorted: [...sorted],
      action: "place",
      what: `Move the biggest value to position ${i}.`,
      question: "Is that position final?",
      decision: "Yes.",
      next: "Rebuild the heap on the remaining part.",
      compareCount: comps,
      swapCount: swaps,
    });
    heapify(i, 0);
  }
  sorted.unshift(0);
  steps.push({
    array: clone(a),
    highlight: [],
    sorted: Array.from({ length: n }, (_, i) => i),
    action: "done",
    what: "All items placed.",
    question: "Sorted?",
    decision: "Yes.",
    next: "Done.",
    compareCount: comps,
    swapCount: swaps,
  });
  return steps;
}

// ---------------- Counting Sort ----------------
export function countingSortSteps(input: number[]): SortStep[] {
  const a = clone(input);
  const n = a.length;
  const steps: SortStep[] = [];
  const max = Math.max(...a);
  const count = new Array(max + 1).fill(0);

  for (let i = 0; i < n; i++) {
    count[a[i]]++;
    steps.push({
      array: clone(a),
      highlight: [i],
      sorted: [],
      action: "compare",
      what: `Count the value ${a[i]}.`,
      question: `How many times has ${a[i]} appeared so far?`,
      decision: `${count[a[i]]} time(s).`,
      next: "Continue counting every value.",
      compareCount: i + 1,
      swapCount: 0,
    });
  }
  const out: number[] = [];
  for (let v = 0; v <= max; v++) {
    for (let k = 0; k < count[v]; k++) out.push(v);
  }
  for (let i = 0; i < n; i++) a[i] = out[i];
  steps.push({
    array: clone(a),
    highlight: [],
    sorted: Array.from({ length: n }, (_, i) => i),
    action: "done",
    what: "Rebuild the array using the counts, smallest value first.",
    question: "Sorted?",
    decision: "Yes.",
    next: "Done.",
    compareCount: n,
    swapCount: 0,
  });
  return steps;
}

// ---------------- Radix Sort ----------------
export function radixSortSteps(input: number[]): SortStep[] {
  const a = clone(input);
  const n = a.length;
  const steps: SortStep[] = [];
  const max = Math.max(...a);
  let exp = 1;
  let round = 1;

  while (Math.floor(max / exp) > 0) {
    const buckets: number[][] = Array.from({ length: 10 }, () => []);
    for (const v of a) buckets[Math.floor(v / exp) % 10].push(v);
    let idx = 0;
    for (const b of buckets) for (const v of b) a[idx++] = v;
    steps.push({
      array: clone(a),
      highlight: [],
      sorted: [],
      action: "partition",
      what: `Round ${round}: sort by the ${round === 1 ? "ones" : round === 2 ? "tens" : "next"} digit.`,
      question: "Where does each number go?",
      decision: "Into a bucket 0–9 based on that digit, then read them back.",
      next: "Move to the next larger digit.",
      compareCount: 0,
      swapCount: 0,
    });
    exp *= 10;
    round++;
  }
  steps.push({
    array: clone(a),
    highlight: [],
    sorted: Array.from({ length: n }, (_, i) => i),
    action: "done",
    what: "All digit rounds finished.",
    question: "Sorted?",
    decision: "Yes.",
    next: "Done.",
    compareCount: 0,
    swapCount: 0,
  });
  return steps;
}

// ---------------- Bucket Sort ----------------
export function bucketSortSteps(input: number[]): SortStep[] {
  const a = clone(input);
  const n = a.length;
  const steps: SortStep[] = [];
  const max = Math.max(...a);
  const bucketCount = Math.min(5, n);
  const size = Math.ceil((max + 1) / bucketCount);
  const buckets: number[][] = Array.from({ length: bucketCount }, () => []);
  for (const v of a) buckets[Math.min(bucketCount - 1, Math.floor(v / size))].push(v);
  steps.push({
    array: clone(a),
    highlight: [],
    sorted: [],
    action: "partition",
    what: `Group values into ${bucketCount} buckets by range.`,
    question: "Which bucket does each value go into?",
    decision: "Based on its value range.",
    next: "Sort each bucket, then join them.",
    compareCount: 0,
    swapCount: 0,
  });
  buckets.forEach((b) => b.sort((x, y) => x - y));
  let idx = 0;
  for (const b of buckets) for (const v of b) a[idx++] = v;
  steps.push({
    array: clone(a),
    highlight: [],
    sorted: Array.from({ length: n }, (_, i) => i),
    action: "done",
    what: "Buckets sorted and joined.",
    question: "Sorted?",
    decision: "Yes.",
    next: "Done.",
    compareCount: 0,
    swapCount: 0,
  });
  return steps;
}

export const SORT_ENGINES: Record<string, (input: number[]) => SortStep[]> = {
  "bubble-sort": bubbleSortSteps,
  "selection-sort": selectionSortSteps,
  "insertion-sort": insertionSortSteps,
  "merge-sort": mergeSortSteps,
  "quick-sort": quickSortSteps,
  "heap-sort": heapSortSteps,
  "counting-sort": countingSortSteps,
  "radix-sort": radixSortSteps,
  "bucket-sort": bucketSortSteps,
};
