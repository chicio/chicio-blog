export const shuffleArray = <T>(array: T[] = [], numberOfItems: number) =>
    [...array]
          .sort(() => Math.random() - 0.5)
          .slice(0, numberOfItems)