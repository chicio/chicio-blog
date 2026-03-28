#!/usr/bin/env python3
"""Update problem summary sections for interval exercises."""

import re
import json

summaries = {
    'merge-intervals': '''## Problem Summary
Given an array of `intervals` where each `intervals[i] = [start, end]` represents a time interval, merge all overlapping intervals into a single merged interval and return an array of non-overlapping intervals that cover the entire range of the input intervals.

Two intervals overlap if they share any common point. For example, `[1,3]` and `[2,6]` overlap because they both cover the range `[2,3]`, while `[1,3]` and `[3,4]` also overlap at the boundary point `3`.

**Visual Example:**
```
Before merging:
[1-----3]  
        [2--------6]
              [8--10]
                       [15--18]

After merging:
[1-----------6]
              [8--10]
                       [15--18]
```

**Constraints:**
- Array contains between **1 and 10,000** intervals
- Each interval has exactly **2 elements**: `[start, end]`
- Start and end values are **non-negative integers** up to **10,000**, where `start <= end`''',

    'insert-interval': '''## Problem Summary
You are given an array of **non-overlapping, sorted intervals** where `intervals[i] = [start, end]`, and a **new interval** `newInterval = [start, end]`. Insert the new interval into the existing array such that:
1. The result remains **sorted** by start positions
2. **All overlapping intervals are merged** with the new interval
3. The array contains **no overlapping intervals**

You may return a new array rather than modifying in-place.

**Visual Example:**
```
Before insertion:
[1--2]     [3----5]  [6-7]  [8----10]           [12------16]
                          
Insert [4,8]:
[1--2]     [3----5]  [6-7]  [8----10]           [12------16]
               [4----------8]
               (overlaps with [3,5], [6,7], [8,10])

After insertion and merging:
[1--2]     [3--------10]                         [12------16]
```

**Constraints:**
- Input array may be **empty** (0 to 10,000 intervals)
- Each interval contains exactly **2 elements**: `[start, end]`
- All values are **non-negative integers** up to **100,000**, with `start <= end`
- Input intervals are **already sorted** by start position and **do not overlap** with each other
- New interval values are also in the range **0 to 100,000** with `start <= end`''',

    'non-overlapping-intervals': '''## Problem Summary
Given an array of intervals, determine the **minimum number of intervals to remove** so that the remaining intervals do **not overlap** with each other.

**Important Note:** Two intervals are considered **non-overlapping** if they only touch at a single point. For example, `[1,2]` and `[2,3]` are non-overlapping (they touch at point 2), but `[1,3]` and `[2,4]` are overlapping (they share the range `[2,3]`).

**Visual Example:**
```
Original:
[1--2]  [2--3]  [3--4]  [1------3]
         ✗ Overlaps: [1,3] spans multiple intervals

Optimal removal: Remove [1,3]
[1--2]  [2--3]  [3--4]
✓ Non-overlapping (touching at boundaries is allowed)

Minimum intervals removed: 1
```

**Constraints:**
- Input contains between **1 and 100,000** intervals
- Each interval has exactly **2 elements**: `[start, end]`, where `start < end`
- Values range from **-50,000 to 50,000**
- Original array order does not matter; you only need to count removals''',

    'maximum-number-of-events-that-can-be-attended': '''## Problem Summary
You are given an array of events, each represented as `events[i] = [startDay, endDay]`. Each event is active during all days from `startDay` to `endDay` (inclusive), and you can attend it on **any single day** within that range.

**Key constraint:** You can attend **at most one event per day**. Find the **maximum number of events** you can attend by choosing which day to attend each event.

**Visual Example - Timeline Approach:**
```
Events:  [1,2], [2,3], [3,4], [1,2]

Day 1:   [1,2]    OR   [1,2]    OR  [1,2]
         [1,2]        (duplicate)     Event 0

Day 2:   [2,3]   OR    [2,3]   OR  [2,3]
         [1,2]        Event 1      Event 2 (moved)

Day 3:                  [3,4]     [3,4]
                        Event 3   Event 3

Optimal schedule: Attend on day 1(Event 0), day 2(Event 1), day 3(Event 2), day 3(duplicate moved to available slot)
Maximum events attended: 4
```

**Constraints:**
- Array contains between **1 and 100,000** events
- Each event has exactly **2 elements**: `[startDay, endDay]`, where `startDay <= endDay`
- Days are **positive integers** between **1 and 100,000**
- You must attend each event on a different day (no two different events on same day)''',

    'minimum-number-of-arrows-to-burst-balloons': '''## Problem Summary
Balloons are hung on a wall at various horizontal positions, represented as `points[i] = [xStart, xEnd]` denoting the horizontal range each balloon spans. An arrow shot vertically at x-coordinate `x` will burst all balloons where `xStart <= x <= xEnd`. Find the **minimum number of arrows** needed to burst **all balloons**.

**Key Insight:** An arrow shot at a single x-coordinate can burst multiple balloons that overlap at that point. This is an interval overlap problem where you must find the minimum number of points to cover all intervals.

**Visual Example:**
```
Balloons on x-axis:

x:    1   2   3   4   5   6   7   8   9  10  11  12  13  14  15  16

      |--[1,6]----|                    (balloon 1)
          |--[2,8]--|                  (balloon 2)
                  |--[7,12]--|          (balloon 3)
                              |--[10,16]--|  (balloon 4)

Optimal arrow shots:
      |--[1,6]----|        Arrow at x=6 bursts balloons 1,2
          (burst)
                  |--[7,12]--|        Arrow at x=11 bursts balloons 3,4
                  (burst)

Minimum arrows needed: 2
```

**Constraints:**
- Array contains between **1 and 100,000** balloons
- Each balloon is defined by **2 x-coordinates**: `[xStart, xEnd]`, where `xStart < xEnd`
- X-coordinate values are **32-bit signed integers** (ranging from highly negative to highly positive values)
- You must burst every single balloon'''
}

files_to_update = {
    'merge-intervals': 'src/content/data-structures-and-algorithms/topic/intervals/exercise/merge-intervals/content.mdx',
    'insert-interval': 'src/content/data-structures-and-algorithms/topic/intervals/exercise/insert-interval/content.mdx',
    'non-overlapping-intervals': 'src/content/data-structures-and-algorithms/topic/intervals/exercise/non-overlapping-intervals/content.mdx',
    'maximum-number-of-events-that-can-be-attended': 'src/content/data-structures-and-algorithms/topic/intervals/exercise/maximum-number-of-events-that-can-be-attended/content.mdx',
    'minimum-number-of-arrows-to-burst-balloons': 'src/content/data-structures-and-algorithms/topic/intervals/exercise/minimum-number-of-arrows-to-burst-balloons/content.mdx'
}

for exercise, filepath in files_to_update.items():
    if exercise not in summaries:
        print(f"⚠️  Skipping {exercise} - no summary defined")
        continue
    
    try:
        with open(filepath, 'r') as f:
            content = f.read()
        
        # Replace from ## Problem Summary to ## Techniques
        pattern = r'## Problem Summary\n.*?(?=\n## Techniques)'
        new_summary = summaries[exercise]
        updated = re.sub(pattern, new_summary, content, flags=re.DOTALL)
        
        with open(filepath, 'w') as f:
            f.write(updated)
        
        print(f"✓ Updated {exercise}")
    except Exception as e:
        print(f"✗ Failed to update {exercise}: {e}")

print("\nDone!")
