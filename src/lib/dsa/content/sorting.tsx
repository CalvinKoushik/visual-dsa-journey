import type { LessonContent } from "@/components/lesson/LessonLayout";
import { SortVisualizer } from "@/components/viz/SortVisualizer";

const viz = (slug: string, arr: number[]) => (
  <SortVisualizer slug={slug} defaultInput={arr} />
);

const ORDER = [
  "bubble-sort", "selection-sort", "insertion-sort",
  "merge-sort", "quick-sort", "heap-sort",
  "counting-sort", "radix-sort", "bucket-sort",
];

const nav = (slug: string) => {
  const i = ORDER.indexOf(slug);
  return {
    prev: i > 0 ? { to: `/sorting/${ORDER[i - 1]}`, label: title(ORDER[i - 1]) } : { to: "/sorting", label: "All sorting algorithms" },
    next: i < ORDER.length - 1 ? { to: `/sorting/${ORDER[i + 1]}`, label: title(ORDER[i + 1]) } : { to: "/recursion", label: "On to Recursion →" },
  };
};

function title(slug: string) {
  return slug.split("-").map((s) => s[0].toUpperCase() + s.slice(1)).join(" ");
}

export const SORTING_LESSONS: Record<string, LessonContent> = {
  "bubble-sort": {
    slug: "bubble-sort",
    category: "sorting",
    name: "Bubble Sort",
    tagline: "Compare two neighbours. Swap if they're in the wrong order. Repeat.",
    emoji: "🫧",
    difficulty: "Beginner",
    imagine: (
      <>
        <p>Five students line up: <b>5, 3, 8, 4, 2</b>. They need to stand from shortest to tallest.</p>
        <p className="mt-3">But there's one rule: <i>you can only compare two students standing next to each other</i>.</p>
        <p className="mt-3">So we walk down the line, compare each pair, and swap when the taller one is on the left. After one full walk, the tallest student has floated all the way to the end — like a bubble rising in water. That's why it's called <b>Bubble Sort</b>.</p>
      </>
    ),
    whatIsHappening: (
      <p>Bubble Sort makes multiple passes through the list. Each pass compares every adjacent pair and swaps the ones out of order. After each pass, the largest remaining value ends up at the correct position on the right. The list is fully sorted when a pass completes with zero swaps.</p>
    ),
    steps: [
      "Start at the beginning of the list.",
      "Compare the two neighbours at positions i and i+1.",
      "If the left one is bigger, swap them.",
      "Move one step right and repeat until the end of the unsorted part.",
      "After each pass, the biggest unsorted value has bubbled to the end.",
      "Repeat until a full pass makes zero swaps — the list is sorted.",
    ],
    howComputerDoesIt:
      "The computer stores the list in an array and uses two nested loops. The outer loop counts passes; the inner loop walks through adjacent pairs. Each comparison is a simple 'is a[i] > a[i+1]?' check; a swap is three assignments using a temporary variable.",
    pseudocode: `procedure bubbleSort(A):
  n = length(A)
  repeat
    swapped = false
    for i from 0 to n - 2:
      if A[i] > A[i + 1]:
        swap A[i] and A[i + 1]
        swapped = true
    n = n - 1
  until not swapped`,
    java: `public static void bubbleSort(int[] a) {
    int n = a.length;
    boolean swapped;
    do {
        swapped = false;
        for (int i = 0; i < n - 1; i++) {
            if (a[i] > a[i + 1]) {
                int tmp = a[i];
                a[i] = a[i + 1];
                a[i + 1] = tmp;
                swapped = true;
            }
        }
        n--;
    } while (swapped);
}`,
    python: `def bubble_sort(a):
    n = len(a)
    while True:
        swapped = False
        for i in range(n - 1):
            if a[i] > a[i + 1]:
                a[i], a[i + 1] = a[i + 1], a[i]
                swapped = True
        n -= 1
        if not swapped:
            break
    return a`,
    timeComplexity: [
      { case: "Best", value: "O(n)", explain: "Already sorted — one pass, zero swaps, done." },
      { case: "Average", value: "O(n²)", explain: "For 10 items ≈ 100 operations. For 100 items ≈ 10 000. Work grows very fast." },
      { case: "Worst", value: "O(n²)", explain: "Reverse-sorted list — every pair swaps on every pass." },
    ],
    spaceComplexity: "O(1) — only a single temporary variable is needed for swaps.",
    realWorld: [
      { title: "Teaching sorting", body: "Its simplicity makes it the most common way to explain what sorting even means." },
      { title: "Tiny datasets", body: "For 5 or 6 items, its overhead is lower than fancier algorithms." },
      { title: "Nearly-sorted data detection", body: "The early exit when no swaps happen makes it fast when data is already almost sorted." },
    ],
    quiz: [
      {
        q: "After one full pass of Bubble Sort, which value is guaranteed to be in its final place?",
        options: ["The smallest value at the front", "The largest value at the end", "The middle value", "None — passes don't finalise anything"],
        answer: 1,
        why: "Each pass repeatedly swaps larger values to the right, so the biggest one bubbles all the way to the end of the unsorted section.",
      },
      {
        q: "Bubble Sort's early exit optimisation checks…",
        options: ["Whether the array is a power of two", "Whether a pass performed any swaps", "The value at index 0", "The recursion depth"],
        answer: 1,
        why: "If a pass makes zero swaps, no adjacent pair was out of order — the whole list must already be sorted.",
      },
    ],
    visualizer: viz("bubble-sort", [5, 3, 8, 4, 2]),
    ...nav("bubble-sort"),
  },

  "selection-sort": {
    slug: "selection-sort",
    category: "sorting",
    name: "Selection Sort",
    tagline: "Find the smallest. Put it in front. Repeat.",
    emoji: "🔍",
    difficulty: "Beginner",
    imagine: (
      <>
        <p>Imagine you're picking a team from a group of students, and you want the shortest one first, then the next shortest, and so on.</p>
        <p className="mt-3">You scan the whole group, point to the shortest person, and ask them to stand at the front. Then you scan the remaining students and pick the next shortest. And so on.</p>
        <p className="mt-3">This is Selection Sort — you <b>select</b> the smallest each time.</p>
      </>
    ),
    whatIsHappening: (
      <p>The list is split into a sorted section on the left (growing) and an unsorted section on the right (shrinking). On each round we scan the unsorted section to find its minimum, then swap it into the first unsorted spot.</p>
    ),
    steps: [
      "Assume the first item of the unsorted section is the smallest so far.",
      "Scan the rest of the unsorted section, updating 'smallest so far' whenever a smaller value appears.",
      "Swap that smallest value into the first unsorted position.",
      "Move the boundary one step right — the sorted section just grew by one.",
      "Repeat until only one item is left; it's already the biggest.",
    ],
    howComputerDoesIt:
      "Two nested loops. The outer loop places one value per round. The inner loop scans for the minimum by tracking a 'minIndex'. Only one swap per outer iteration, so far fewer swaps than Bubble Sort.",
    pseudocode: `procedure selectionSort(A):
  n = length(A)
  for i from 0 to n - 2:
    minIndex = i
    for j from i + 1 to n - 1:
      if A[j] < A[minIndex]:
        minIndex = j
    swap A[i] and A[minIndex]`,
    java: `public static void selectionSort(int[] a) {
    for (int i = 0; i < a.length - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < a.length; j++) {
            if (a[j] < a[minIdx]) minIdx = j;
        }
        int tmp = a[i]; a[i] = a[minIdx]; a[minIdx] = tmp;
    }
}`,
    python: `def selection_sort(a):
    for i in range(len(a) - 1):
        min_idx = i
        for j in range(i + 1, len(a)):
            if a[j] < a[min_idx]:
                min_idx = j
        a[i], a[min_idx] = a[min_idx], a[i]
    return a`,
    timeComplexity: [
      { case: "Best", value: "O(n²)", explain: "Even a sorted list is fully scanned every round." },
      { case: "Average", value: "O(n²)", explain: "Comparisons always happen; swaps are minimal." },
      { case: "Worst", value: "O(n²)", explain: "Same as average — comparisons dominate the cost." },
    ],
    spaceComplexity: "O(1) — sorts in place.",
    realWorld: [
      { title: "Small tournaments", body: "Picking the best player, then the second best, then the third." },
      { title: "Memory-constrained systems", body: "Uses minimum writes, useful when writes are expensive (e.g., some flash memory)." },
    ],
    quiz: [
      {
        q: "How many swaps does Selection Sort perform on n items?",
        options: ["Exactly n", "At most n", "n²", "n log n"],
        answer: 1,
        why: "One swap per outer iteration means at most n − 1 swaps total, regardless of input.",
      },
    ],
    visualizer: viz("selection-sort", [5, 3, 8, 4, 2]),
    ...nav("selection-sort"),
  },

  "insertion-sort": {
    slug: "insertion-sort",
    category: "sorting",
    name: "Insertion Sort",
    tagline: "Pick up one card at a time. Slide it into the right place.",
    emoji: "🃏",
    difficulty: "Beginner",
    imagine: (
      <>
        <p>You're dealt playing cards one at a time. Each new card you get, you slide it into the correct place in your hand so your hand always stays sorted.</p>
        <p className="mt-3">That's Insertion Sort — you build a sorted section from left to right by <b>inserting</b> each new value into its correct spot.</p>
      </>
    ),
    whatIsHappening: (
      <p>The first item is trivially sorted. For each next item, we compare it backwards through the sorted section, shifting bigger items one spot to the right to make room, then place the item in the gap.</p>
    ),
    steps: [
      "Treat position 0 as the sorted section.",
      "Pick up the item at position i.",
      "Walk left through the sorted section, shifting bigger items one step right.",
      "When you find a smaller (or equal) item, drop the picked item just to its right.",
      "Move to the next item and repeat.",
    ],
    howComputerDoesIt:
      "An outer loop walks through positions 1 to n-1. An inner while-loop shifts values right until the correct slot appears. It's very cache-friendly and extremely fast on almost-sorted arrays.",
    pseudocode: `procedure insertionSort(A):
  for i from 1 to n - 1:
    key = A[i]
    j = i - 1
    while j >= 0 and A[j] > key:
      A[j + 1] = A[j]
      j = j - 1
    A[j + 1] = key`,
    java: `public static void insertionSort(int[] a) {
    for (int i = 1; i < a.length; i++) {
        int key = a[i];
        int j = i - 1;
        while (j >= 0 && a[j] > key) {
            a[j + 1] = a[j];
            j--;
        }
        a[j + 1] = key;
    }
}`,
    python: `def insertion_sort(a):
    for i in range(1, len(a)):
        key = a[i]
        j = i - 1
        while j >= 0 and a[j] > key:
            a[j + 1] = a[j]
            j -= 1
        a[j + 1] = key
    return a`,
    timeComplexity: [
      { case: "Best", value: "O(n)", explain: "Sorted input — every 'while' exits immediately." },
      { case: "Average", value: "O(n²)", explain: "On average each new card shifts halfway back." },
      { case: "Worst", value: "O(n²)", explain: "Reverse-sorted input — every card shifts all the way back." },
    ],
    spaceComplexity: "O(1) — in-place.",
    realWorld: [
      { title: "Online sorting", body: "Ideal when data arrives one at a time (like real playing cards, or streaming input)." },
      { title: "Hybrid sort algorithms", body: "Java's Timsort and many others switch to insertion sort for tiny sub-arrays." },
    ],
    quiz: [
      {
        q: "What input makes Insertion Sort fastest?",
        options: ["Reverse sorted", "Random", "Already (or almost) sorted", "All identical values"],
        answer: 2,
        why: "The inner shift loop exits at the first comparison, giving linear time.",
      },
    ],
    visualizer: viz("insertion-sort", [5, 3, 8, 4, 2]),
    ...nav("insertion-sort"),
  },

  "merge-sort": {
    slug: "merge-sort",
    category: "sorting",
    name: "Merge Sort",
    tagline: "Split it in half. Sort each half. Merge them together.",
    emoji: "🧩",
    difficulty: "Intermediate",
    imagine: (
      <>
        <p>Imagine a stack of 100 exam papers to sort by roll number. Alone it's overwhelming. But split it in two, hand each half to a friend, and now it's easier.</p>
        <p className="mt-3">Each friend does the same — split, hand off — until every pile has just one paper (already sorted!). Then start <b>merging</b> the piles two at a time, taking the smaller top card each time.</p>
      </>
    ),
    whatIsHappening: (
      <p>Merge Sort is a <b>divide and conquer</b> algorithm. Divide the array into two halves recursively until each has one element, then merge sorted halves back together. Merging two sorted halves takes linear time; there are log₂(n) levels of splitting.</p>
    ),
    steps: [
      "If the section has 0 or 1 items, it's already sorted — return.",
      "Otherwise split it into left and right halves.",
      "Recursively merge-sort the left half.",
      "Recursively merge-sort the right half.",
      "Merge the two sorted halves by repeatedly taking the smaller front element.",
    ],
    howComputerDoesIt:
      "Recursion drives the split. A helper 'merge' function walks two pointers through the halves, copying the smaller value into a temporary array. Because it always splits in half, the recursion tree has depth log₂(n).",
    pseudocode: `procedure mergeSort(A, l, r):
  if l >= r: return
  m = (l + r) / 2
  mergeSort(A, l, m)
  mergeSort(A, m + 1, r)
  merge(A, l, m, r)

procedure merge(A, l, m, r):
  copy A[l..m] into L, A[m+1..r] into R
  i = 0, j = 0, k = l
  while i < len(L) and j < len(R):
    if L[i] <= R[j]: A[k++] = L[i++]
    else:            A[k++] = R[j++]
  copy leftover L and R into A`,
    java: `public static void mergeSort(int[] a, int l, int r) {
    if (l >= r) return;
    int m = (l + r) / 2;
    mergeSort(a, l, m);
    mergeSort(a, m + 1, r);
    merge(a, l, m, r);
}
static void merge(int[] a, int l, int m, int r) {
    int[] tmp = new int[r - l + 1];
    int i = l, j = m + 1, k = 0;
    while (i <= m && j <= r) tmp[k++] = (a[i] <= a[j]) ? a[i++] : a[j++];
    while (i <= m) tmp[k++] = a[i++];
    while (j <= r) tmp[k++] = a[j++];
    for (int p = 0; p < tmp.length; p++) a[l + p] = tmp[p];
}`,
    python: `def merge_sort(a):
    if len(a) <= 1:
        return a
    m = len(a) // 2
    left = merge_sort(a[:m])
    right = merge_sort(a[m:])
    out, i, j = [], 0, 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            out.append(left[i]); i += 1
        else:
            out.append(right[j]); j += 1
    out.extend(left[i:]); out.extend(right[j:])
    return out`,
    timeComplexity: [
      { case: "Best", value: "O(n log n)", explain: "Always splits in half regardless of input." },
      { case: "Average", value: "O(n log n)", explain: "For 1 000 items ≈ 10 000 operations — much faster than n²." },
      { case: "Worst", value: "O(n log n)", explain: "No worst case blow-up — this is Merge Sort's superpower." },
    ],
    spaceComplexity: "O(n) — needs a temporary array during merging.",
    realWorld: [
      { title: "Sorting huge files", body: "External merge sort handles data too big to fit in memory by merging chunks from disk." },
      { title: "Stable sort requirement", body: "Preserves the order of equal keys — essential for multi-column sorts." },
    ],
    quiz: [
      {
        q: "Why is Merge Sort so consistent?",
        options: ["It shuffles the input first", "It always splits into equal halves", "It uses a hash table", "It sorts backwards"],
        answer: 1,
        why: "The split is always in the middle, so the recursion depth is always log₂(n) regardless of input.",
      },
    ],
    visualizer: viz("merge-sort", [5, 3, 8, 4, 2, 7]),
    ...nav("merge-sort"),
  },

  "quick-sort": {
    slug: "quick-sort",
    category: "sorting",
    name: "Quick Sort",
    tagline: "Pick a pivot. Split values around it. Repeat.",
    emoji: "⚡",
    difficulty: "Intermediate",
    imagine: (
      <>
        <p>A teacher picks one student as a reference height. Every other student steps to the left if shorter, right if taller.</p>
        <p className="mt-3">The reference student is now in the correct final position. Repeat the same trick on the left group and the right group.</p>
      </>
    ),
    whatIsHappening: (
      <p>Quick Sort is another divide and conquer method, but instead of splitting in the middle it splits around a chosen <b>pivot</b>. Values smaller than the pivot go left, larger go right, and the pivot lands in its final spot. Then each side is quick-sorted recursively.</p>
    ),
    steps: [
      "Pick a pivot value (a common choice: the last item).",
      "Walk through the section, swapping smaller values to the left side.",
      "Place the pivot in the gap between the small and large sides — that's its final position.",
      "Recursively Quick Sort the small side.",
      "Recursively Quick Sort the large side.",
    ],
    howComputerDoesIt:
      "The core is the 'partition' function: it maintains a boundary index i that grows every time it finds a value ≤ pivot, swapping it into the small side. After the walk, the pivot is swapped into position i+1.",
    pseudocode: `procedure quickSort(A, l, r):
  if l < r:
    p = partition(A, l, r)
    quickSort(A, l, p - 1)
    quickSort(A, p + 1, r)

procedure partition(A, l, r):
  pivot = A[r]
  i = l - 1
  for j from l to r - 1:
    if A[j] <= pivot:
      i = i + 1
      swap A[i] and A[j]
  swap A[i + 1] and A[r]
  return i + 1`,
    java: `public static void quickSort(int[] a, int l, int r) {
    if (l < r) {
        int p = partition(a, l, r);
        quickSort(a, l, p - 1);
        quickSort(a, p + 1, r);
    }
}
static int partition(int[] a, int l, int r) {
    int pivot = a[r], i = l - 1;
    for (int j = l; j < r; j++) {
        if (a[j] <= pivot) {
            i++;
            int t = a[i]; a[i] = a[j]; a[j] = t;
        }
    }
    int t = a[i + 1]; a[i + 1] = a[r]; a[r] = t;
    return i + 1;
}`,
    python: `def quick_sort(a, l=0, r=None):
    if r is None: r = len(a) - 1
    if l < r:
        p = partition(a, l, r)
        quick_sort(a, l, p - 1)
        quick_sort(a, p + 1, r)
    return a

def partition(a, l, r):
    pivot = a[r]; i = l - 1
    for j in range(l, r):
        if a[j] <= pivot:
            i += 1
            a[i], a[j] = a[j], a[i]
    a[i + 1], a[r] = a[r], a[i + 1]
    return i + 1`,
    timeComplexity: [
      { case: "Best", value: "O(n log n)", explain: "Pivot is a great divider — halves stay balanced." },
      { case: "Average", value: "O(n log n)", explain: "Usually very fast, small constants." },
      { case: "Worst", value: "O(n²)", explain: "Bad pivot choice (already sorted + last-element pivot) makes it degenerate." },
    ],
    spaceComplexity: "O(log n) recursion depth on average.",
    realWorld: [
      { title: "Standard library sorts", body: "Many language runtimes use Quick Sort variants — extremely fast on real-world data." },
      { title: "Databases", body: "Query engines use partition-based sorting for GROUP BY / ORDER BY operations." },
    ],
    quiz: [
      {
        q: "After a partition step, where is the pivot?",
        options: ["At position 0", "At the end", "In its final sorted position", "It's discarded"],
        answer: 2,
        why: "Everything smaller than the pivot is on its left, everything larger on its right — so it's exactly where it belongs.",
      },
    ],
    visualizer: viz("quick-sort", [5, 3, 8, 4, 2, 7]),
    ...nav("quick-sort"),
  },

  "heap-sort": {
    slug: "heap-sort",
    category: "sorting",
    name: "Heap Sort",
    tagline: "Build a 'biggest on top' tree. Peel the top off, again and again.",
    emoji: "🏔️",
    difficulty: "Intermediate",
    imagine: (
      <>
        <p>Line the students up as a tournament tree where a parent is always taller than their children. The tallest ends up at the very top.</p>
        <p className="mt-3">Send the top student to the end of the line, then re-arrange the tree so the new tallest is at the top. Repeat.</p>
      </>
    ),
    whatIsHappening: (
      <p>A <b>max-heap</b> is a binary tree stored in an array where every parent is ≥ its children. Heap Sort first builds a max-heap, then repeatedly swaps the top element (biggest) with the last element of the heap, shrinks the heap by one, and re-heapifies.</p>
    ),
    steps: [
      "Turn the array into a max-heap (this takes O(n)).",
      "Swap the top of the heap (biggest value) with the last element.",
      "Shrink the heap by one — that last position is now sorted.",
      "Re-heapify the top to restore the max-heap property.",
      "Repeat until the heap has one element.",
    ],
    howComputerDoesIt:
      "The tree is stored in an array: node i's children are at 2i+1 and 2i+2. 'Heapify(i, size)' compares node i with its children and swaps down until the max-heap rule holds.",
    pseudocode: `procedure heapSort(A):
  n = length(A)
  for i from n/2 - 1 down to 0:
    heapify(A, n, i)
  for i from n - 1 down to 1:
    swap A[0] and A[i]
    heapify(A, i, 0)

procedure heapify(A, size, i):
  largest = i
  l = 2*i + 1; r = 2*i + 2
  if l < size and A[l] > A[largest]: largest = l
  if r < size and A[r] > A[largest]: largest = r
  if largest != i:
    swap A[i] and A[largest]
    heapify(A, size, largest)`,
    java: `public static void heapSort(int[] a) {
    int n = a.length;
    for (int i = n / 2 - 1; i >= 0; i--) heapify(a, n, i);
    for (int i = n - 1; i > 0; i--) {
        int t = a[0]; a[0] = a[i]; a[i] = t;
        heapify(a, i, 0);
    }
}
static void heapify(int[] a, int size, int i) {
    int largest = i, l = 2 * i + 1, r = 2 * i + 2;
    if (l < size && a[l] > a[largest]) largest = l;
    if (r < size && a[r] > a[largest]) largest = r;
    if (largest != i) {
        int t = a[i]; a[i] = a[largest]; a[largest] = t;
        heapify(a, size, largest);
    }
}`,
    python: `def heap_sort(a):
    n = len(a)
    for i in range(n // 2 - 1, -1, -1):
        heapify(a, n, i)
    for i in range(n - 1, 0, -1):
        a[0], a[i] = a[i], a[0]
        heapify(a, i, 0)
    return a

def heapify(a, size, i):
    largest = i; l = 2*i + 1; r = 2*i + 2
    if l < size and a[l] > a[largest]: largest = l
    if r < size and a[r] > a[largest]: largest = r
    if largest != i:
        a[i], a[largest] = a[largest], a[i]
        heapify(a, size, largest)`,
    timeComplexity: [
      { case: "Best", value: "O(n log n)", explain: "Heapify is log n; performed n times." },
      { case: "Average", value: "O(n log n)", explain: "Consistent — no dependence on input pattern." },
      { case: "Worst", value: "O(n log n)", explain: "Same as best/average — Heap Sort has no bad inputs." },
    ],
    spaceComplexity: "O(1) — in-place.",
    realWorld: [
      { title: "Priority queues", body: "The heap data structure powers task schedulers, event simulators and Dijkstra's algorithm." },
      { title: "Guaranteed n log n in-place sort", body: "When both consistency and memory matter, Heap Sort is the go-to choice." },
    ],
    quiz: [
      {
        q: "In a max-heap stored in an array, where is the biggest value?",
        options: ["At the last index", "At index 0", "At index n/2", "Anywhere"],
        answer: 1,
        why: "The root of the max-heap is at index 0 by construction, and it is always the largest value.",
      },
    ],
    visualizer: viz("heap-sort", [4, 10, 3, 5, 1, 8]),
    ...nav("heap-sort"),
  },

  "counting-sort": {
    slug: "counting-sort",
    category: "sorting",
    name: "Counting Sort",
    tagline: "Don't compare — just count how many of each value.",
    emoji: "🗳️",
    difficulty: "Advanced",
    imagine: (
      <>
        <p>You're counting votes for candidates numbered 0 to 9. You don't compare votes to each other — you just tally how many times each candidate appears.</p>
        <p className="mt-3">Then you write out the sorted list: all 0s, then all 1s, then all 2s, and so on.</p>
      </>
    ),
    whatIsHappening: (
      <p>Counting Sort skips comparisons entirely. It builds a count array where index v holds how many times value v appears in the input. Then it rebuilds the sorted output by walking the count array in order.</p>
    ),
    steps: [
      "Find the maximum value in the input.",
      "Create a count array of size max + 1, initially all zeros.",
      "For each input value v, add 1 to count[v].",
      "Walk the count array from 0 upward, writing v out count[v] times.",
    ],
    howComputerDoesIt:
      "Two linear passes over the input and one over the count array. Because there are no comparisons, it beats O(n log n) — but it only works when values are non-negative integers in a bounded range.",
    pseudocode: `procedure countingSort(A):
  max = maximum(A)
  count = array of zeros with size (max + 1)
  for v in A: count[v] = count[v] + 1
  out = []
  for v from 0 to max:
    repeat count[v] times: append v to out
  return out`,
    java: `public static int[] countingSort(int[] a) {
    int max = 0; for (int v : a) if (v > max) max = v;
    int[] count = new int[max + 1];
    for (int v : a) count[v]++;
    int[] out = new int[a.length];
    int k = 0;
    for (int v = 0; v <= max; v++)
        for (int j = 0; j < count[v]; j++) out[k++] = v;
    return out;
}`,
    python: `def counting_sort(a):
    m = max(a)
    count = [0] * (m + 1)
    for v in a: count[v] += 1
    out = []
    for v, c in enumerate(count):
        out.extend([v] * c)
    return out`,
    timeComplexity: [
      { case: "Best", value: "O(n + k)", explain: "n input items, k = max value. Both are walked once." },
      { case: "Average", value: "O(n + k)", explain: "Comparison-free — no dependence on order." },
      { case: "Worst", value: "O(n + k)", explain: "Same as best. Only bad if k is huge relative to n." },
    ],
    spaceComplexity: "O(n + k) for the count and output arrays.",
    realWorld: [
      { title: "Age or score sorting", body: "Perfect for values in a small known range like 0–100." },
      { title: "Radix Sort building block", body: "Counting Sort is the stable sort used inside each digit pass of Radix Sort." },
    ],
    quiz: [
      {
        q: "Counting Sort is not a good choice when…",
        options: ["Values are integers", "The range of values is huge", "The array is short", "The array is already sorted"],
        answer: 1,
        why: "The count array's size depends on the maximum value; if the range is enormous the memory cost explodes.",
      },
    ],
    visualizer: viz("counting-sort", [4, 2, 2, 8, 3, 3, 1]),
    ...nav("counting-sort"),
  },

  "radix-sort": {
    slug: "radix-sort",
    category: "sorting",
    name: "Radix Sort",
    tagline: "Sort by one digit at a time, starting with the ones place.",
    emoji: "🔢",
    difficulty: "Advanced",
    imagine: (
      <>
        <p>Sorting a pile of postal codes. Sort them first by the ones digit into ten piles. Stack them back up. Then sort by the tens digit. Then hundreds. After the last digit, the whole pile is sorted.</p>
      </>
    ),
    whatIsHappening: (
      <p>Radix Sort processes each digit position from least significant to most significant, using a stable sort (usually Counting Sort) for each digit. Because the inner sort is stable, earlier orderings are preserved for equal digits.</p>
    ),
    steps: [
      "Find the largest number to know how many digits to process.",
      "For each digit position (ones, tens, hundreds…):",
      "Group values into ten buckets (0–9) based on that digit.",
      "Read the buckets back into the array in order.",
      "After the top digit is processed, the array is fully sorted.",
    ],
    howComputerDoesIt:
      "It uses (value / exp) % 10 to extract the current digit, where exp cycles through 1, 10, 100, … Counting Sort places values into digit buckets, then reads them back.",
    pseudocode: `procedure radixSort(A):
  max = maximum(A)
  exp = 1
  while max / exp > 0:
    countingSortByDigit(A, exp)
    exp = exp * 10`,
    java: `public static void radixSort(int[] a) {
    int max = 0; for (int v : a) if (v > max) max = v;
    for (int exp = 1; max / exp > 0; exp *= 10) {
        int[] out = new int[a.length];
        int[] cnt = new int[10];
        for (int v : a) cnt[(v / exp) % 10]++;
        for (int i = 1; i < 10; i++) cnt[i] += cnt[i - 1];
        for (int i = a.length - 1; i >= 0; i--) {
            int d = (a[i] / exp) % 10;
            out[--cnt[d]] = a[i];
        }
        System.arraycopy(out, 0, a, 0, a.length);
    }
}`,
    python: `def radix_sort(a):
    if not a: return a
    exp = 1
    m = max(a)
    while m // exp > 0:
        buckets = [[] for _ in range(10)]
        for v in a: buckets[(v // exp) % 10].append(v)
        a = [v for b in buckets for v in b]
        exp *= 10
    return a`,
    timeComplexity: [
      { case: "Best", value: "O(nk)", explain: "k = number of digits. For 32-bit ints k is small and fixed." },
      { case: "Average", value: "O(nk)", explain: "Linear in n when k is bounded." },
      { case: "Worst", value: "O(nk)", explain: "Doesn't depend on order — only on digit count." },
    ],
    spaceComplexity: "O(n + b) where b is the base (usually 10).",
    realWorld: [
      { title: "Sorting IP addresses / IDs", body: "Fixed-width keys make Radix Sort extremely fast." },
      { title: "GPU sorting", body: "The digit-based structure is highly parallelizable." },
    ],
    quiz: [
      {
        q: "Why must the inner digit sort be stable?",
        options: ["To avoid infinite loops", "To preserve the ordering from previous digit passes", "To handle negative numbers", "Speed"],
        answer: 1,
        why: "If equal digits weren't kept in order, the work done on smaller digits would be lost.",
      },
    ],
    visualizer: viz("radix-sort", [170, 45, 75, 90, 802, 24, 2, 66]),
    ...nav("radix-sort"),
  },

  "bucket-sort": {
    slug: "bucket-sort",
    category: "sorting",
    name: "Bucket Sort",
    tagline: "Group values by range, sort each bucket, join them.",
    emoji: "🪣",
    difficulty: "Advanced",
    imagine: (
      <>
        <p>Separate students into classrooms by score range: 0–25, 26–50, 51–75, 76–100. Sort each classroom alphabetically. Merge classrooms in range order.</p>
      </>
    ),
    whatIsHappening: (
      <p>Bucket Sort splits input into a fixed number of buckets by value range, sorts each bucket with any sort (often insertion sort), and concatenates. It shines when input is uniformly distributed.</p>
    ),
    steps: [
      "Decide on a number of buckets.",
      "Place each value into the bucket matching its range.",
      "Sort each bucket individually.",
      "Concatenate the buckets in order to get the sorted output.",
    ],
    howComputerDoesIt:
      "For n items with values roughly evenly spread over a range, each bucket ends up with about n/k items. Sorting each with an O(k²) algorithm gives O(n) average time.",
    pseudocode: `procedure bucketSort(A, k):
  buckets = array of k empty lists
  for v in A:
    b = bucket index for v
    append v to buckets[b]
  for each bucket: sort with insertion sort
  return concatenation of all buckets`,
    java: `public static void bucketSort(float[] a) {
    int n = a.length;
    java.util.List<java.util.List<Float>> b = new java.util.ArrayList<>();
    for (int i = 0; i < n; i++) b.add(new java.util.ArrayList<>());
    for (float v : a) b.get((int)(v * n)).add(v);
    for (java.util.List<Float> bk : b) java.util.Collections.sort(bk);
    int idx = 0;
    for (java.util.List<Float> bk : b)
        for (float v : bk) a[idx++] = v;
}`,
    python: `def bucket_sort(a, k=5):
    if not a: return a
    m = max(a) + 1
    size = m // k + 1
    buckets = [[] for _ in range(k)]
    for v in a:
        buckets[v // size].append(v)
    out = []
    for b in buckets:
        b.sort()
        out.extend(b)
    return out`,
    timeComplexity: [
      { case: "Best", value: "O(n + k)", explain: "Perfectly even distribution over k buckets." },
      { case: "Average", value: "O(n + k)", explain: "Uniform data — each bucket is small." },
      { case: "Worst", value: "O(n²)", explain: "All values fall into one bucket (bad distribution)." },
    ],
    spaceComplexity: "O(n + k) for the buckets.",
    realWorld: [
      { title: "Sorting floating-point values", body: "Uniform decimals in [0, 1) sort in linear time." },
      { title: "Histogram-based binning", body: "Data analytics uses the same idea to distribute work." },
    ],
    quiz: [
      {
        q: "When is Bucket Sort slower than Merge Sort?",
        options: ["Always", "When values cluster into one bucket", "When the array is short", "When k = n"],
        answer: 1,
        why: "A single overflowing bucket falls back to a quadratic inner sort, killing the advantage.",
      },
    ],
    visualizer: viz("bucket-sort", [29, 25, 3, 49, 9, 37, 21, 43]),
    ...nav("bucket-sort"),
  },
};
