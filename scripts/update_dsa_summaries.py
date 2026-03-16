#!/usr/bin/env python3
"""Script to update Problem Summary sections in DSA exercise MDX files."""
import re
import os

BASE = "/Users/fduroni/Code/Fabrizio/chicio-blog/src/content/data-structures-and-algorithms/topic"

def replace_problem_summary(filepath, new_content):
    with open(filepath, 'r') as f:
        content = f.read()
    new_content_full = new_content + "## Techniques"
    result = re.sub(
        r'## Problem Summary\n.*?## Techniques',
        new_content_full,
        content,
        flags=re.DOTALL
    )
    if result == content:
        print(f"WARNING: No change made to {filepath}")
    else:
        with open(filepath, 'w') as f:
            f.write(result)
        print(f"OK: {os.path.relpath(filepath, BASE)}")


summaries = {}

summaries["binary-search/exercise/find-in-mountain-array"] = """## Problem Summary
*(This problem is an **interactive problem** — you cannot access the array directly.)*

A **mountain array** is an array of at least 3 elements that strictly increases up to a peak index, then strictly decreases after it. Given a `MountainArray` object, find the **minimum index** at which a `target` value appears. You may only access elements via `MountainArray.get(index)` and retrieve the length via `MountainArray.length()`. Return `-1` if the target does not exist.

**Note:** You are allowed at most **100 calls** to `MountainArray.get()`.

**Constraints:**
- The mountain array has between **3 and 10,000** elements.
- Both the target and all array values are non-negative integers up to **1,000,000,000**.

"""

summaries["binary-search/exercise/koko-eating-bananas"] = """## Problem Summary
There are `n` piles of bananas, and the guards will return in `h` hours. Each hour, Koko picks one pile and eats up to `k` bananas from it — if the pile has fewer than `k` bananas, she eats all of them and waits for the next hour. Find the **minimum integer eating speed** `k` such that Koko can finish all piles before the guards return.

**Constraints:**
- The number of piles is between **1 and 10,000**, and `h` (available hours) is at least as large as the number of piles.
- `h` can be at most **1,000,000,000**.
- Each pile contains between **1 and 1,000,000,000** bananas.

"""

summaries["binary-search/exercise/search-a-2D-matrix"] = """## Problem Summary
You are given an `m × n` integer matrix where each row is sorted in non-decreasing order, and the first element of each row is strictly greater than the last element of the previous row. Given a target integer, return `true` if it exists in the matrix, or `false` otherwise.

Your solution must run in `O(log(m × n))` time complexity.

**Constraints:**
- Both `m` (rows) and `n` (columns) are between **1 and 100**.
- Each element and the target are integers in the range **[-10,000, 10,000]**.

"""

summaries["binary-search/exercise/search-insert-position"] = """## Problem Summary
Given a sorted array of distinct integers and a target value, return the index where the target is found. If the target is not in the array, return the index where it would need to be inserted to keep the array sorted.

Your solution must run in `O(log n)` time.

**Constraints:**
- The array has between **1 and 10,000** elements.
- Array values and the target are integers in the range **[-10,000, 10,000]**.
- All values in the array are distinct and sorted in ascending order.

"""

summaries["bit-manipulation/exercise/counting-bits"] = """## Problem Summary
Given a non-negative integer `n`, return an array `ans` of length `n + 1` where `ans[i]` is the count of `1` bits in the binary representation of `i` (also known as its **popcount**).

The binary representation of small integers follows this pattern:

```
i  | binary | 1-bit count
---|--------|-------------
0  | 0      | 0
1  | 1      | 1
2  | 10     | 1
3  | 11     | 2
4  | 100    | 1
5  | 101    | 2
```

**Follow up:** Can you solve this in `O(n)` time in a single pass without using any built-in popcount function?

**Constraints:**
- `n` is a non-negative integer up to **100,000**.

"""

summaries["bit-manipulation/exercise/number-of-1-bits"] = """## Problem Summary
Given a positive integer `n`, return the number of **set bits** (bits with value `1`) in its 32-bit binary representation. This count is also known as the **Hamming weight** or **popcount**.

For example, integer `11` has binary representation `00000000000000000000000000001011`, which contains **3** set bits.

**Follow up:** If this function is called many times, how would you optimize it?

**Constraints:**
- The input is a positive integer in the range **[1, 2^31 − 1]**.

"""

