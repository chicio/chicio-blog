/**
 * https://leetcode.com/problems/maximum-product-subarray/description/
 * 152. Maximum Product Subarray
 */

function maxProduct(nums: number[]): number {
    if (nums.length === 0) { 
        return 0;
    }

    let maxProduct = nums[0];
    let minProduct = nums[0];
    let result = nums[0];

    for (let i = 1; i < nums.length; i++) {
        if (nums[i] < 0) {
            [maxProduct, minProduct] = [minProduct, maxProduct];
        }

        maxProduct = Math.max(nums[i], maxProduct * nums[i]);
        minProduct = Math.min(nums[i], minProduct * nums[i]);

        result = Math.max(result, maxProduct);
    }

    return result;
}

console.log(maxProduct([2,-5,-2,-4,3]))