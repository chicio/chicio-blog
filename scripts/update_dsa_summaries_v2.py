#!/usr/bin/env python3
"""Script to update Problem Summary sections in the remaining DSA exercise MDX files."""
import re
import os

BASE = "/Users/fduroni/Code/Fabrizio/chicio-blog/src/content/data-structures-and-algorithms/topic"

def replace_problem_summary(key, summary):
    filepath = os.path.join(BASE, key, "content.mdx")
    if not os.path.exists(filepath):
        print(f"NOT FOUND: {filepath}")
        return
    with open(filepath, 'r') as f:
        content = f.read()
    new_content_full = summary + "## Techniques"
    result = re.sub(
        r'## Problem Summary\n.*?## Techniques',
        new_content_full,
        content,
        flags=re.DOTALL
    )
    if result == content:
        print(f"WARNING: No change made to {key}")
    else:
        with open(filepath, 'w') as f:
            f.write(result)
        print(f"OK: {key}")


summaries = {}

# ─── binary-search ────────────────────────────────────────────────────────────

summaries["binary-search/exercise/find-first-and-last-position-of-element-in-sorted-array"] = """## Problem Summary
Given an array of integers sorted in non-decreasing order, find the **starting and ending positions** of a given `target` value. If the target is not found, return `[-1, -1]`.

Your algorithm must run in `O(log n)` time.

**Constraints:**
- The array has between **0 and 100,000** elements.
- Element values and the target are integers in the range **[-1,000,000,000, 1,000,000,000]**.

"""

summaries["binary-search/exercise/find-minimum-in-rotated-sorted-array"] = """## Problem Summary
An ascending array of unique integers has been **rotated** between 1 and `n` times — a rotation moves the last element to the front. For example, rotating `[0,1,2,4,5,6,7]` by 4 gives `[4,5,6,7,0,1,2]`. Given such a rotated sorted array, return its **minimum element**.

Your solution must run in `O(log n)` time.

**Constraints:**
- The array has between **1 and 5,000** unique elements.
- All values are unique integers in the range **[-5,000, 5,000]**.

"""

summaries["binary-search/exercise/median-of-two-sorted-arrays"] = """## Problem Summary
Given two sorted arrays `nums1` and `nums2` of sizes `m` and `n` respectively, return the **median** of the combined sorted array.

Your solution must run in `O(log(m + n))` time.

**Constraints:**
- `nums1` has between **0 and 1,000** elements; `nums2` has between **0 and 1,000** elements.
- `m + n` is at least **1**.
- Element values are integers in the range **[-1,000,000, 1,000,000]**.

"""

summaries["binary-search/exercise/search-in-rotated-sorted-array"] = """## Problem Summary
An ascending array of distinct integers has been **possibly rotated** at an unknown index, resulting in an array like `[4,5,6,7,0,1,2]` (rotated from `[0,1,2,4,5,6,7]`). Given this rotated array and a `target`, return the **index** of the target if it exists, or `-1` otherwise.

Your solution must run in `O(log n)` time.

**Constraints:**
- The array has between **1 and 5,000** elements, all distinct.
- Element values and the target are integers in the range **[-10,000, 10,000]**.

"""

# ─── bit-manipulation ─────────────────────────────────────────────────────────

summaries["bit-manipulation/exercise/bitwise-and-of-numbers-range"] = """## Problem Summary
Given two integers `left` and `right` representing an inclusive range `[left, right]`, return the **bitwise AND** of all integers in that range.

**Constraints:**
- Both `left` and `right` are non-negative integers up to **2,147,483,647** (2^31 − 1).
- `left <= right`.

"""

# ─── bucket-sort ──────────────────────────────────────────────────────────────

summaries["bucket-sort/exercise/sort-characters-by-frequency"] = """## Problem Summary
Given a string `s`, sort its characters in **decreasing order of frequency** and return the result. Characters with equal frequency can appear in any relative order.

**Constraints:**
- The string has between **1 and 500,000** characters.
- It consists of uppercase and lowercase English letters, and digits.

"""