summaries["bit-manipulation/exercise/reverse-bits"] = """## Problem Summary
Reverse the bits of a given 32-bit unsigned integer and return the resulting integer. For example:

```
Integer     | Binary (32 bits)
------------|----------------------------------
43261596    | 00000010100101000001111010011100
964176192   | 00111001011110000010100101000000
```

Reversing bits of `43261596` produces `964176192`.

**Follow up:** If this function is called many times, how would you optimize it?

**Constraints:**
- The input is a non-negative even integer in the range **[0, 2^31 − 2]**.

"""

summaries["bit-manipulation/exercise/single-number-III"] = """## Problem Summary
Given an integer array where every element appears exactly **twice** except for exactly **two elements** that each appear only once, find and return those two unique elements in any order.

Your solution must run in linear time and use only constant extra space.

**Constraints:**
- The array has between **2 and 30,000** elements.
- Each element is a 32-bit signed integer.
- Exactly two elements appear once; all others appear exactly twice.

"""

summaries["bit-manipulation/exercise/single-number"] = """## Problem Summary
Given a non-empty array of integers where every element appears exactly **twice** except for one element that appears only once, find and return that single element.

Your solution must use linear time and constant extra space.

**Constraints:**
- The array has between **1 and 30,000** elements.
- Values are in the range **[-30,000, 30,000]**.
- Every element appears twice except for exactly one element.

"""

summaries["bit-manipulation/exercise/sum-of-two-integers"] = """## Problem Summary
Given two integers `a` and `b`, return their sum **without using the `+` or `-` operators**.

**Constraints:**
- Both `a` and `b` are integers in the range **[-1,000, 1,000]**.

"""

summaries["bucket-sort/exercise/maximum-gap"] = """## Problem Summary
Given an unsorted integer array `nums`, return the **maximum difference** between two successive elements in its sorted form. If the array contains fewer than two elements, return `0`.

Your solution must run in **linear time** and use **linear extra space**.

**Constraints:**
- The array has between **1 and 100,000** elements.
- Each element is a non-negative integer up to **1,000,000,000**.

"""

summaries["bucket-sort/exercise/top-k-frequent-words"] = """## Problem Summary
Given an array of strings and an integer `k`, return the `k` most frequently occurring strings, sorted by frequency from highest to lowest. Words with equal frequency must be sorted **lexicographically** (alphabetical order).

**Constraints:**
- The array has between **1 and 500** words.
- Each word has between **1 and 10** characters, consisting of lowercase English letters only.
- `k` is a valid integer between `1` and the number of unique words.

"""

summaries["hashtable/exercise/Isomorphic-strings"] = """## Problem Summary
Two strings `s` and `t` are **isomorphic** if there exists a consistent one-to-one character mapping from `s` to `t` — every occurrence of a character in `s` maps to the same character in `t`, and no two distinct characters in `s` map to the same character in `t` (though a character may map to itself).

Given two strings `s` and `t` of the same length, determine whether they are isomorphic.

**Constraints:**
- Both strings have the same length, between **1 and 50,000** characters.
- Both strings consist of any valid ASCII character.

"""

summaries["hashtable/exercise/contains-duplicate-II"] = """## Problem Summary
Given an integer array `nums` and an integer `k`, return `true` if there exist two **distinct indices** `i` and `j` such that `nums[i] == nums[j]` and the absolute difference `|i - j|` is at most `k`.

**Constraints:**
- The array has between **1 and 100,000** elements.
- Each element is a 32-bit signed integer.
- `k` is a non-negative integer up to **100,000**.

"""

summaries["hashtable/exercise/design-hashmap"] = """## Problem Summary
Design and implement a `HashMap` **without using any built-in hash table libraries**. The implementation must support three operations:

- `put(key, value)` — Inserts or updates the mapping for `key` to `value`.
- `get(key)` — Returns the value mapped to `key`, or `-1` if no mapping exists.
- `remove(key)` — Removes the mapping for `key` if it exists.

**Constraints:**
- Keys and values are non-negative integers up to **1,000,000**.
- At most **10,000** calls will be made to `put`, `get`, and `remove`.

"""

summaries["hashtable/exercise/encode-and-decode-tinyurl"] = """## Problem Summary
Design a system to encode a long URL into a short URL and decode it back. Implement two functions:

- `encode(longUrl)` — Takes any valid URL and returns a shortened version.
- `decode(shortUrl)` — Takes a shortened URL and returns the original long URL.

There is no restriction on the encoding algorithm as long as the round-trip is lossless: encoding then decoding must always return the original URL. The encode and decode functions will always be called on the same `Solution` instance.

**Constraints:**
- URL length is between **1 and 10,000** characters.
- All input URLs are guaranteed to be valid.

"""

