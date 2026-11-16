/**
 * Moves and scales an SVG path written with absolute commands (M L H V C Q A Z), so signs
 * can be placed without a transform. A transform would also move a gradient's coordinate
 * space, and the gradient should span the whole image.
 */
export function placePath(d: string, dx: number, dy: number, scale: number): string {
  const tokens = d.match(/[MLHVCQAZ]|-?\d*\.?\d+(?:e-?\d+)?/gi) ?? [];
  const out: string[] = [];
  let command = '';
  let i = 0;
  const next = () => Number(tokens[i++]);
  const x = () => round(dx + next() * scale);
  const y = () => round(dy + next() * scale);
  const len = () => round(next() * scale);
  while (i < tokens.length) {
    if (/[A-Z]/i.test(tokens[i]!)) {
      command = tokens[i++]!;
      if (command !== command.toUpperCase())
        throw new Error(`Relative commands aren't supported: ${command}`);
      out.push(command);
      if (command === 'Z') continue;
    }
    switch (command) {
      case 'M':
      case 'L':
        out.push(`${x()} ${y()}`);
        break;
      case 'H':
        out.push(`${x()}`);
        break;
      case 'V':
        out.push(`${y()}`);
        break;
      case 'C':
        out.push(`${x()} ${y()} ${x()} ${y()} ${x()} ${y()}`);
        break;
      case 'Q':
        out.push(`${x()} ${y()} ${x()} ${y()}`);
        break;
      case 'A':
        out.push(`${len()} ${len()} ${next()} ${next()} ${next()} ${x()} ${y()}`);
        break;
      default:
        throw new Error(`Unexpected path data: ${tokens[i]}`);
    }
  }
  return out.join('').replace(/([A-Z]) /g, '$1');
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}
