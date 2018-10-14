import { invalid, Vector, Color, MutableVector } from './utils';
import { fromEvent, interval, Observable, BehaviorSubject } from 'rxjs';
import { throttle } from 'rxjs/operators';
import { animationFrame } from 'rxjs/internal/scheduler/animationFrame';

export type CanvasFillStyle = string | CanvasGradient | CanvasPattern;

let path: Path2D | undefined;
let color: Color;

export class CanvasManager {
  private canvas: HTMLCanvasElement;
  private count: HTMLSpanElement;
  private ctx: CanvasRenderingContext2D;
  private size: MutableVector;
  private strokeBuffer: Map<Color, Path2D> = new Map<Color, Path2D>();
  private fillBuffer: Map<Color, Path2D> = new Map<Color, Path2D>();
  private resizeEmitter: BehaviorSubject<Vector>;
  public resize$: Observable<Vector>;

  constructor(canvasId: string, private baseStyle: CanvasFillStyle = Color.WHITE.toString()) {
    const canvas = document.getElementById(canvasId);
    const count = document.getElementById('count');

    if (invalid(canvas)) {
      throw new Error(`Canvas '#${canvasId}' null or undefined!`);
    }

    if (!(canvas instanceof HTMLCanvasElement)) {
      throw new Error(`Canvas '#${canvasId}' not canvas element!`);
    }

    if (invalid(count)) {
      throw new Error(`Count element null or undefined!`);
    }

    if (!(count instanceof HTMLSpanElement)) {
      throw new Error(`Count not span element!`);
    }

    this.canvas = canvas;
    this.count = count;
    this.size = new MutableVector(canvas.width, canvas.height);

    const ctx = canvas.getContext('2d');

    if (invalid(ctx)) {
      throw new Error(`Context for '#${canvasId}' null or undefined!`);
    }
    this.ctx = ctx;
    this.ctx.lineWidth = 2;
    this.resizeEmitter = new BehaviorSubject(this.size.toVector());
    this.resize$ = this.resizeEmitter.asObservable();

    fromEvent<UIEvent>(window, 'resize').pipe(
      throttle(() => interval(20, animationFrame))
    ).subscribe(this.resize.bind(this));

    this.resize();
  }

  private resize() {
    this.canvas.height = window.innerHeight;
    this.canvas.width = window.innerWidth;
    this.size.set(this.canvas.width, this.canvas.height);
    this.resizeEmitter.next(this.size);
  }

  get width(): number {
    return this.canvas.width;
  }

  get height(): number {
    return this.canvas.height;
  }

  dot(dotColor: Color, center: Vector, size: Vector) {
    path = this.fillBuffer.get(dotColor);
    if (invalid(path)) {
      path = new Path2D;
      this.fillBuffer.set(dotColor, path);
    }

    path.moveTo(center.x, center.y);
    path.arc(center.x, center.y, size.magnitude, 0, 2 * Math.PI);
  }

  line(lineColor: Color, start: Vector, end: Vector) {
    path = this.strokeBuffer.get(lineColor);
    if (invalid(path)) {
      path = new Path2D;
      this.strokeBuffer.set(lineColor, path);
    }

    path.moveTo(start.x, start.y);
    path.lineTo(end.x, end.y);
  }

  rect(rectColor: Color, start: Vector, size: Vector) {
    path = this.fillBuffer.get(rectColor);
    if (invalid(path)) {
      path = new Path2D;
      this.fillBuffer.set(rectColor, path);
    }

    path.rect(start.x, start.y, size.x, size.y);
  }

  render() {
    this.ctx.save();

    for ([color, path] of this.strokeBuffer) {
      this.ctx.strokeStyle = color.toString();
      this.ctx.stroke(path);
    }

    for ([color, path] of this.fillBuffer) {
      this.ctx.fillStyle = color.toString();
      this.ctx.fill(path);
    }

    this.ctx.restore();
  }

  tick(count?: string) {
    for ([color] of this.strokeBuffer) {
      this.strokeBuffer.set(color, new Path2D);
    }

    for ([color] of this.fillBuffer) {
      this.fillBuffer.set(color, new Path2D);
    }

    this.ctx.clearRect(0, 0, this.size.x, this.size.y);

    if (!invalid(count)) {
      this.count.innerHTML = count;
    }
  }
}