summaries["hashtable/exercise/group-anagrams"] = """## Problem Summary
Given an array of strings, group together all strings that are **anagrams** of each other (composed of the same characters with the same frequencies, in any order). Return the groups in any order.

**Constraints:**
- The array has between **1 and 10,000** strings.
- Each string has between **0 and 100** characters, consisting of lowercase English letters only.

"""

summaries["hashtable/exercise/number-of-good-pairs"] = """## Problem Summary
Given an array of integers, count the number of **good pairs** — pairs of indices `(i, j)` where `i < j` and `nums[i] == nums[j]`.

**Constraints:**
- The array has between **1 and 100** elements.
- Each element is a positive integer between **1 and 100**.

"""

summaries["hashtable/exercise/ransom-note"] = """## Problem Summary
Given two strings `ransomNote` and `magazine`, return `true` if the ransom note can be constructed using only characters from the magazine. Each character in the magazine can be used **at most once**.

**Constraints:**
- Both strings have between **1 and 100,000** characters, consisting of lowercase English letters only.

"""

summaries["hashtable/exercise/reorganize-string"] = """## Problem Summary
Given a string `s`, rearrange its characters so that no two **adjacent** characters are the same. Return any valid rearrangement, or an empty string `""` if no valid rearrangement is possible.

**Constraints:**
- The string has between **1 and 500** characters, consisting of lowercase English letters only.

"""

summaries["kadane-algorithm/exercise/best-sightseeing-pair"] = """## Problem Summary
You are given an array `values` where `values[i]` is the score of the `i`-th sightseeing spot. The **score** of a pair of spots at indices `i < j` is `values[i] + values[j] + i - j` (the sum of their scores minus the distance between them). Return the **maximum score** of any such pair.

**Constraints:**
- The array has between **2 and 50,000** elements.
- Each value is a positive integer between **1 and 1,000**.

"""

summaries["kadane-algorithm/exercise/max-product-subarray"] = """## Problem Summary
Given an integer array `nums`, find the contiguous subarray with the **largest product** and return that product. Note that a single-element subarray is valid, and the result is guaranteed to fit in a 32-bit integer.

**Constraints:**
- The array has between **1 and 20,000** elements.
- Each element is an integer in the range **[-10, 10]**.
- The product of any subarray of `nums` is guaranteed to fit in a **32-bit** integer.

"""

summaries["kadane-algorithm/exercise/max-subarray-sum-circular"] = """## Problem Summary
Given a **circular** integer array `nums` of length `n`, return the maximum possible sum of a non-empty contiguous subarray. In a circular array, the end wraps around to the beginning, so a subarray may span across the boundary. Each element may only be included once.

**Constraints:**
- The array has between **1 and 30,000** elements.
- Each element is an integer in the range **[-30,000, 30,000]**.

"""

summaries["kadane-algorithm/exercise/maximum-subarray"] = """## Problem Summary
Given an integer array `nums`, find the contiguous subarray (containing at least one element) with the **largest sum** and return its sum.

**Constraints:**
- The array has between **1 and 100,000** elements.
- Each element is an integer in the range **[-10,000, 10,000]**.

"""

summaries["linked-list/exercise/add-two-numbers"] = """## Problem Summary
You are given two non-empty linked lists representing two non-negative integers stored in **reverse order** — the head node holds the least significant digit. Add the two numbers and return the sum as a linked list in the same reversed format. Neither number has leading zeros except for the number 0 itself.

For example, adding 342 and 465:
```
2 -> 4 -> 3    (represents 342)
5 -> 6 -> 4    (represents 465)
= 7 -> 0 -> 8  (represents 807)
```

**Constraints:**
- Each linked list has between **1 and 100** nodes.
- Each node value is a single digit (**0–9**).
- Neither number has leading zeros (except zero itself).

"""

summaries["linked-list/exercise/design-linked-list"] = """## Problem Summary
Design your own implementation of a singly or doubly linked list. The implementation must support the following operations on a **0-indexed** list:

- `get(index)` — Returns the value at the given index, or `-1` if the index is invalid.
- `addAtHead(val)` — Inserts a new node with value `val` at the beginning.
- `addAtTail(val)` — Appends a new node with value `val` at the end.
- `addAtIndex(index, val)` — Inserts a node before the node at the given index. If `index` equals the list length, append at end. If `index` exceeds length, do not insert.
- `deleteAtIndex(index)` — Deletes the node at the given index if valid.

**Constraints:**
- Index and value are non-negative integers up to **1,000**.
- At most **2,000** method calls will be made in total.

"""