# ─── hashtable ────────────────────────────────────────────────────────────────

summaries["hashtable/exercise/longest-consecutive-sequence"] = """## Problem Summary
Given an unsorted array of integers, return the length of the **longest consecutive elements sequence** (e.g., `[100, 4, 200, 1, 3, 2]` → longest sequence `[1, 2, 3, 4]` → length `4`).

Your solution must run in `O(n)` time.

**Constraints:**
- The array has between **0 and 100,000** elements.
- Each element is a 32-bit signed integer.

"""

summaries["hashtable/exercise/maximum-number-of-balloons"] = """## Problem Summary
Given a string `text`, return the **maximum number of times** the word `"balloon"` can be formed using characters from `text`. Each character from `text` may be used at most once per instance.

**Constraints:**
- The string has between **1 and 10,000** characters, consisting of lowercase English letters only.

"""

summaries["hashtable/exercise/number-of-good-ways-to-split-a-string"] = """## Problem Summary
You are given a string `s`. A **good split** is a partition of `s` into two non-empty parts `s = s1 + s2` such that the number of distinct letters in `s1` equals the number of distinct letters in `s2`. Return the number of good splits.

**Constraints:**
- The string has between **1 and 100,000** characters, consisting of lowercase English letters only.

"""

summaries["hashtable/exercise/number-of-matching-subsequences"] = """## Problem Summary
Given a string `s` and an array of words, return the **number of words** that are subsequences of `s`. A word is a subsequence of `s` if its characters can be found in the same relative order within `s` (not necessarily contiguous).

**Constraints:**
- `s` has between **1 and 50,000** characters, all lowercase English letters.
- There are between **1 and 5,000** words, each with between **1 and 50** lowercase English letters.

"""

summaries["hashtable/exercise/split-array-into-consecutive-subsequences"] = """## Problem Summary
Given a sorted integer array `nums`, determine whether it can be split into one or more **consecutive subsequences** of length **at least 3**. Each element must be used in exactly one subsequence.

**Constraints:**
- The array has between **1 and 10,000** elements.
- Element values are integers in the range **[1, 1,000]**.

"""

# ─── linked-list ──────────────────────────────────────────────────────────────

summaries["linked-list/exercise/copy-list-with-random-pointer"] = """## Problem Summary
A linked list where each node has a `val`, a `next` pointer, and a `random` pointer that can point to any node in the list or `null`. Return a **deep copy** of the list — every node must be a new object, with the same `val`, `next`, and `random` structure as the original.

**Constraints:**
- The list has between **0 and 1,000** nodes.
- Node values are integers in the range **[-10,000, 10,000]**.
- `random` may point to any node or be `null`.

"""

summaries["linked-list/exercise/flatten-a-multilevel-doubly-linked-list"] = """## Problem Summary
You are given a doubly linked list where some nodes have an additional `child` pointer pointing to another doubly linked list. **Flatten** the list so that all nodes appear in a single-level doubly linked list, with child lists inserted immediately after their parent node. After flattening, no `child` pointers should remain.

**Constraints:**
- The total number of nodes across all levels is between **0 and 1,000**.
- Node values are integers in the range **[1, 100,000]**.

"""

summaries["linked-list/exercise/intersection-of-two-linked-lists"] = """## Problem Summary
Given the heads of two singly linked lists, return the **node at which the two lists intersect**, or `null` if they do not intersect. The intersection is by reference (same node object), not by value.

**Constraints:**
- Each list has between **1 and 30,000** nodes.
- Node values are integers in the range **[1, 50,000]**.
- The lists may or may not intersect.

"""

summaries["linked-list/exercise/remove-duplicates-from-sorted-list-II"] = """## Problem Summary
Given the `head` of a sorted linked list, delete **all nodes** that have duplicate values (keeping no copies), and return the head of the cleaned-up list.

**Constraints:**
- The list has between **0 and 300** nodes.
- Node values are integers in the range **[-100, 100]**, and the list is sorted in non-decreasing order.

"""

