import { MatrixRain } from "@/components/design-system/atoms/effects/matrix-rain";
import { MatrixTerminal } from "@/components/design-system/molecules/effects/matrix-terminal";
import { BluePillLink, RedPillLink } from "@/components/design-system/molecules/links/pills-links";
import { tracking } from "@/types/tracking";

const terminalLines = [
  { text: "Scanning the Matrix...", delay: 600 },
  { text: "Accessing page...", delay: 700 },
  { text: "ERROR 404: Page not found", type: "error" as const, delay: 900 },
  { text: "This is your last chance...", type: "quote" as const, delay: 1200 },
];

export default function notFoundPage() {
  return (
    <div className="container-fullscreen text-accent-color relative min-h-screen overflow-hidden bg-black">
      <MatrixRain fontSize={14} density={0.975} />
      <div className="relative z-10 flex flex-col items-center justify-center gap-2 p-2">
        <h1 className="heading animate-glitch text-accent glow-text text-[72px] font-bold sm:text-[100px]">
          404
        </h1>
        <MatrixTerminal lines={terminalLines} />
        <div className="flex flex-row gap-4 mt-3">
          <BluePillLink
            to="/"
            trackingData={{
              category: tracking.category.notfound,
              label: tracking.label.body,
              action: tracking.action.blue_pill,
            }}
          >
            Stay asleep
          </BluePillLink>
          <RedPillLink
            to="/blog"
            trackingData={{
              category: tracking.category.notfound,
              label: tracking.label.body,
              action: tracking.action.red_pill,
            }}
          >
            Wake up!
          </RedPillLink>
        </div>
      </div>
    </div>
  );
}
