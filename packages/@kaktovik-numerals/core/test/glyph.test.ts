import { describe, expect, it } from 'vitest';
import { CELL_HEIGHT, CELL_WIDTH, digitStrokes } from '../src/index.js';

/** Line segments in a stroke: one fewer than its points. */
const segments = (d: string) => d.split('L').length - 1;
const points = (d: string) =>
  [...d.matchAll(/(-?[\d.]+) (-?[\d.]+)/g)].map((m) => [Number(m[1]), Number(m[2])]);

describe('digitStrokes', () => {
  it('draws zero as one curved stroke, the crossed arms', () => {
    const [zero, ...rest] = digitStrokes(0);
    expect(rest).toEqual([]);
    expect(zero).toMatch(/^M[\d.]+ [\d.]+C/);
  });

  it.each([1, 2, 3, 4])('draws %i as a zigzag of that many strokes', (digit) => {
    const strokes = digitStrokes(digit);
    expect(strokes).toHaveLength(1);
    expect(segments(strokes[0]!)).toBe(digit);
  });

  it.each([
    [5, 1],
    [10, 2],
    [15, 3],
  ])('draws %i as %i strokes across the top', (digit, count) => {
    const [fives] = digitStrokes(digit);
    expect(segments(fives!)).toBe(count);
    expect(Math.max(...points(fives!).map(([, y]) => y!))).toBeLessThanOrEqual(24);
  });

  it('puts the fives above the units', () => {
    const [fives, units] = digitStrokes(19);
    expect(segments(fives!)).toBe(3);
    expect(segments(units!)).toBe(4);
    const lowestFive = Math.max(...points(fives!).map(([, y]) => y!));
    const highestUnit = Math.min(...points(units!).map(([, y]) => y!));
    expect(lowestFive).toBeLessThan(highestUnit);
  });

  it('turns a five a quarter from a one: rising across the top', () => {
    const [start, end] = points(digitStrokes(5)[0]!) as [[number, number], [number, number]];
    const [x1, y1] = start;
    const [x2, y2] = end;
    expect(x2).toBeGreaterThan(x1);
    expect(y2).toBeLessThan(y1);
  });

  it('keeps every digit inside its cell', () => {
    for (let digit = 1; digit < 20; digit++) {
      for (const [x, y] of digitStrokes(digit).flatMap(points)) {
        expect(x).toBeGreaterThanOrEqual(0);
        expect(x).toBeLessThanOrEqual(CELL_WIDTH);
        expect(y).toBeGreaterThanOrEqual(0);
        expect(y).toBeLessThanOrEqual(CELL_HEIGHT);
      }
    }
  });

  it.each([-1, 20, 1.5])('rejects %s', (digit) => {
    expect(() => digitStrokes(digit)).toThrow('0 to 19');
  });
});