summaries["linked-list/exercise/partition-list"] = """## Problem Summary
Given the `head` of a linked list and a value `x`, partition it so that all nodes with values **less than** `x` come before all nodes with values **greater than or equal to** `x`, while preserving the original relative order within each partition.

**Constraints:**
- The list has between **0 and 200** nodes.
- Node values are integers in the range **[-100, 100]**, and `x` is in the range **[-200, 200]**.

"""

summaries["linked-list/exercise/rotate-list"] = """## Problem Summary
Given the `head` of a linked list and an integer `k`, rotate the list to the **right** by `k` positions — the last `k` elements are moved to the front of the list, preserving their relative order.

**Constraints:**
- The list has between **0 and 500** nodes.
- Node values are integers in the range **[-100, 100]**.
- `k` is a non-negative integer up to **2,000,000,000**.

"""

summaries["linked-list/exercise/swap-nodes-in-pairs"] = """## Problem Summary
Given the `head` of a linked list, swap every two adjacent nodes and return the new head. You must rearrange the nodes themselves — modifying node values is not allowed. If the list has an odd number of nodes, the last node is left in place.

**Constraints:**
- The list has between **0 and 100** nodes.
- Node values are non-negative integers up to **100**.

"""

summaries["matrix/exercise/game-of-life"] = """## Problem Summary
The `m × n` **Game of Life** board consists of cells that are either **alive** (`1`) or **dead** (`0`). Each cell interacts simultaneously with its **8 neighbors** (horizontal, vertical, and diagonal). Apply the following rules to determine the board's **next state**:

1. A live cell with fewer than **2** live neighbors dies (underpopulation).
2. A live cell with **2 or 3** live neighbors survives to the next generation.
3. A live cell with more than **3** live neighbors dies (overpopulation).
4. A dead cell with exactly **3** live neighbors becomes alive (reproduction).

Update the board **in-place** to reflect its next state. All transitions must happen simultaneously based on the current state.

**Constraints:**
- The board dimensions `m` and `n` are each between **1 and 25**.
- Each cell value is either `0` (dead) or `1` (alive).

"""

summaries["matrix/exercise/rotateimage"] = """## Problem Summary
You are given an `n × n` 2D matrix representing an image. Rotate the entire image **90 degrees clockwise**, modifying the matrix **in-place** without allocating a new one. The element at `(row, col)` moves to position `(col, n-1-row)`.

For example, rotating a 3×3 matrix:
```
1 2 3       7 4 1
4 5 6  -->  8 5 2
7 8 9       9 6 3
```

**Constraints:**
- The matrix is square with `n` between **1 and 20**.
- Each element is an integer in the range **[-1,000, 1,000]**.

"""

summaries["matrix/exercise/set-matrix-zeroes"] = """## Problem Summary
Given an `m × n` integer matrix, for every cell containing `0`, set its entire row **and** entire column to `0`. Perform the operation **in-place**.

**Constraints:**
- The matrix has between **1 and 200** rows and between **1 and 200** columns.
- Each element is a 32-bit signed integer.

"""

summaries["matrix/exercise/valid-sudoku"] = """## Problem Summary
Determine whether a partially filled `9 × 9` Sudoku board is **valid** according to these rules:

1. Each **row** must contain the digits `1–9` without repetition.
2. Each **column** must contain the digits `1–9` without repetition.
3. Each of the nine **3×3 sub-boxes** must contain the digits `1–9` without repetition.

Empty cells are represented by `'.'`. A valid board is not necessarily solvable — only the filled cells need to satisfy the rules.

```
5 3 . | . 7 . | . . .
6 . . | 1 9 5 | . . .
. 9 8 | . . . | . 6 .
------+-------+------
8 . . | . 6 . | . . 3
4 . . | 8 . 3 | . . 1
7 . . | . 2 . | . . 6
------+-------+------
. 6 . | . . . | 2 8 .
. . . | 4 1 9 | . . 5
. . . | . 8 . | . 7 9
```

**Constraints:**
- The board is always exactly `9 × 9`.
- Each cell contains either a digit character `'1'`–`'9'` or `'.'` for empty.

"""

summaries["merge-sort/exercise/reverse-pairs"] = """## Problem Summary
Given an integer array `nums`, count the number of **reverse pairs** — pairs of indices `(i, j)` where `i < j` and `nums[i] > 2 * nums[j]`.

**Constraints:**
- The array has between **1 and 50,000** elements.
- Each element is a 32-bit signed integer.

"""

