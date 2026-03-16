/**
 * https://leetcode.com/problems/maximum-gap/description/
 * 164. Maximum Gap
 */

interface Bucket {
    min: number
    max: number
}

function maximumGap(nums: number[]): number {
    let min = Infinity
    let max = -Infinity

    for (let i = 0; i < nums.length; i++) {
        const current = nums[i]
        min = Math.min(min, current)
        max = Math.max(max, current)
    }

    if (min === max) {
        return 0;
    }

    const bucketSize = Math.ceil((max - min) / (nums.length - 1))
    const bucketCount = Math.floor((max - min) / bucketSize) + 1;
    const buckets: Bucket[] = Array.from({ length: bucketCount }, () => ({ min: Infinity, max: -Infinity }));

    for (const num of nums) {
        const index = Math.floor((num - min) / bucketSize);
        buckets[index].min = Math.min(num, buckets[index].min);
        buckets[index].max = Math.max(num, buckets[index].max);
    }

    let maxGap = 0;
    let prevMax = min;

    for (const bucket of buckets) {
        if (bucket.min !== Infinity) {
            maxGap = Math.max(maxGap, bucket.min - prevMax);
            prevMax = bucket.max;
        }
    }

    return maxGap
}

console.log(maximumGap([3,6,9,1]))
