export interface MatrixRainDrawContext {
  font: string
  drops: number[];
  height: number;
  width: number;
  lastFrameTimestamp: number;
  timeDistanceBetweenFrames: number;
  animationFrameId: number;
}