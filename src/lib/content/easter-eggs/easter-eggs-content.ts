export interface EasterEggHint {
    id: string;
    title: string;
    crypticHint: string;
    solutionSteps: string[];
}

export const easterEggHuntPageTitle = "Easter Egg Hunt";

export const easterEggHuntPageDescription =
    "Hidden secrets are scattered across this Matrix-themed site. Follow the clues and trigger the easter eggs yourself.";

export const easterEggHuntIntroLines: string[] = [
    "Wake up...",
    "You've been here before — but have you seen everything?",
    "Some secrets are hidden in this site. Two of them, for now.",
    "Follow the clues. Trigger them yourself.",
];

export const easterEggHints: EasterEggHint[] = [
    {
        id: "the_white_rabbit",
        title: "The White Rabbit",
        crypticHint:
            "There is a place where you can search the whole site. Summon it, and instead of words, enter the number of the apartment where Neo lives. Something will answer. Then… knock.",
        solutionSteps: [
            "Press ⌘K (or Ctrl+K) to open the command palette.",
            "Type 101 — the number of Neo's apartment.",
            "Follow the white rabbit, then knock, knock.",
        ],
    },
    {
        id: "deja_vu",
        title: "Déjà Vu",
        crypticHint:
            "A déjà vu is a glitch in the matrix — it happens when they change something. Find a page that tells a story, look to its header, and click… again, again, again, and once more.",
        solutionSteps: ["Open any article or content page.", "Click the page header 4 times.", "Watch reality glitch."],
    },
];
