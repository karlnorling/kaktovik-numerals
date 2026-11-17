/** Kaktovik numerals count in twenties: each place holds a digit from 0 to 19. */
export const BASE = 20;

/** One digit fills a cell this wide and tall, in viewBox units, with its origin at the top left. */
export const CELL_WIDTH = 36;
export const CELL_HEIGHT = 60;

type Point = readonly [number, number];

const LEFT = 5;
const RIGHT = CELL_WIDTH - 5;
/** The band the fives are drawn in, across the top of the digit. */
const FIVES = { top: 4, bottom: 24 };
/** The band the units hang in, below the fives. */
const UNITS = { top: 22, bottom: 56 };

/**
 * The zigzag for one to four, in a unit square: the first stroke runs down from the top,
 * then each next one turns, back up to just above the middle and down again.
 */
function zigzag(count: number): Point[] {
  const points: Point[] = [[0, 0]];
  for (let i = 1; i <= count; i++) points.push([i / count, i % 2 === 1 ? 1 : 0.35]);
  return points;
}

/**
 * The strokes for one digit from 0 to 19, as SVG path data in a cell `CELL_WIDTH` ×
 * `CELL_HEIGHT` with its origin at the top left. Draw them with a round pen.
 *
 * A digit is fives on top and units below. One to four units are a zigzag of that many
 * strokes; one to three fives are the same zigzag turned a quarter turn and laid across
 * the top, so 5 is a rising stroke and 10 a ">". Zero is a pair of crossed arms.
 */
export function digitStrokes(digit: number): string[] {
  if (!Number.isInteger(digit) || digit < 0 || digit >= BASE) {
    throw new RangeError(`A Kaktovik digit runs from 0 to 19, got ${digit}`);
  }
  if (digit === 0) return [ZERO];
  const fives = Math.floor(digit / 5);
  const units = digit % 5;
  const strokes: string[] = [];
  if (fives > 0) {
    // A quarter turn anticlockwise: across becomes up, down becomes across.
    strokes.push(
      path(
        zigzag(fives).map(([u, v]) => [
          LEFT + v * (RIGHT - LEFT),
          FIVES.bottom - u * (FIVES.bottom - FIVES.top),
        ]),
      ),
    );
  }
  if (units > 0) {
    const top = fives > 0 ? UNITS.top + 4 : UNITS.top - 6;
    strokes.push(
      path(
        zigzag(units).map(([u, v]) => [LEFT + u * (RIGHT - LEFT), top + v * (UNITS.bottom - top)]),
      ),
    );
  }
  return strokes;
}

function path(points: Point[]): string {
  return points.map(([x, y], i) => `${i ? 'L' : 'M'}${round(x)} ${round(y)}`).join('');
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

/** Crossed arms: two strokes that cross near the top and meet in a loop at the bottom. */
const ZERO = 'M7 25C14 30 23 38 22 47C21 55 12 55 11 47C10 38 20 30 29 25';
