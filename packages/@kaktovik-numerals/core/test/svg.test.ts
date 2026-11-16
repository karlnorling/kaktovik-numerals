import { describe, expect, it } from 'vitest';
import { digitSvg, toSvg } from '../src/index.js';

const attr = (svg: string, name: string) => new RegExp(` ${name}="([^"]*)"`).exec(svg)?.[1];
const strokes = (svg: string) => (attr(svg, 'd') ?? '').split('M').length - 1;

describe('toSvg', () => {
  it('renders one digit 100px tall by default', () => {
    const svg = toSvg(19);
    expect(attr(svg, 'viewBox')).toBe('-20 -20 76 100');
    expect(attr(svg, 'height')).toBe('100');
    expect(svg).toContain('<title>19</title>');
    expect(strokes(svg)).toBe(2);
  });

  it('writes one place per twenty', () => {
    // 20 is 1, 0
    expect(attr(toSvg(20), 'viewBox')).toBe('-20 -20 122 100');
    expect(strokes(toSvg(20))).toBe(2);
  });

  it('puts a dot on the baseline before the fraction', () => {
    const svg = toSvg(0.5);
    expect(svg).toMatch(/<circle cx="[\d.]+" cy="56" r="4.5" fill="currentColor"\/>/);
    expect(svg).toContain('<title>0.5</title>');
  });

  it('starts a negative number with a minus sign', () => {
    const svg = toSvg(-1);
    expect(attr(svg, 'd')).toMatch(/M2 30H22$/);
    expect(attr(svg, 'viewBox')).toBe('-20 -20 108 100');
  });

  it('takes backgrounds and gradients', () => {
    const svg = toSvg(5, { color: 'linear-gradient(red, blue)', background: '#fff' });
    expect(attr(svg, 'stroke')).toMatch(/^url\(#kaktovik-color-\w+\)$/);
    expect(svg).toContain('fill="#fff"');
  });

  it.each([
    [{ size: 0 }, 'size must be positive'],
    [{ strokeWidth: 0 }, 'strokeWidth must be positive'],
  ])('rejects %j', (options, message) => {
    expect(() => toSvg(1, options)).toThrow(message);
  });
});

describe('digitSvg', () => {
  it('draws one digit', () => {
    expect(digitSvg(7)).toContain('<title>7</title>');
    expect(strokes(digitSvg(7))).toBe(2);
  });
});
