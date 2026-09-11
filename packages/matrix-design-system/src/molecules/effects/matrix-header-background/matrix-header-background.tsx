import { FC } from "react";
import { MatrixRain } from "../../../atoms/effects/matrix-rain/matrix-rain";

interface MatrixHeaderBackgroundProps {
    big: boolean;
}

export const MatrixHeaderBackground: FC<MatrixHeaderBackgroundProps> = ({ big }) => {
    const height = big ? "h-[350px] sm:h-[400px] md:h-[500px]" : "h-[240px] sm:h-[250px] md:h-[270px]";

    return (
        <div
            className={`absolute -z-10 ${height} border-accent top-0 right-0 left-0 overflow-hidden border-b-2 border-solid shadow-lg`}
        >
            <div className="remove-scroll-width absolute top-0 right-0 bottom-0 left-0">
                <MatrixRain />
            </div>
        </div>
    );
};