summaries["linked-list/exercise/remove-nth-node-from-end-of-list"] = """## Problem Summary
Given the `head` of a linked list and an integer `n`, remove the **n-th node from the end** of the list and return the head.

**Constraints:**
- The list has between **1 and 30** nodes.
- Node values are integers in the range **[0, 100]**.
- `n` is a valid index (between `1` and the length of the list).

"""

# ─── matrix ───────────────────────────────────────────────────────────────────

summaries["matrix/exercise/spiral-matrix"] = """## Problem Summary
Given an `m × n` matrix, return all elements in **spiral order** — starting from the top-left corner and traversing clockwise inward layer by layer.

For a 3×4 matrix:
```
 1  2  3  4
 5  6  7  8
 9 10 11 12
```
Spiral order: `[1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7]`

**Constraints:**
- The matrix has between **1 and 10** rows and between **1 and 10** columns.
- Each element is an integer in the range **[-100, 100]**.

"""

# ─── prefix-sum ───────────────────────────────────────────────────────────────

summaries["prefix-sum/exercise/subarray-sums-divisible-by-k"] = """## Problem Summary
Given an integer array `nums` and an integer `k`, return the number of **non-empty subarrays** whose sum is divisible by `k`.

**Constraints:**
- The array has between **1 and 30,000** elements.
- Each element is an integer in the range **[-10,000, 10,000]**.
- `k` is a positive integer between **2 and 10,000**.

"""

# ─── queue ────────────────────────────────────────────────────────────────────

summaries["queue/exercise/reveal-cards-in-increasing-order"] = """## Problem Summary
You have a deck of `n` cards with integer values. You reveal them one at a time using this process: reveal the top card, then move the next top card to the bottom of the deck, and repeat until all cards are revealed. Return an arrangement of the deck such that cards are **revealed in increasing order**.

**Constraints:**
- The deck has between **1 and 1,000** cards.
- All card values are distinct integers in the range **[1, 1,000,000]**.

"""

summaries["queue/exercise/time-needed-to-buy-tickets"] = """## Problem Summary
There are `n` people standing in a queue to buy tickets. The `i`-th person wants to buy `tickets[i]` tickets. Each person buys **one ticket per turn**, then goes to the back of the queue (if they still need more). Find the **total time** for the person at position `k` (0-indexed) to finish buying all their tickets.

**Constraints:**
- The queue has between **1 and 100** people.
- Each person wants between **1 and 100** tickets.
- `k` is a valid index between `0` and `n - 1`.

"""

# ─── quicksort ────────────────────────────────────────────────────────────────

summaries["quicksort/exercise/kth-largest-element-in-an-array"] = """## Problem Summary
Given an integer array `nums` and an integer `k`, return the **k-th largest element** in the sorted order (not the k-th distinct element). Note: `k = 1` means the largest element.

**Constraints:**
- The array has between **1 and 100,000** elements.
- Each element is an integer in the range **[-10,000, 10,000]**.
- `k` is a valid integer between `1` and the array length.

"""

# ─── sliding-window ───────────────────────────────────────────────────────────

summaries["sliding-window/exercise/find-all-anagrams-in-a-string"] = """## Problem Summary
Given two strings `s` and `p`, find all **start indices** of `p`'s anagrams (permutations) in `s`. The answer may be returned in any order.

**Constraints:**
- Both strings have between **1 and 30,000** characters, consisting of lowercase English letters only.

"""

summaries["sliding-window/exercise/longest-repeating-character-replacement"] = """## Problem Summary
Given a string `s` and an integer `k`, you can replace at most `k` characters in the string with any other uppercase letter. Return the **length of the longest substring** that contains only one distinct letter after at most `k` replacements.

**Constraints:**
- The string has between **1 and 100,000** uppercase English characters.
- `k` is a non-negative integer up to the string length.

"""

summaries["sliding-window/exercise/longest-substring-without-repeating-characters"] = """## Problem Summary
Given a string `s`, return the **length of the longest substring** that contains no repeating characters.

**Constraints:**
- The string has between **0 and 50,000** characters.
- It may contain English letters, digits, symbols, and spaces.

"""

