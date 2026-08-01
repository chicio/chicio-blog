import { Matrix2DCanvas } from "chicio-blog";

// Matrix2DCanvas paints into a canvas that is absolutely positioned at inset 0, so it only shows up
// inside a sized, relatively-positioned host — the same shape MatrixRain gives it in the app.
export const Default = () => (
    <div className="relative h-64 w-full overflow-hidden">
        <Matrix2DCanvas fontSize={20} density={0.95} paused={false} />
    </div>
);

export const Overload = () => (
    <div className="relative h-64 w-full overflow-hidden">
        <Matrix2DCanvas fontSize={12} density={0.82} paused={false} />
    </div>
);

export const Paused = () => (
    <div className="relative h-64 w-full overflow-hidden">
        <Matrix2DCanvas fontSize={16} density={0.9} paused />
    </div>
);
