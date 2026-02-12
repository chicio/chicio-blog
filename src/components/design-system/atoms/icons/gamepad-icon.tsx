import { FC } from 'react';

/**
 * Gamepad icon component in Matrix style
 * 
 * @author Fabrizio Duroni
 */

interface GamepadIconProps {
    size?: number;
    className?: string;
}

export const GamepadIcon: FC<GamepadIconProps> = ({ size = 120, className = '' }) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* Controller body */}
            <rect
                x="20"
                y="45"
                width="80"
                height="35"
                rx="8"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
            />
            
            {/* D-pad vertical */}
            <rect
                x="35"
                y="55"
                width="8"
                height="20"
                fill="currentColor"
            />
            
            {/* D-pad horizontal */}
            <rect
                x="29"
                y="61"
                width="20"
                height="8"
                fill="currentColor"
            />
            
            {/* Button A */}
            <circle
                cx="85"
                cy="60"
                r="5"
                fill="currentColor"
            />
            
            {/* Button B */}
            <circle
                cx="75"
                cy="65"
                r="5"
                fill="currentColor"
            />
        </svg>
    );
};
