import { EasterEggSearchResult } from "@/types/search";

export const neoRoomNumber = "101"

export const whiteRabbitEasterEgg = (query: string): EasterEggSearchResult | null  => {
  if (query === neoRoomNumber) {
    return {
      type: "easterEgg",
      terminalLines: [
        { text: "Wake up, Neo...", type: "normal", delay: 200 },
        { text: "The matrix has you...", type: "normal", delay: 600 },
        { text: "Follow the white rabbit.", type: "normal", delay: 1000 },
        { text: "", type: "normal", delay: 1300 },
        { text: "Knock, knock, Neo.", type: "normal", delay: 1600 },
      ],
    };
  }

  return null;
}
