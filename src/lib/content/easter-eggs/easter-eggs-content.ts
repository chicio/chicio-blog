import type { EasterEggTerminalLines } from "@/types/search/search";

export interface EasterEggHint {
    id: string;
    title: string;
    crypticHint: string;
    solutionSteps: string[];
}

export const easterEggHuntPageTitle = "Easter Egg Hunt";

export const easterEggHuntPageDescription =
    "Hidden secrets are scattered across this site. Follow the clues and trigger the easter eggs yourself.";

export const easterEggHuntIntroLines: string[] = [
    "Wake up...",
    "You've been here before — but have you seen everything?",
    "Some secrets are hidden in this site. Four of them, for now.",
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
    {
        id: "i_know_kung_fu",
        title: "I Know Kung Fu",
        crypticHint:
            "Some codes from an older console never truly die. On any page, without clicking anything, walk up, up, then crouch down, down, dodge left, right, left, right, then punch, then jump. Something new gets downloaded straight into your head.",
        solutionSteps: [
            "On any page, press ArrowUp, ArrowUp, ArrowDown, ArrowDown, ArrowLeft, ArrowRight, ArrowLeft, ArrowRight, b, a.",
            "No click needed, it works anywhere on the site.",
            "Watch the construct load, then know kung fu.",
        ],
    },
    {
        id: "there_is_no_spoon",
        title: "There Is No Spoon",
        crypticHint:
            "A boy once warned Neo never to try bending it. Instead, only try to realize a simple truth about it, then say that truth out loud (well, type it) anywhere on a page, as long as you are not inside a form or search box.",
        solutionSteps: [
            "Type there is no spoon anywhere on a page.",
            "Case and spacing do not matter.",
            "Just do not type it inside an input, a textarea or a search box.",
        ],
    },
];

export const kungFuTerminalLines: EasterEggTerminalLines = [
    { text: "loading construct...", delay: 200 },
    { text: "Jujitsu... loaded", delay: 600 },
    { text: "Kempo... loaded", delay: 600 },
    { text: "Tae Kwon Do... loaded", delay: 600 },
    { text: "Drunken Boxing... loaded", delay: 600 },
    { text: "Aikido... loaded", delay: 600 },
    { text: "Judo... loaded", delay: 600 },
    { text: "Wu shu... loaded", delay: 600 },
    { text: "Kung fu... loaded", delay: 600 },
    { text: "I know kung fu.", type: "quote", delay: 800 },
];
