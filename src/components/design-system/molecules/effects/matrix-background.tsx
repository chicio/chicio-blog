import { FC, ReactNode } from "react";
import { MatrixRain } from "../../atoms/effects/matrix-rain";

interface ContainerFullscreenWithMatrixProps {
  children: ReactNode;
  fontSize?: number;
  density?: number;
}

export const MatrixBackground: FC<ContainerFullscreenWithMatrixProps> = ({
  children,
  fontSize = 16,
  density = 0.95
}) => (
  <div className="relative flex flex-col justify-center items-center h-dvh min-h-dvh w-full">
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
      <MatrixRain fontSize={fontSize} density={density} />
    </div>
    <div className="relative z-10 flex flex-col justify-center items-center h-full w-full snap-start">
      {children}
    </div>
  </div>
);
