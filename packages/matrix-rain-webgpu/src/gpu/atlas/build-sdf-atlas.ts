import { ATLAS_LAYER_SIZE, GLYPHS } from './glyph-set';

export type SdfAtlas = {
  data: Uint8Array;
  layerCount: number;
  layerSize: number;
};

// Useful range of the encoded distance, in pixels, each side of the edge.
// Edge maps to byte 127 (= 0.5 normalized); ±SPREAD maps to 0 and 255.
const SPREAD = 8;
const FONT_SCALE = 0.75;
const OFFSET_SENTINEL = 32000;

// Neighbors visited at each pixel — those already processed in the sweep order.
// Listed as (dx, dy) RELATIVE TO THE CURRENT PIXEL.
const FORWARD_NEIGHBORS = [
  { dx: -1, dy: -1 }, // upper-left
  { dx: 0, dy: -1 }, //  above
  { dx: +1, dy: -1 }, // upper-right
  { dx: -1, dy: 0 }, //  left
] as const;

const BACKWARD_NEIGHBORS = [
  { dx: +1, dy: +1 }, // lower-right
  { dx: 0, dy: +1 }, //  below
  { dx: -1, dy: +1 }, // lower-left
  { dx: +1, dy: 0 }, //  right
] as const;

export async function buildSdfAtlas(): Promise<SdfAtlas> {
  const layerSize = ATLAS_LAYER_SIZE;
  const layerCount = GLYPHS.length;
  const data = new Uint8Array(layerCount * layerSize * layerSize);

  const canvas = new OffscreenCanvas(layerSize, layerSize);
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('OffscreenCanvas 2D context unavailable');
  }
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `${Math.floor(layerSize * FONT_SCALE)}px monospace`;

  for (let i = 0; i < layerCount; i++) {
    ctx.clearRect(0, 0, layerSize, layerSize);
    ctx.fillText(GLYPHS[i], layerSize / 2, layerSize / 2);
    const imageData = ctx.getImageData(0, 0, layerSize, layerSize);
    const binary = buildBinaryMask(imageData);
    const signed = computeSignedDistanceTransform(binary, layerSize);
    encodeIntoSlice(signed, data, i * layerSize * layerSize);
  }

  return { data, layerCount, layerSize };
}

function buildBinaryMask(imageData: ImageData): Uint8Array {
  const pixels = imageData.data;
  const alphaChannelPosition = 3;
  const colorChannels = 4;
  const binaryMask = new Uint8Array(pixels.length / 4);
  for (let i = 0; i < binaryMask.length; i++) {
    binaryMask[i] = pixels[i * colorChannels + alphaChannelPosition] >= 128 ? 1 : 0;
  }
  return binaryMask;
}

function computeSignedDistanceTransform(binary: Uint8Array, size: number): Float32Array {
  const distFromInside = computeDistanceTransform(binary, size, 1);
  const distFromOutside = computeDistanceTransform(binary, size, 0);
  const signed = new Float32Array(binary.length);
  for (let i = 0; i < signed.length; i++) {
    // Convention: positive inside, negative outside, zero on the edge.
    signed[i] = binary[i] ? distFromOutside[i] : -distFromInside[i];
  }
  return signed;
}

// 8SSEDT: per-pixel (offsetX, offsetY) = vector from that pixel to its nearest source.
// Forward sweep propagates from above/left; backward sweep from below/right.
function computeDistanceTransform(
  binary: Uint8Array,
  size: number,
  sourceClass: 0 | 1,
): Float32Array {
  const pixelCount = binary.length;
  const offsetX = new Int16Array(pixelCount);
  const offsetY = new Int16Array(pixelCount);

  for (let i = 0; i < pixelCount; i++) {
    if (binary[i] === sourceClass) {
      offsetX[i] = 0;
      offsetY[i] = 0;
    } else {
      offsetX[i] = OFFSET_SENTINEL;
      offsetY[i] = OFFSET_SENTINEL;
    }
  }

  const indexOf = (x: number, y: number) => y * size + x;

  // candidateOffset_me  =  offset_neighbor  -  (me.pos - neighbor.pos)
  // because: source = neighbor.pos + offset_neighbor, and offset_me = source - me.pos.
  function tryPropagate(pixelIndex: number, neighborIndex: number, stepX: number, stepY: number) {
    const candidateOffsetX = offsetX[neighborIndex] - stepX;
    const candidateOffsetY = offsetY[neighborIndex] - stepY;
    const candidateSquared =
      candidateOffsetX * candidateOffsetX + candidateOffsetY * candidateOffsetY;
    const currentSquared =
      offsetX[pixelIndex] * offsetX[pixelIndex] + offsetY[pixelIndex] * offsetY[pixelIndex];
    if (candidateSquared < currentSquared) {
      offsetX[pixelIndex] = candidateOffsetX;
      offsetY[pixelIndex] = candidateOffsetY;
    }
  }

  function propagateFrom(x: number, y: number, neighbors: readonly { dx: number; dy: number }[]) {
    const pixelIndex = indexOf(x, y);
    for (const { dx, dy } of neighbors) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= size || ny >= size) continue;
      // neighbor at (x+dx, y+dy) ⇒ step from neighbor to me is (-dx, -dy).
      tryPropagate(pixelIndex, indexOf(nx, ny), -dx, -dy);
    }
  }

  // Forward sweep: top-left → bottom-right
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      propagateFrom(x, y, FORWARD_NEIGHBORS);
    }
  }

  // Backward sweep: bottom-right → top-left
  for (let y = size - 1; y >= 0; y--) {
    for (let x = size - 1; x >= 0; x--) {
      propagateFrom(x, y, BACKWARD_NEIGHBORS);
    }
  }

  const distances = new Float32Array(pixelCount);
  for (let i = 0; i < pixelCount; i++) {
    distances[i] = Math.sqrt(offsetX[i] * offsetX[i] + offsetY[i] * offsetY[i]);
  }
  return distances;
}

function encodeIntoSlice(signed: Float32Array, target: Uint8Array, offset: number) {
  for (let i = 0; i < signed.length; i++) {
    const normalized = (signed[i] + SPREAD) / (2 * SPREAD);
    const byte = Math.max(0, Math.min(255, Math.round(normalized * 255)));
    target[offset + i] = byte;
  }
}
