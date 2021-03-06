export * from './vector';
export * from './line';

export function invalid<T>(o: T | undefined | null): o is undefined | null {
  return o === undefined || o === null;
}

export function ready(cb: () => void) {
  if (document.readyState !== 'loading') {
    cb();
  } else {
    document.addEventListener('DOMContentLoaded', cb);
  }
}

export function clamp(n: number, min: number, max: number): number {
  return Math.min(Math.max(n, min), max);
}

export function guard<T, R extends T>(
  r: (value: T) => value is R,
  message?: string
): (value: T) => R {
  return value => {
    if (r(value)) {
      return value;
    }
    throw new Error(message || 'Guard rejection.');
  };
}

export class Color {
  static WHITE = new Color(255, 255, 255);
  static BLACK = new Color(0, 0, 0);
  static LIGHT_BLUE = new Color(0x99, 0xAA, 0xFF);
  static GREEN = new Color(0x00, 0xFF, 0x00);
  static BLUE = new Color(0x00, 0x00, 0xFF);
  static RED = new Color(0xFF, 0x00, 0x00);
  static GRAY = new Color(0x77, 0x77, 0x77);

  private colors = new Uint8ClampedArray(3);
  private str = '';

  constructor(rgb: string)
  constructor(r: number, g: number, b: number)
  constructor(r: number | string, g?: number, b?: number) {
    if (typeof r === 'string') {
      const [, ...chars] = [...r];
      this.colors[0] = parseInt(chars[0] + chars[1], 16);
      this.colors[1] = parseInt(chars[2] + chars[3], 16);
      this.colors[2] = parseInt(chars[4] + chars[5], 16);
    } else {
      this.colors[0] = r || 0;
      this.colors[1] = g || 0;
      this.colors[2] = b || 0;
    }
    this.updateString();
  }

  get r() { return this.colors[0]; }
  get g() { return this.colors[1]; }
  get b() { return this.colors[2]; }

  set r(color: number) { this.colors[0] = color; this.updateString(); }
  set g(color: number) { this.colors[1] = color; this.updateString(); }
  set b(color: number) { this.colors[2] = color; this.updateString(); }

  private updateString() {
    this.str = this.colors.reduce((str, color) => str += color.toString(16).padStart(2, '0'), '#').toUpperCase();
  }

  toString() {
    return this.str;
  }
}
