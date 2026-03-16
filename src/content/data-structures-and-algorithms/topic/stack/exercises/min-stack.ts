/**
 * https://leetcode.com/problems/min-stack/description/
 * 155. Min Stack
 */

class MinStack {
    constructor(
        private readonly stack: number[] = [],
        private readonly minStack: number[] = []
    ) { }

    push(val: number): void {
       this.stack.push(val) 

       if (this.minStack.length === 0 || this.minStack[this.minStack.length - 1] >= val) {
        this.minStack.push(val)
       }
    }

    pop(): void {
       let removed = this.stack.pop() 

       if (this.minStack[this.minStack.length - 1] === removed) {
        this.minStack.pop()
       }
    }

    top(): number {
        return this.stack[this.stack.length - 1]
    }

    getMin(): number {
        return this.minStack[this.minStack.length - 1]
    }
}