summaries["merge-sort/exercise/sort-list"] = """## Problem Summary
Given the `head` of a singly linked list, sort the list in **ascending order** and return its head.

**Constraints:**
- The list has between **0 and 50,000** nodes.
- Each node value is an integer in the range **[-100,000, 100,000]**.

"""

summaries["prefix-sum/exercise/contiguous-array"] = """## Problem Summary
Given a binary array `nums` (containing only `0`s and `1`s), find the **maximum length** of a contiguous subarray with an equal number of `0`s and `1`s.

**Constraints:**
- The array has between **1 and 100,000** elements.
- Each element is either `0` or `1`.

"""

summaries["prefix-sum/exercise/continuous-subarray-sum"] = """## Problem Summary
Given an integer array `nums` and an integer `k`, return `true` if there exists a **contiguous subarray of length at least 2** whose elements sum to a **multiple of `k`** (including zero), and `false` otherwise.

**Constraints:**
- The array has between **1 and 100,000** elements.
- Each element is a non-negative integer up to **1,000,000,000**.
- The total array sum fits in a 32-bit unsigned integer.
- `k` is a positive integer up to 2^31 − 1.

"""

summaries["prefix-sum/exercise/range-sum-query-immutable"] = """## Problem Summary
Design a `NumArray` class that preprocesses an integer array `nums` at construction time to efficiently answer multiple **range sum queries**. Each query `sumRange(left, right)` returns the sum of elements from index `left` to `right` inclusive.

- `NumArray(nums)` — Initializes the object with the integer array.
- `sumRange(left, right)` — Returns the sum of `nums[left]` through `nums[right]` inclusive.

**Constraints:**
- The array has between **1 and 10,000** elements, each in the range **[-100,000, 100,000]**.
- Query indices satisfy `0 <= left <= right < nums.length`.
- At most **10,000** queries will be made.

"""

summaries["prefix-sum/exercise/subarray-sum-equals-k"] = """## Problem Summary
Given an integer array `nums` and an integer `k`, return the **total number of contiguous non-empty subarrays** whose elements sum exactly to `k`.

**Constraints:**
- The array has between **1 and 20,000** elements.
- Each element is an integer in the range **[-1,000, 1,000]**.
- `k` is an integer in the range **[-10,000,000, 10,000,000]**.

"""

summaries["queue/exercise/number-of-recent-calls"] = """## Problem Summary
Implement a `RecentCounter` class that tracks the number of recent network requests within a **3,000-millisecond** sliding window. It must support:

- `RecentCounter()` — Initializes the counter with no requests.
- `ping(t)` — Records a new request at time `t` milliseconds and returns the count of all requests in the inclusive range `[t − 3000, t]`.

All calls to `ping` are made with **strictly increasing** timestamps.

**Constraints:**
- Timestamps are positive integers up to **1,000,000,000** milliseconds.
- At most **10,000** calls to `ping` will be made.

"""

summaries["quicksort/exercise/sort-colors"] = """## Problem Summary
Given an array of `n` objects colored red (`0`), white (`1`), or blue (`2`), sort them **in-place** so that all reds come first, then whites, then blues. You must not use the built-in sort function.

**Constraints:**
- The array has between **1 and 300** elements.
- Each element is `0`, `1`, or `2`.

"""

summaries["recursion/exercise/decode-string"] = """## Problem Summary
Given an encoded string following the rule `k[encoded_string]` — meaning the `encoded_string` inside the brackets is repeated exactly `k` times — return the decoded string. `k` is always a positive integer, the original data contains no digits, and brackets are always well-formed and properly nested.

**Constraints:**
- The encoded string has between **1 and 30** characters.
- Characters consist of lowercase English letters, digits, and square brackets.
- All integers in the string are in the range **[1, 300]**.
- The decoded output will never exceed **100,000** characters.

"""

summaries["recursion/exercise/merge-two-sorted-lists"] = """## Problem Summary
Given the heads of two sorted linked lists `list1` and `list2`, merge them into one sorted linked list by splicing their nodes together, and return the head of the merged list.

**Constraints:**
- Each list has between **0 and 50** nodes.
- Node values are integers in the range **[-100, 100]**.
- Both lists are already sorted in non-decreasing order.

"""

summaries["recursion/exercise/pow-x-n"] = """## Problem Summary
Implement `pow(x, n)`, computing `x` raised to the power `n`. Handle both positive and negative exponents, and both positive and negative bases.

**Constraints:**
- `x` is a floating-point number in the open range **(-100.0, 100.0)**.
- `n` is a 32-bit signed integer in the range **[-(2^31), 2^31 − 1]**.
- Either `x` is non-zero, or `n` is positive (0^0 and 0^(negative) will not occur).

"""