summaries["sliding-window/exercise/maximum-average-subarray-I"] = """## Problem Summary
Given an integer array `nums` and an integer `k`, find the contiguous subarray of length exactly `k` with the **maximum average value** and return that average. Answers within `10^-5` of the true value are accepted.

**Constraints:**
- The array has between **1 and 100,000** elements.
- Each element is an integer in the range **[-10,000, 10,000]**.
- `k` is between **1** and the array length.

"""

summaries["sliding-window/exercise/maximum-sum-of-distinct-subarrays-with-length-k"] = """## Problem Summary
Given an integer array `nums` and an integer `k`, return the **maximum sum** of a subarray of length exactly `k` where all elements are **distinct**. Return `0` if no such subarray exists.

**Constraints:**
- The array has between **1 and 100,000** elements.
- Each element is a positive integer up to **100,000**.
- `k` is between `1` and the array length.

"""

summaries["sliding-window/exercise/substring-with-concatenation-of-all-words"] = """## Problem Summary
Given a string `s` and an array of equal-length words, find all **starting indices** in `s` where a substring is a concatenation of all the words in `words` exactly once, in any order, with no intervening characters.

**Constraints:**
- `s` has between **1 and 10,000** characters, consisting of lowercase English letters.
- There are between **1 and 5,000** words, each of the same length between **1 and 30** characters.
- The total length of all words combined is at most `s.length`.

"""

# ─── stack ────────────────────────────────────────────────────────────────────

summaries["stack/exercise/evaluate-reverse-polish-notation"] = """## Problem Summary
Evaluate the value of an arithmetic expression given in **Reverse Polish Notation** (postfix). Operands are integers; supported operators are `+`, `-`, `*`, and `/` (integer division truncating toward zero). The expression is guaranteed to be valid.

**Constraints:**
- The token array has between **1 and 10,000** tokens.
- Each token is either an integer in the range **[-200, 200]**, or one of `+`, `-`, `*`, `/`.
- The result is guaranteed to fit in a **32-bit signed integer**.

"""

summaries["stack/exercise/remove-all-adjacent-duplicates-in-string"] = """## Problem Summary
Given a string `s`, repeatedly remove all **adjacent duplicate pairs** until no more exist. Return the final string. The order of removal does not affect the result.

**Constraints:**
- The string has between **1 and 20,000** lowercase English characters.

"""

summaries["stack/exercise/removing-stars-from-a-string"] = """## Problem Summary
Given a string `s` containing letters and `'*'` characters, repeatedly remove the **nearest non-star character to the left** of each `'*'` along with the `'*'` itself. Return the resulting string after all stars are processed. The input is guaranteed to produce a valid result.

**Constraints:**
- The string has between **1 and 100,000** characters.
- It consists of lowercase English letters and `'*'`.
- There are always enough non-star characters to the left for every `'*'`.

"""

# ─── tree-traversal-bfs-dfs ───────────────────────────────────────────────────

summaries["tree-traversal-bfs-dfs/exercise/binary-search-tree-iterator"] = """## Problem Summary
Implement a `BSTIterator` class that traverses a Binary Search Tree (BST) in **in-order** (ascending) one node at a time:

- `BSTIterator(root)` — Initializes the iterator with the root of a BST.
- `next()` — Returns the next smallest integer in the BST.
- `hasNext()` — Returns `true` if there is a next element.

Both `next()` and `hasNext()` must run on average in `O(1)` time and use `O(h)` memory, where `h` is the height of the tree.

**Constraints:**
- The tree has between **1 and 100,000** nodes.
- Node values are integers in the range **[0, 1,000,000]**.
- `next()` will always be called only when `hasNext()` is `true`.

"""

summaries["tree-traversal-bfs-dfs/exercise/binary-tree-inorder-traversal"] = """## Problem Summary
Given the `root` of a binary tree, return its nodes' values in **in-order** traversal order (left subtree → root → right subtree).

**Constraints:**
- The tree has between **0 and 100** nodes.
- Node values are integers in the range **[-100, 100]**.

"""

