#!/usr/bin/env python3
"""
Script to rewrite the ## Problem Summary section of heap DSA exercises:
- Rewrites the summary as a clear description of the problem
- Converts constraints to descriptive prose
- Removes examples
- Adds ASCII diagrams
- Updates the frontmatter description field
"""
import re
import os

BASE = "/Users/fduroni/Code/Fabrizio/chicio-blog/src/content/data-structures-and-algorithms/topic/heap/exercise"


def update_file(filename, new_summary, new_description):
    filepath = os.path.join(BASE, filename, "content.mdx")
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # Update frontmatter description (single-line double-quoted value)
    content = re.sub(
        r'^description: ".*"$',
        lambda _: 'description: "' + new_description + '"',
        content,
        count=1,
        flags=re.MULTILINE,
    )

    # Replace everything between ## Problem Summary and ## Techniques
    content = re.sub(
        r"(## Problem Summary\n).*?(## Techniques)",
        lambda m: m.group(1) + new_summary + "\n" + m.group(2),
        content,
        flags=re.DOTALL,
    )

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)

    print(f"Updated {filename}")


# ---------------------------------------------------------------------------
# 1. process-tasks-using-servers
# ---------------------------------------------------------------------------
update_file(
    "process-tasks-using-servers",
    """\
You have `n` servers (each with a weight) and `m` tasks (each with a processing
duration in seconds). Task `j` becomes available at second `j` (0-indexed).
The assignment rules are:

- When a server becomes free and there are queued tasks, the task at the front
  of the queue is assigned to the **free server with the smallest weight**
  (ties broken by smallest index).
- If all servers are busy when a task arrives, it waits in the queue. As soon
  as any server frees up, the next queued task is dispatched immediately.
- When multiple servers free at the same time, tasks are assigned in queue
  order, following weight/index priority.

A server assigned task `j` at time `t` becomes free again at time `t + tasks[j]`.

Return an array `ans` of length `m` where `ans[j]` is the index of the server
that processes task `j`.

**Constraints:**
- Both `n` (number of servers) and `m` (number of tasks) can be up to 200,000.
- Server weights and task durations are positive integers, each at most 200,000.

```text
Example: servers = [3, 3, 2],  tasks = [1, 2, 3, 2, 1, 2]
         (server 0→w=3, server 1→w=3, server 2→w=2)

t=0: task 0 arrives → server 2 (lightest, w=2), busy until t=1
t=1: task 1 arrives, server 2 frees → server 2 (still lightest), busy until t=3
t=2: task 2 arrives → server 0 (next lightest, w=3), busy until t=5
t=3: task 3 arrives, server 2 frees → server 2, busy until t=5
t=4: task 4 arrives → server 1 (only free), busy until t=5
t=5: task 5 arrives, all free → server 2 (lightest), busy until t=7

Result: ans = [2, 2, 0, 2, 1, 2]
```

""",
    "You have n servers (each with a weight) and m tasks (each with a processing duration). Assign each task to the free server with the smallest weight, breaking ties by index. Return the server index assigned to each task.",
)

# ---------------------------------------------------------------------------
# 2. sliding-window-median
# ---------------------------------------------------------------------------
update_file(
    "sliding-window-median",
    """\
The **median** is the middle value of a sorted sequence: the single middle
element when the count is odd, or the average of the two middle elements when
the count is even.

Given an integer array `nums` and a window size `k`, slide a window of exactly
`k` elements from left to right across the array. For each window position,
compute the median of the `k` elements inside it, and return all medians as an
array. Answers within `10⁻⁵` of the actual value are accepted.

**Constraints:**
- The array has between 1 and 100,000 elements, and the window size `k` is
  between 1 and the array length.
- Array values can span the full 32-bit signed integer range.

```text
nums = [1, 3, -1, -3, 5, 3, 6, 7],  k = 3

Window              Sorted window       Median
──────────────────  ──────────────────  ──────
[1,  3, -1] ...     [-1,  1,  3]         1.0
 1  [3, -1, -3] …   [-3, -1,  3]        -1.0
 1   3 [-1, -3,  5]  [-3, -1,  5]       -1.0
 1   3  -1 [-3,  5,  3]  [-3,  3,  5]    3.0
 1   3  -1  -3  [5,  3,  6]  [ 3,  5,  6]  5.0
 1   3  -1  -3   5  [3,  6,  7]  [ 3,  6,  7]  6.0

Output: [1.0, -1.0, -1.0, 3.0, 5.0, 6.0]
```

""",
    "Given an integer array and a window size k, return the median for each sliding window position as the window moves from left to right across the array.",
)

