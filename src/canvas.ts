import { invalid, Vector, Color, MutableVector } from './utils';

export type CanvasFillStyle = string | CanvasGradient | CanvasPattern;

export class CanvasManager {
  private ctx: CanvasRenderingContext2D;
  private size: MutableVector;
  private strokeBuffer: Map<Color, Path2D> = new Map<Color, Path2D>();
  private fillBuffer: Map<Color, Path2D> = new Map<Color, Path2D>();

  constructor(canvasId: string, private baseStyle: CanvasFillStyle = Color.WHITE.toString()) {
    const canvas = document.getElementById(canvasId);

    if (invalid(canvas)) {
      throw new Error(`Canvas '#${canvasId}' null or undefined!`);
    }

    if (!(canvas instanceof HTMLCanvasElement)) {
      throw new Error(`Canvas '#${canvasId}' not canvas element!`);
    }

    this.size = new MutableVector(canvas.width, canvas.height);

    const ctx = canvas.getContext('2d');

    if (invalid(ctx)) {
      throw new Error(`Context for '#${canvasId}' null or undefined!`);
    }
    this.ctx = ctx;
    this.ctx.lineWidth = 2;
  }

  dot(color: Color, center: Vector, size: Vector) {
    let path = this.fillBuffer.get(color);
    if (invalid(path)) {
      path = new Path2D;
      this.fillBuffer.set(color, path);
    }

    path.moveTo(center.x, center.y);
    path.arc(center.x, center.y, size.magnitude, 0, 2 * Math.PI);
  }

  line(color: Color, start: Vector, end: Vector) {
    let path = this.strokeBuffer.get(color);
    if (invalid(path)) {
      path = new Path2D;
      this.strokeBuffer.set(color, path);
    }

    path.moveTo(start.x, start.y);
    path.lineTo(end.x, end.y);
  }

  rect(color: Color, start: Vector, size: Vector) {
    let path = this.fillBuffer.get(color);
    if (invalid(path)) {
      path = new Path2D;
      this.fillBuffer.set(color, path);
    }

    path.rect(start.x, start.y, size.x, size.y);
  }

  render() {
    this.ctx.save();

    for (const [color, path] of this.strokeBuffer) {
      this.ctx.strokeStyle = color.toString();
      this.ctx.stroke(path);
    }

    for (const [color, path] of this.fillBuffer) {
      this.ctx.fillStyle = color.toString();
      this.ctx.fill(path);
    }

    this.ctx.restore();
  }

  tick() {
    for (const [color] of this.strokeBuffer) {
      this.strokeBuffer.set(color, new Path2D);
    }

    for (const [color] of this.fillBuffer) {
      this.fillBuffer.set(color, new Path2D);
    }

    this.ctx.clearRect(0, 0, this.size.x, this.size.y);
  }
}