summaries["tree-traversal-bfs-dfs/exercise/binary-tree-level-order-traversal"] = """## Problem Summary
Given the `root` of a binary tree, return the **level-order traversal** of its nodes' values — i.e., from left to right, level by level. Return the result as a list of lists, one per level.

**Constraints:**
- The tree has between **0 and 2,000** nodes.
- Node values are integers in the range **[-1,000, 1,000]**.

"""

summaries["tree-traversal-bfs-dfs/exercise/binary-tree-maximum-path-sum"] = """## Problem Summary
A **path** in a binary tree is a sequence of nodes where each adjacent pair is connected by an edge, and no node is visited more than once. Given the `root` of a binary tree, return the **maximum sum** of any path. The path does not need to pass through the root or include any particular node.

**Constraints:**
- The tree has between **1 and 30,000** nodes.
- Node values are integers in the range **[-1,000, 1,000]**.

"""

summaries["tree-traversal-bfs-dfs/exercise/binary-tree-postorder-traversal"] = """## Problem Summary
Given the `root` of a binary tree, return its nodes' values in **post-order** traversal order (left subtree → right subtree → root).

**Constraints:**
- The tree has between **0 and 100** nodes.
- Node values are integers in the range **[-100, 100]**.

"""

summaries["tree-traversal-bfs-dfs/exercise/binary-tree-preorder-traversal"] = """## Problem Summary
Given the `root` of a binary tree, return its nodes' values in **pre-order** traversal order (root → left subtree → right subtree).

**Constraints:**
- The tree has between **0 and 100** nodes.
- Node values are integers in the range **[-100, 100]**.

"""

summaries["tree-traversal-bfs-dfs/exercise/binary-tree-right-side-view"] = """## Problem Summary
Given the `root` of a binary tree, imagine standing on its **right side** and looking left. Return the list of node values visible from that vantage point, listed from top to bottom. For each level, only the rightmost node is visible.

**Constraints:**
- The tree has between **0 and 100** nodes.
- Node values are integers in the range **[-100, 100]**.

"""

summaries["tree-traversal-bfs-dfs/exercise/binary-tree-zigzag-level-order-traversal"] = """## Problem Summary
Given the `root` of a binary tree, return its node values in **zigzag level order** — alternating between left-to-right and right-to-left on each successive level. Return the result as a list of lists, one per level.

**Constraints:**
- The tree has between **0 and 2,000** nodes.
- Node values are integers in the range **[-100, 100]**.

"""

summaries["tree-traversal-bfs-dfs/exercise/construct-binary-tree-from-inorder-and-postorder-traversal"] = """## Problem Summary
Given two integer arrays `inorder` and `postorder` representing the in-order and post-order traversals of the same binary tree (all values unique), **construct and return** the binary tree.

**Constraints:**
- The tree has between **1 and 3,000** nodes.
- All node values in each array are unique and in the range **[-3,000, 3,000]**.
- `postorder` and `inorder` contain the same set of values.

"""

summaries["tree-traversal-bfs-dfs/exercise/construct-binary-tree-from-preorder-and-inorder-traversal"] = """## Problem Summary
Given two integer arrays `preorder` and `inorder` representing the pre-order and in-order traversals of the same binary tree (all values unique), **construct and return** the binary tree.

**Constraints:**
- The tree has between **1 and 3,000** nodes.
- All node values are unique and in the range **[-3,000, 3,000]**.
- `inorder` and `preorder` contain the same set of values.

"""

summaries["tree-traversal-bfs-dfs/exercise/convert-sorted-array-to-binary-search-tree"] = """## Problem Summary
Given an integer array sorted in strictly ascending order, convert it into a **height-balanced** Binary Search Tree (BST) — one where the height difference between the left and right subtrees of every node is at most 1.

**Constraints:**
- The array has between **1 and 10,000** elements.
- Each element is a unique integer in the range **[-10,000, 10,000]**.

"""