# ---------------------------------------------------------------------------
# 3. single-threaded-cpu
# ---------------------------------------------------------------------------
update_file(
    "single-threaded-cpu",
    """\
You have a single-threaded CPU and `n` tasks, each defined by an enqueue time
and a processing duration. The CPU processes at most one task at a time and
follows these rules:

- If the CPU is idle with no available tasks, it waits.
- When the CPU is free and one or more tasks are available, it picks the one
  with the **shortest processing time** (ties broken by smallest original index).
- Once a task starts, it runs uninterrupted until completion. The CPU can start
  a new task immediately after finishing one.

Return the order in which the CPU processes the tasks (by original index).

**Constraints:**
- Up to 100,000 tasks.
- Enqueue times and processing durations can each be up to 1,000,000,000.

```text
tasks = [[1,2], [2,4], [3,2], [4,1]]
        (idx 0: enqueue=1, proc=2)
        (idx 1: enqueue=2, proc=4)
        (idx 2: enqueue=3, proc=2)
        (idx 3: enqueue=4, proc=1)

t=1:  task 0 available → CPU picks task 0 (proc=2)
t=2:  task 1 available → CPU busy
t=3:  task 0 done, tasks {1,2} available → pick task 2 (shorter proc=2 < 4)
t=4:  task 3 available
t=5:  task 2 done, tasks {1,3} available → pick task 3 (shorter proc=1 < 4)
t=6:  task 3 done, task 1 available → pick task 1 (proc=4)
t=10: task 1 done

Order: [0, 2, 3, 1]
```

""",
    "Given n tasks each with an enqueue time and processing duration, simulate a single-threaded CPU that always picks the shortest available task. Return the order in which tasks are processed.",
)

# ---------------------------------------------------------------------------
# 4. top-k-frequent-elements
# ---------------------------------------------------------------------------
update_file(
    "top-k-frequent-elements",
    """\
Given an integer array `nums` and an integer `k`, find and return the `k`
elements that appear most frequently in the array. The answer is guaranteed to
be unique (no ambiguity for the `k`-th slot) and can be returned in any order.

**Constraints:**
- The array can have up to 100,000 elements, each in the range [−10,000, 10,000].
- `k` is between 1 and the number of distinct elements in the array.
- The answer is always unique — there is no tie for the `k`-th most frequent element.

**Follow up:** Your algorithm's time complexity must be better than `O(n log n)`.

```text
nums = [1, 1, 1, 2, 2, 3],  k = 2

Frequency count:         Top k=2 most frequent:
  1 → ███  (3 times)     [1, 2]
  2 → ██   (2 times)
  3 → █    (1 time)
```

""",
    "Given an integer array nums and an integer k, return the k elements that appear most frequently. The answer is guaranteed to be unique.",
)

# ---------------------------------------------------------------------------
# 5. k-closest-points-to-origin
# ---------------------------------------------------------------------------
update_file(
    "k-closest-points-to-origin",
    """\
Given an array of 2D points and an integer `k`, return the `k` points closest
to the origin `(0, 0)`, measured by Euclidean distance `√(x² + y²)`. The
answer is guaranteed to be unique and can be returned in any order.

**Constraints:**
- Up to 10,000 points, with `x` and `y` coordinates each in the range
  [−10,000, 10,000].
- `k` is between 1 and the total number of points.

```text
points = [[1,3], [-2,2]],  k = 1

     Y
  3 ─┤  *(1,3)   d = √(1²+3²)   = √10 ≈ 3.16
  2 ─┤*(-2,2)   d = √((-2)²+2²) = √8  ≈ 2.83  ← closer
  1 ─┤
  0 ─┼──────────── X
    -2  -1   0   1

k=1 → [[-2, 2]]
```

""",
    "Given an array of 2D points and an integer k, return the k points closest to the origin (0,0) by Euclidean distance.",
)

# ---------------------------------------------------------------------------
# 6. kth-largest-element-in-a-stream
# ---------------------------------------------------------------------------
update_file(
    "kth-largest-element-in-a-stream",
    """\
Design a class `KthLargest` that, given an integer `k` and an initial list of
values, maintains a running data stream and always returns the `k`-th largest
value after each new integer is added. The `k`-th largest is the `k`-th element
when all values seen so far are sorted in descending order.

Implement:
- `KthLargest(int k, int[] nums)` — initializes with `k` and a seed list.
- `int add(int val)` — adds `val` to the stream and returns the current
  `k`-th largest value.

**Constraints:**
- The initial list can be empty or contain up to 10,000 elements.
- `k` is at least 1 and at most the initial list size plus one.
- All values (initial and added) are in the range [−10,000, 10,000].
- At most 10,000 calls will be made to `add`.

```text
k=3,  initial nums = [4, 5, 8, 2]

Initial sorted desc: [8, 5, 4, 2]   → 3rd largest = 4

add(3):  desc [8, 5, 4, 3, 2]        → 3rd largest = 4
add(5):  desc [8, 5, 5, 4, 3, 2]     → 3rd largest = 5
add(10): desc [10, 8, 5, 5, 4, 3, 2] → 3rd largest = 5
add(9):  desc [10, 9, 8, 5, 5, 4, ...] → 3rd largest = 8

Output: [4, 5, 5, 8, 8]
```

""",
    "Design a class that maintains a running stream of integers and returns the k-th largest value after each new integer is added.",
)

