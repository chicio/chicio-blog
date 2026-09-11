import { FC, ReactNode } from "react";
import { MatrixRain } from "../../../atoms/effects/matrix-rain/matrix-rain";

interface ContainerFullscreenWithMatrixProps {
    children: ReactNode;
}

export const MatrixBackground: FC<ContainerFullscreenWithMatrixProps> = ({ children }) => (
    <div className="relative flex h-dvh min-h-dvh w-full flex-col items-center justify-center">
        <div className="absolute top-0 left-0 h-full w-full overflow-hidden">
            <MatrixRain />
        </div>
        <div className="relative z-10 flex h-full w-full snap-start flex-col items-center justify-center">
            {children}
        </div>
    </div>
);