summaries["tree-traversal-bfs-dfs/exercise/delete-nodes-and-return-forest"] = """## Problem Summary
Given the `root` of a binary tree and a list of values to delete, remove all nodes with those values. The remaining nodes form a **forest** (a collection of disjoint trees). Return the roots of all trees in the resulting forest in any order.

**Constraints:**
- The tree has between **1 and 1,000** nodes with unique values.
- Node values are integers in the range **[1, 1,000]**.
- The `to_delete` list has between **1 and 1,000** elements, all valid node values.

"""

summaries["tree-traversal-bfs-dfs/exercise/distribute-coins-in-binary-tree"] = """## Problem Summary
You have a binary tree with `n` nodes where each node holds some number of coins. The total number of coins equals `n` (so each node should end up with exactly one). In one **move**, you can transfer one coin between two adjacent nodes (parent-child). Return the **minimum number of moves** needed to give every node exactly one coin.

**Constraints:**
- The tree has between **2 and 100** nodes.
- Each node's value is a non-negative integer.
- The total number of coins across all nodes equals the number of nodes.

"""

summaries["tree-traversal-bfs-dfs/exercise/flatten-binary-tree-to-linked-list"] = """## Problem Summary
Given the `root` of a binary tree, flatten it into a **linked list in-place** using only the `right` pointer. The resulting list should follow the same order as a **pre-order** traversal of the tree. All `left` pointers must be set to `null`.

**Constraints:**
- The tree has between **0 and 2,000** nodes.
- Node values are integers in the range **[-100, 100]**.

"""

summaries["tree-traversal-bfs-dfs/exercise/kth-smallest-element-in-a-bts"] = """## Problem Summary
Given the `root` of a Binary Search Tree and an integer `k`, return the **k-th smallest** value among all the node values. `k = 1` means the smallest value.

**Constraints:**
- The tree has between **1 and 10,000** nodes with unique values.
- Node values are integers in the range **[0, 10,000]**.
- `k` is a valid integer between `1` and the number of nodes.

"""

summaries["tree-traversal-bfs-dfs/exercise/lowest-common-ancestor-of-a-binary-tree"] = """## Problem Summary
Given the `root` of a binary tree and two nodes `p` and `q`, return their **Lowest Common Ancestor (LCA)** — the deepest node that has both `p` and `q` as descendants (a node can be a descendant of itself).

**Constraints:**
- The tree has between **2 and 100,000** nodes with unique values.
- Node values are integers in the range **[-1,000,000,000, 1,000,000,000]**.
- Both `p` and `q` are guaranteed to exist in the tree.

"""

summaries["tree-traversal-bfs-dfs/exercise/maximum-difference-between-node-and-ancestor"] = """## Problem Summary
Given the `root` of a binary tree, return the **maximum absolute difference** `|a.val - b.val|` where `a` is an ancestor of `b` (a node `a` is an ancestor of `b` if `b` lies on the path from `a` to any leaf).

**Constraints:**
- The tree has between **2 and 5,000** nodes.
- Node values are integers in the range **[0, 100,000]**.

"""

summaries["tree-traversal-bfs-dfs/exercise/maximum-width-of-binary-tree"] = """## Problem Summary
Given the `root` of a binary tree, return the **maximum width** of any level. The width of a level is the distance between the leftmost and rightmost non-null nodes, including null nodes in between (counted as if they occupy positions in a complete binary tree numbering). The answer is guaranteed to fit in a **32-bit signed integer**.

**Constraints:**
- The tree has between **1 and 3,000** nodes.
- Node values are integers in the range **[0, 100]**.

"""

summaries["tree-traversal-bfs-dfs/exercise/minimum-absolute-difference-in-BST"] = """## Problem Summary
Given the `root` of a Binary Search Tree, return the **minimum absolute difference** between the values of any two distinct nodes in the tree.

**Constraints:**
- The tree has between **2 and 100,000** nodes.
- Node values are non-negative integers up to **100,000,000**.

"""