summaries["sliding-window/exercise/max-consecutives-one-III"] = """## Problem Summary
Given a binary array `nums` and an integer `k`, return the **maximum number of consecutive `1`s** in the array after flipping at most `k` zeros to ones.

**Constraints:**
- The array has between **1 and 100,000** elements.
- Each element is either `0` or `1`.
- `k` is a non-negative integer up to the length of the array.

"""

summaries["sliding-window/exercise/minimum-size-subarray-sum"] = """## Problem Summary
Given an array of positive integers `nums` and a positive integer `target`, return the **minimal length** of a contiguous subarray whose sum is **greater than or equal to** `target`. If no such subarray exists, return `0`.

**Constraints:**
- The target is a positive integer up to **1,000,000,000**.
- The array has between **1 and 100,000** positive integer elements, each up to **10,000**.

"""

summaries["sliding-window/exercise/minimum-window-substring"] = """## Problem Summary
Given two strings `s` and `t`, return the **minimum window substring** of `s` that contains every character in `t` (including duplicates). If no such window exists, return an empty string. The answer is guaranteed to be unique.

**Constraints:**
- Both strings have between **1 and 100,000** characters.
- Both strings consist of uppercase and lowercase English letters.

"""

summaries["sliding-window/exercise/permutation-in-string"] = """## Problem Summary
Given two strings `s1` and `s2`, return `true` if any **permutation** of `s1` is a substring of `s2`, or `false` otherwise.

**Constraints:**
- Both strings have between **1 and 10,000** characters, consisting of lowercase English letters only.

"""

summaries["stack/exercise/basic-calculator-II"] = """## Problem Summary
Given a string `s` representing a valid arithmetic expression with non-negative integers and the operators `+`, `-`, `*`, `/` (integer division truncating toward zero), evaluate and return its result. You may not use any built-in expression evaluation functions such as `eval()`.

**Constraints:**
- The expression string has between **1 and 300,000** characters.
- It contains non-negative integers, `+`, `-`, `*`, `/` operators, and spaces.
- All intermediate and final results fit in a **32-bit signed integer**.

"""

summaries["stack/exercise/longest-valid-parentheses"] = """## Problem Summary
Given a string containing only `'('` and `')'` characters, return the length of the longest **valid (well-formed) parentheses substring**.

**Constraints:**
- The string has between **0 and 30,000** characters.
- Each character is either `'('` or `')'`.

"""

summaries["stack/exercise/min-stack"] = """## Problem Summary
Design a stack supporting the standard `push`, `pop`, and `top` operations, plus a `getMin()` operation that retrieves the minimum element in the stack. All four operations must run in **O(1)** time.

- `push(val)` — Pushes `val` onto the stack.
- `pop()` — Removes the top element.
- `top()` — Returns the top element without removing it.
- `getMin()` — Returns the current minimum element in the stack.

**Constraints:**
- Values are 32-bit signed integers.
- `pop`, `top`, and `getMin` will only be called on a non-empty stack.
- At most **30,000** method calls will be made.

"""

summaries["stack/exercise/remove-duplicate-letters"] = """## Problem Summary
Given a string `s`, remove **duplicate letters** so that every letter appears exactly once. Among all possible results, return the one that is **lexicographically smallest** while still being a subsequence of the original string.

**Constraints:**
- The string has between **1 and 10,000** characters, consisting of lowercase English letters only.

"""

summaries["stack/exercise/valid-parentheses"] = """## Problem Summary
Given a string containing only `'('`, `')'`, `'{'`, `'}'`, `'['`, and `']'` characters, determine if the string is **valid**. A string is valid if:

1. Every opening bracket is closed by the **same type** of bracket.
2. Brackets are closed in the **correct order** (most recently opened bracket first).
3. Every closing bracket has a corresponding open bracket of the same type.

**Constraints:**
- The string has between **1 and 10,000** characters.
- It consists only of bracket characters `'()[]{}'`.

"""

summaries["tree-traversal-bfs-dfs/exercise/01-matrix"] = """## Problem Summary
Given an `m × n` binary matrix where cells are either `0` or `1`, return a matrix of the same dimensions where each cell contains the **distance to the nearest `0`**. The distance between two adjacent cells (sharing a side) is `1`.

**Constraints:**
- The matrix has at most **10,000** total cells.
- Each cell is either `0` or `1`.
- There is at least one `0` in the matrix.

"""

