import { MatrixRain } from "@/components/design-system/atoms/effects/matrix-rain";
import { MatrixTerminal } from "@/components/design-system/molecules/effects/matrix-terminal";
import { MatrixChoice } from "@/components/design-system/molecules/buttons/matrix-choice";
import { tracking } from "@/types/tracking";

const terminalLines = [
  { text: "Scanning the Matrix...", delay: 600 },
  { text: "Accessing page...", delay: 700 },
  { text: "ERROR 404: Page not found", type: "error" as const, delay: 900 },
  { text: "This is your last chance...", type: "quote" as const, delay: 1200 },
];

export default function notFoundPage() {
  return (
    <div className="container-fullscreen min-h-screen relative bg-black text-accent-color overflow-hidden">
      <MatrixRain fontSize={14} density={0.975} />
      <div className="relative z-10 flex flex-col items-center justify-center gap-2 p-2">
        <h1 className="heading animate-glitch text-accent font-bold text-[72px] sm:text-[100px] glow-text">
          404
        </h1>
        <MatrixTerminal lines={terminalLines} />
        <MatrixChoice
          redPillHref="/blog"
          bluePillHref="/"
          redPillText="Wake up!"
          bluePillText="Stay asleep"
          trackingCategory={tracking.category.notfound}
          trackingLabel={tracking.label.body}
        />
      </div>
    </div>
  );
}