summaries["tree-traversal-bfs-dfs/exercise/minimum-distance-between-BST-nodes"] = """## Problem Summary
Given the `root` of a Binary Search Tree (BST), return the **minimum difference** between the values of any two distinct nodes in the tree. (This is equivalent to the Minimum Absolute Difference problem.)

**Constraints:**
- The tree has between **2 and 100** nodes.
- Node values are non-negative integers up to **100,000**.

"""

summaries["tree-traversal-bfs-dfs/exercise/populating-next-right-pointers-in-each-node-II"] = """## Problem Summary
Given the `root` of a **general** (not necessarily perfect) binary tree where each node has a `next` pointer, populate every node's `next` to point to its **next right neighbor** on the same level. If there is no such neighbor, set `next` to `null`. The initial `next` values are all `null`. You may only use constant extra space.

**Constraints:**
- The tree has between **0 and 6,000** nodes.
- Node values are integers in the range **[-100, 100]**.

"""

summaries["tree-traversal-bfs-dfs/exercise/serialize-and-deserialize-binary-tree"] = """## Problem Summary
Design an algorithm to **serialize** a binary tree to a string and **deserialize** that string back to the original tree structure. There is no restriction on the encoding format — the only requirement is that serialization followed by deserialization reconstructs the original tree exactly.

**Constraints:**
- The tree has between **0 and 10,000** nodes.
- Node values are integers in the range **[-1,000, 1,000]**.

"""

summaries["tree-traversal-bfs-dfs/exercise/shortest-path-in-a-grid-with-obstacles-elimination"] = """## Problem Summary
You are given an `m × n` grid where `0` is a free cell and `1` is an obstacle. You start at `(0, 0)` and want to reach `(m-1, n-1)`. In one step you can move to any of the 4 adjacent free cells. You can eliminate at most `k` obstacles. Return the **minimum number of steps** to reach the destination, or `-1` if it is impossible.

**Constraints:**
- The grid has between **1 and 40** rows and **1 and 40** columns.
- Each cell is `0` (free) or `1` (obstacle).
- `k` is a non-negative integer up to **m × n**.

"""

summaries["tree-traversal-bfs-dfs/exercise/validate-binary-search-tree"] = """## Problem Summary
Given the `root` of a binary tree, determine whether it is a **valid Binary Search Tree** (BST). A valid BST requires that for every node, all values in its **left subtree** are strictly less than the node's value, and all values in its **right subtree** are strictly greater.

**Constraints:**
- The tree has between **1 and 10,000** nodes.
- Node values are 64-bit signed integers (using the full range).

"""

# ─── two-pointers ─────────────────────────────────────────────────────────────

summaries["two-pointers/exercise/two-sum-II-input-array-is-sorted"] = """## Problem Summary
Given a **1-indexed** sorted integer array `numbers` (non-decreasing), find two numbers such that they add up to a specific `target`. Return their indices as `[index1, index2]` where `1 <= index1 < index2 <= numbers.length`. The solution must use only constant extra space.

**Constraints:**
- The array has between **2 and 30,000** elements, sorted in non-decreasing order.
- Element values are integers in the range **[-1,000, 1,000]**.
- The target is an integer in the range **[-1,000, 1,000]**.
- There is exactly one valid solution.

"""

# ─── Execute ──────────────────────────────────────────────────────────────────

ok_count = 0
warn_count = 0
not_found = 0
for key, summary in summaries.items():
    filepath = os.path.join(BASE, key, "content.mdx")
    if not os.path.exists(filepath):
        print(f"NOT FOUND: {key}")
        not_found += 1
        continue
    with open(filepath, 'r') as f:
        content = f.read()
    new_content_full = summary + "## Techniques"
    result = re.sub(
        r'## Problem Summary\n.*?## Techniques',
        new_content_full,
        content,
        flags=re.DOTALL
    )
    if result == content:
        print(f"WARNING: {key}")
        warn_count += 1
    else:
        with open(filepath, 'w') as f:
            f.write(result)
        ok_count += 1

print(f"\nDone. {ok_count} OK, {warn_count} warnings, {not_found} not found.")
