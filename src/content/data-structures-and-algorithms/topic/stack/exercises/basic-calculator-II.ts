/**
 * https://leetcode.com/problems/basic-calculator-ii/description/
 * 227. Basic Calculator II
 */

function calculate(s: string): number {
  const stack: number[] = [];
  let num = 0;
  let sign = '+';

  for (let i = 0; i < s.length; i++) {
    const c = s[i];

    if (c >= '0' && c <= '9') {
      num = num * 10 + (c.charCodeAt(0) - 48);
    }

    if ((c < '0' || c > '9') && c !== ' ' || i === s.length - 1) {
      if (sign === '+') {
        stack.push(num);
      } else if (sign === '-') {
        stack.push(-num);
      } else if (sign === '*') {
        stack.push(stack.pop()! * num);
      } else if (sign === '/') {
        const prev = stack.pop()!;
        stack.push(prev < 0
          ? Math.ceil(prev / num)
          : Math.floor(prev / num)
        );
      }

      sign = c;
      num = 0;
    }
  }

  return stack.reduce((a, b) => a + b, 0);
}

console.log(calculate("3+2*2")); // 7
console.log(calculate(" 3/2 ")); // 1
console.log(calculate(" 3+5 / 2 ")); // 5