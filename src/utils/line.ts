import { Vector } from './vector';

export class Line {
  static fromPoints(a: Vector, b: Vector) {
      return new Line(a, b.subtract(a));
  }

  constructor(public point: Vector = Vector.zero, public direction: Vector) { }

  distance(a: Vector): number {return this.point.subtract(a).reject(this.direction).magnitude; }
  distSqr(a: Vector): number {return this.point.subtract(a).reject(this.direction).magSquare; }
}
