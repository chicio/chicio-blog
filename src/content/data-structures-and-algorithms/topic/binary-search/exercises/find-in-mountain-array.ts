/**
 * https://leetcode.com/problems/find-in-mountain-array/description/
 * 1095. Find in Mountain Array
 */


class MountainArray {
    get(index: number): number {return 0; }
    length(): number { return 0; }
}

function findPeak(mountainArr: MountainArray) {
    let left = 0
    let right = mountainArr.length() - 1

    while (left < right) {
        const mid = left + Math.floor((right - left) / 2)

        if (mountainArr.get(mid) < mountainArr.get(mid + 1)) {
            left = mid + 1
        } else {
            right = mid
        }
    }

    return left
}

function find(
    target: number,
    mountainArr: MountainArray,
    left: number,
    right: number,
    condition: (mid: number, target: number) => boolean
) {
    let currentLeft = left
    let currentRight = right

    while (currentLeft <= currentRight) {
        const midIndex = currentLeft + Math.floor((currentRight - currentLeft) / 2)
        const mid = mountainArr.get(midIndex)

        if (mid === target) {
            return midIndex
        }

        if (condition(mid, target)) {
            currentLeft = midIndex + 1
        } else {
            currentRight = midIndex - 1
        }
    }

    return -1
}


function findInMountainArray(target: number, mountainArr: MountainArray) {
    let peak = findPeak(mountainArr)
    let left = find(
        target,
        mountainArr,
        0,
        peak,
        (mid, target) => mid < target
    )
    let right = find(
        target,
        mountainArr,
        peak,
        mountainArr.length() - 1,
        (mid, target) => mid > target
    )

    if (left === -1 && right === -1) {
        return -1
    }

    if (left === -1) {
        return right
    }

    if (right === -1) {
        return left
    }

    return Math.min(left, right)
};
