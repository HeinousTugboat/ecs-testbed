import { invalid, Vector, Color, MutableVector } from './utils';

export type CanvasFillStyle = string | CanvasGradient | CanvasPattern;

export class CanvasManager {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private size: MutableVector;

  constructor(canvasId: string, private baseStyle: CanvasFillStyle = Color.WHITE.toString()) {
    const canvas = document.getElementById(canvasId);

    if (invalid(canvas)) {
      throw new Error(`Canvas '#${canvasId}' null or undefined!`);
    }

    if (!(canvas instanceof HTMLCanvasElement)) {
      throw new Error(`Canvas '#${canvasId}' not canvas element!`);
    }

    this.canvas = canvas;
    this.size = new MutableVector(canvas.width, canvas.height);

    const ctx = canvas.getContext('2d');

    if (invalid(ctx)) {
      throw new Error(`Context for '#${canvasId}' null or undefined!`);
    }
    this.ctx = ctx;
  }

  clear() {
    this.ctx.fillStyle = this.baseStyle;
    this.ctx.clearRect(0, 0, this.size.x, this.size.y);
  }

  rect(start: Vector, size: Vector, style: CanvasFillStyle) {
    this.ctx.fillStyle = style;
    this.ctx.fillRect(start.x, start.y, size.x, size.y);
    this.ctx.fillStyle = this.baseStyle;
  }
}
