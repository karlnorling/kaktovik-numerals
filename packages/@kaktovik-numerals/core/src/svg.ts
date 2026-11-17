import { CELL_HEIGHT, CELL_WIDTH, digitStrokes } from './glyph.js';
import { format, parse } from './number.js';
import { escapeAttr as escape, num, resolvePaint, type Paint } from './paint.js';
import type { NumberInput } from './parse.js';
import { placePath } from './path.js';

export interface SvgOptions {
  /** Height of the image in pixels. The width follows from the number of places. Default 100. */
  size?: number;
  /**
   * Stroke colour. Default `currentColor`, so the SVG takes the surrounding text colour.
   * Also takes a CSS gradient such as `linear-gradient(to right, gold, crimson)`, or a
   * gradient object.
   */
  color?: Paint;
  /** Fills the image behind the numeral: a colour or a gradient. Default: transparent. */
  background?: Paint;
  /** Stroke width in viewBox units, where a digit is 60 tall. Default 4.5. */
  strokeWidth?: number;
  /** Space between places in viewBox units. Default 10. */
  gap?: number;
  /** Space around the numeral in viewBox units. Default 20. */
  padding?: number;
  /**
   * Accessible name, rendered as `<title>`. Defaults to the number written in decimal.
   * Pass `false` to leave it out and hide the image from assistive technology.
   */
  title?: string | false;
}

const MINUS = { width: 22, gap: 10 };

/**
 * Renders a number as an SVG string of Kaktovik numerals.
 *
 * Places run left to right in base 20, most significant first. A dot on the baseline
 * marks the point before the fraction, which continues in base 20, and a negative number
 * starts with a minus sign.
 */
export function toSvg(value: NumberInput, options: SvgOptions = {}): string {
  const number = parse(value);
  const { gap = 10, strokeWidth = 4.5 } = options;
  const digits = [...number.integer, ...number.fraction];
  const paths: string[] = [];
  let x = number.negative ? MINUS.width + MINUS.gap : 0;
  let dot: number | undefined;
  digits.forEach((digit, i) => {
    if (i === number.integer.length) {
      x += gap / 2 + strokeWidth;
      dot = x;
      x += strokeWidth + gap / 2;
    } else if (i > 0) {
      x += gap;
    }
    for (const d of digitStrokes(digit)) paths.push(placePath(d, x, 0, 1));
    x += CELL_WIDTH;
  });
  if (number.negative) paths.push(`M2 ${CELL_HEIGHT / 2}H${MINUS.width}`);
  return render(paths, x, dot, options, format(number));
}

/** One digit from 0 to 19 on its own. `place` is unused here. */
export function digitSvg(digit: number, _place = 0, options: SvgOptions = {}): string {
  return render(digitStrokes(digit), CELL_WIDTH, undefined, options, String(digit));
}

function render(
  paths: string[],
  width: number,
  dot: number | undefined,
  options: SvgOptions,
  defaultTitle: string,
): string {
  const {
    size = 100,
    color = 'currentColor',
    background,
    strokeWidth = 4.5,
    padding = 20,
  } = options;
  if (!(size > 0)) throw new RangeError(`size must be positive, got ${size}`);
  if (!(strokeWidth > 0)) throw new RangeError(`strokeWidth must be positive, got ${strokeWidth}`);
  const title = options.title ?? defaultTitle;

  const box = {
    x: -padding,
    y: -padding,
    width: width + 2 * padding,
    height: CELL_HEIGHT + 2 * padding,
  };
  const paint = resolvePaint(color, box, 'kaktovik-color');
  const fill =
    background === undefined ? undefined : resolvePaint(background, box, 'kaktovik-background');
  const defs = [...new Set([fill?.def, paint.def].filter(Boolean))].join('');
  const p = escape(paint.value);

  const pixelWidth = (size * box.width) / box.height;
  const label = title === false ? 'aria-hidden="true"' : `role="img" aria-label="${escape(title)}"`;
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${[box.x, box.y, box.width, box.height].map(num).join(' ')}" width="${num(pixelWidth)}" height="${num(size)}" ${label}>`,
    title === false ? '' : `<title>${escape(title)}</title>`,
    defs ? `<defs>${defs}</defs>` : '',
    fill === undefined
      ? ''
      : `<rect x="${num(box.x)}" y="${num(box.y)}" width="${num(box.width)}" height="${num(box.height)}" fill="${escape(fill.value)}"/>`,
    `<path d="${paths.join('')}" fill="none" stroke="${p}" stroke-width="${num(strokeWidth)}" stroke-linecap="round" stroke-linejoin="round"/>`,
    dot === undefined
      ? ''
      : `<circle cx="${num(dot)}" cy="${CELL_HEIGHT - 4}" r="${num(strokeWidth)}" fill="${p}"/>`,
    '</svg>',
  ].join('');
}