summaries["tree-traversal-bfs-dfs/exercise/binary-tree-paths"] = """## Problem Summary
Given the `root` of a binary tree, return all **root-to-leaf paths** in any order. A leaf is a node with no children. Each path should be represented as a string of node values joined by `"->"`.

**Constraints:**
- The tree has between **1 and 100** nodes.
- Node values are integers in the range **[-100, 100]**.

"""

summaries["tree-traversal-bfs-dfs/exercise/bus-routes"] = """## Problem Summary
You are given bus routes where `routes[i]` is the ordered list of stops the `i`-th bus visits in a repeating loop. Starting at bus stop `source` (not on any bus), find the **minimum number of buses** you must board to reach bus stop `target`. Return `-1` if it is impossible.

**Constraints:**
- There are between **1 and 500** bus routes.
- Each route has between **1 and 100,000** stops; the total number of stops across all routes is at most **100,000**.
- All stop IDs within a single route are unique and are non-negative integers less than **1,000,000**.
- Both `source` and `target` are valid stop IDs.

"""

summaries["tree-traversal-bfs-dfs/exercise/count-complete-tree-nodes"] = """## Problem Summary
Given the `root` of a **complete binary tree**, return the total number of nodes. In a complete binary tree, every level except possibly the last is fully filled, and all nodes in the last level are as far left as possible.

Design an algorithm that runs in less than `O(n)` time by exploiting the complete tree structure.

**Constraints:**
- The tree has between **0 and 50,000** nodes.
- Node values are non-negative integers up to **50,000**.
- The tree is guaranteed to be complete.

"""

summaries["tree-traversal-bfs-dfs/exercise/diameter-of-binary-tree"] = """## Problem Summary
Given the `root` of a binary tree, return the **diameter** — the length of the longest path between any two nodes in the tree, measured by the number of edges. The path does not need to pass through the root.

**Constraints:**
- The tree has between **1 and 10,000** nodes.
- Node values are integers in the range **[-100, 100]**.

"""

summaries["tree-traversal-bfs-dfs/exercise/find-duplicate-subtrees"] = """## Problem Summary
Given the `root` of a binary tree, find all **duplicate subtrees**. Two subtrees are duplicates if they have the same structure and identical node values at every position. For each group of duplicates, return the root node of any one of them.

**Constraints:**
- The tree has between **1 and 5,000** nodes.
- Node values are integers in the range **[-200, 200]**.

"""

summaries["tree-traversal-bfs-dfs/exercise/invert-binary-tree"] = r"""## Problem Summary
Given the `root` of a binary tree, invert the tree (produce its mirror image) by recursively swapping the left and right subtrees of every node, and return the root.

```
    4               4
   / \    -->      / \
  2   7           7   2
 / \ / \         / \ / \
1  3 6  9       9  6 3  1
```

**Constraints:**
- The tree has between **0 and 100** nodes.
- Node values are integers in the range **[-100, 100]**.

"""

summaries["tree-traversal-bfs-dfs/exercise/open-the-lock"] = """## Problem Summary
You have a 4-wheel combination lock where each wheel displays a digit `'0'`–`'9'` and wraps around in both directions. The lock starts at `"0000"` and each move rotates one wheel by one step in either direction. Given a list of `deadend` combinations (reaching any locks the mechanism permanently) and a `target` combination, return the **minimum number of moves** to reach the target from `"0000"` without passing through any deadend. Return `-1` if impossible.

**Constraints:**
- There are between **1 and 500** dead end codes.
- Each dead end and the target is a 4-character string of digits.
- The target is not in the dead ends list.

"""

summaries["tree-traversal-bfs-dfs/exercise/path-sum-III"] = """## Problem Summary
Given the `root` of a binary tree and an integer `targetSum`, return the number of **downward paths** (from parent to child) whose node values sum to `targetSum`. Paths do not need to start at the root or end at a leaf — they only need to travel strictly downward through parent-child connections.

**Constraints:**
- The tree has between **0 and 1,000** nodes.
- Node values are 32-bit signed integers.
- `targetSum` is an integer in the range **[-1,000, 1,000]**.

"""

summaries["tree-traversal-bfs-dfs/exercise/rotting-oranges"] = """## Problem Summary
You are given an `m × n` grid where each cell contains an **empty cell** (`0`), a **fresh orange** (`1`), or a **rotten orange** (`2`). Every minute, any fresh orange **4-directionally adjacent** to a rotten orange also becomes rotten. Return the **minimum number of minutes** until no fresh oranges remain. If it is impossible to rot all oranges, return `-1`.

**Constraints:**
- The grid has at most **10** rows and **10** columns.
- Each cell contains `0`, `1`, or `2`.

"""