# ---------------------------------------------------------------------------
# 7. furthest-building-you-can-reach
# ---------------------------------------------------------------------------
update_file(
    "furthest-building-you-can-reach",
    """\
You are traversing a sequence of buildings with given heights, starting at
building `0`. Moving from building `i` to building `i+1` works as follows:

- If the next building is no taller, you cross for free.
- If the next building is taller, you must bridge the height gap using either
  `heights[i+1] - heights[i]` **bricks** or one **ladder** (covers any gap).

Given a limited supply of `bricks` and `ladders`, use them optimally to travel
as far as possible. Return the 0-indexed position of the furthest building you
can reach.

**Constraints:**
- Up to 100,000 buildings, with heights ranging from 1 to 1,000,000.
- Available bricks can be up to 1,000,000,000; available ladders can be up to
  the number of buildings.

```text
heights = [4, 2, 7, 6, 9, 14, 12],  bricks = 5,  ladders = 1

   14|              █
    9|           █  █
    7|        █  █  █
    6|        █  █  █  █
    4|  █     █  █  █  █
    2|  █  █  █  █  █  █  █
      +───────────────────────
       0   1   2   3   4   5   6

Ascending gaps (need a resource):
  1→2: +5  → use 5 bricks   (bricks left = 0)
  3→4: +3  → use 1 ladder   (ladders left = 0)
  4→5: +5  → no resources   → stop at building 4

Furthest reachable: index 4
```

""",
    "Given building heights, a supply of bricks and ladders, travel from building 0 as far as possible by optimally choosing when to spend bricks versus ladders for upward climbs.",
)

# ---------------------------------------------------------------------------
# 8. find-median-from-data-stream
# ---------------------------------------------------------------------------
update_file(
    "find-median-from-data-stream",
    """\
Design a data structure `MedianFinder` that supports dynamically adding integers
from a data stream and efficiently returning the median of all integers added so
far at any point.

The median of a sorted sequence is the single middle element when the count is
odd, or the average of the two middle elements when the count is even.

Implement:
- `MedianFinder()` — initializes the object.
- `void addNum(int num)` — adds `num` to the data structure.
- `double findMedian()` — returns the current median. Answers within `10⁻⁵`
  of the actual value are accepted.

**Constraints:**
- Values added are in the range [−100,000, 100,000].
- `findMedian` is only called when at least one element has been added.
- At most 50,000 calls in total to `addNum` and `findMedian`.

**Follow up:**
- If all integers are in the range [0, 100], how would you optimize your solution?
- If 99% of integers are in the range [0, 100], how would you optimize your solution?

```text
Stream: addNum(1), addNum(2), addNum(3)

After addNum(1): sorted = [1]        → median = 1.0
After addNum(2): sorted = [1, 2]     → median = (1+2)/2 = 1.5
After addNum(3): sorted = [1, 2, 3]  → median = 2.0

Two-heap internal state (max-heap left | min-heap right):
  add(1):  [1]     |  []    → median = maxHeap.top = 1.0
  add(2):  [1]     |  [2]   → median = (1+2)/2 = 1.5
  add(3):  [1,2]   |  [3]   → median = maxHeap.top = 2.0
             ↑                  ↑
      left max ≤ right min at all times
```

""",
    "Design a data structure that supports inserting integers from a data stream one at a time and efficiently computing the median of all values added so far.",
)

# ---------------------------------------------------------------------------
# 9. ipo
# ---------------------------------------------------------------------------
update_file(
    "ipo",
    """\
A company wants to maximize its capital before an IPO by completing at most `k`
projects. There are `n` projects available, each requiring a minimum starting
capital and yielding a fixed profit upon completion. You start with `w` capital;
completing a project adds its profit to your current capital, which can unlock
additional projects.

Pick at most `k` distinct projects (in any order) to **maximize your final
capital**. Return the maximum capital achievable. The answer is guaranteed to
fit in a 32-bit signed integer.

**Constraints:**
- You can select at most `k` projects, with `k` up to 100,000.
- Initial capital `w` can be up to 1,000,000,000.
- There are up to 100,000 projects; each project's profit is between 0 and
  10,000, and its required capital is between 0 and 1,000,000,000.

```text
k=2,  w=0,  profits=[1,2,3],  capital=[0,1,1]

Projects:
  idx 0: requires capital ≥ 0,  profit = 1
  idx 1: requires capital ≥ 1,  profit = 2
  idx 2: requires capital ≥ 1,  profit = 3

Step 1 (w=0): affordable → {idx 0}
              pick highest profit → idx 0  →  w = 0+1 = 1

Step 2 (w=1): affordable → {idx 1, idx 2}
              pick highest profit → idx 2  →  w = 1+3 = 4

Final capital = 4
```

""",
    "Given n projects each with a required capital and profit, starting with w capital and allowed to complete at most k projects, return the maximum capital achievable by greedily picking the highest-profit affordable project at each step.",
)

print("\nAll heap exercise summaries updated successfully.")
