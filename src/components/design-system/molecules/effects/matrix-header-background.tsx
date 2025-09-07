import { FC } from "react";
import { MatrixRain } from "../../atoms/effects/matrix-rain";

interface MatrixHeaderBackgroundProps {
  big: boolean;
}

export const MatrixHeaderBackground: FC<MatrixHeaderBackgroundProps> = ({ big }) => {
  const height = big ? "h-[350px] sm:h-[400px] md:h-[500px]" : "h-[220px] sm:h-[230px] md:h-[250px]";

  return (
    <div className={`absolute ${height} top-0 left-0 right-0 z-0 overflow-hidden border-b-2 border-solid border-accent shadow-lg`}>
      <div className="absolute top-0 left-0 right-0 bottom-0 z-0 remove-scroll-width">
        <MatrixRain fontSize={14} density={0.95} />
      </div>
    </div>
  );
};