summaries["tree-traversal-bfs-dfs/exercise/same-tree"] = """## Problem Summary
Given the roots of two binary trees `p` and `q`, return `true` if the trees are **identical** — meaning they have the same structure and the same node values at every corresponding position.

**Constraints:**
- Both trees have between **0 and 100** nodes.
- Node values are integers in the range **[-10,000, 10,000]**.

"""

summaries["tree-traversal-bfs-dfs/exercise/symmetric-tree"] = """## Problem Summary
Given the `root` of a binary tree, determine whether the tree is **symmetric** (a mirror image of itself around its center). A tree is symmetric if, at every level, the left subtree is a mirror reflection of the right subtree.

**Constraints:**
- The tree has between **1 and 1,000** nodes.
- Node values are integers in the range **[-100, 100]**.

"""

summaries["tree-traversal-bfs-dfs/exercise/trim-a-binary-search-tree"] = """## Problem Summary
Given the `root` of a Binary Search Tree (BST) and bounds `[low, high]`, **trim** the tree so that all node values lie within the range `[low, high]`, preserving the original relative structure of the remaining nodes. Return the root of the trimmed tree (which may differ from the original root).

**Constraints:**
- The tree has between **1 and 10,000** nodes with unique values.
- Node values and bounds are non-negative integers up to **10,000**.
- `low <= high`, and both are valid BST values.
- The tree is guaranteed to be a valid BST.

"""

summaries["tree-traversal-bfs-dfs/exercise/word-ladder"] = """## Problem Summary
A **transformation sequence** from `beginWord` to `endWord` is a sequence of words where each adjacent pair differs by exactly one letter, and every intermediate word must be in the provided `wordList`. Return the **length of the shortest transformation sequence** (number of words), or `0` if no valid sequence exists.

**Constraints:**
- Word lengths are between **1 and 10** characters, all lowercase English letters.
- `beginWord` and `endWord` have the same length.
- The word list has between **1 and 5,000** distinct words, all the same length.
- `beginWord` is not the same as `endWord`.

"""

summaries["two-pointers/exercise/3sum"] = """## Problem Summary
Given an integer array `nums`, return all unique triplets `[nums[i], nums[j], nums[k]]` such that `i`, `j`, and `k` are distinct indices and the three values sum to zero. The result must not contain duplicate triplets.

**Constraints:**
- The array has between **3 and 3,000** elements.
- Each element is an integer in the range **[-100,000, 100,000]**.

"""

summaries["two-pointers/exercise/container-with-most-water"] = """## Problem Summary
You are given an array `height` of `n` integers. Consider `n` vertical lines where line `i` has height `height[i]`. Find two lines that, together with the x-axis, form a container holding the most water. Return the **maximum water volume**. The water level is limited by the shorter line, and the volume equals the shorter height multiplied by the horizontal distance between the lines.

**Constraints:**
- The array has between **2 and 100,000** elements.
- Each height is a non-negative integer up to **10,000**.

"""

summaries["two-pointers/exercise/merge-sorted-array"] = """## Problem Summary
You are given two integer arrays `nums1` and `nums2`, each sorted in non-decreasing order, with `m` and `n` valid elements respectively. `nums1` has extra space at the end (total length `m + n`) to hold the merged result. Merge `nums2` into `nums1` **in-place** so that `nums1` becomes a single sorted array.

**Constraints:**
- `nums1` has length `m + n`; `nums2` has length `n`.
- `m` and `n` are both between **0 and 200**, and `m + n >= 1`.
- All element values are 32-bit signed integers.

"""

summaries["two-pointers/exercise/trapping-rain-water"] = r"""## Problem Summary
Given `n` non-negative integers representing an elevation map where each bar has width `1`, compute how much **rainwater** can be trapped between the bars. Water is held wherever a lower bar is flanked on both sides by taller bars.

```
           |
   |       | |   |   |
   |   |   | | | | | |
   | | | | | | | | | |
---|---|---|---|---|---|---|---
 0   1   0   2   1   0   1   3
```

**Constraints:**
- The elevation map has between **1 and 20,000** bars.
- Each bar height is a non-negative integer up to **100,000**.

"""

ok_count = 0
warn_count = 0
for key, summary in summaries.items():
    filepath = os.path.join(BASE, key, "content.mdx")
    if os.path.exists(filepath):
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
    else:
        print(f"NOT FOUND: {filepath}")

print(f"\nDone. {ok_count} OK, {warn_count} warnings.")
