import { Vector } from './vector';

export class Line {
  static fromPoints(a: Vector, b: Vector) {
    return new Line(a, b.subtract(a));
  }

  constructor(public point: Vector = Vector.zero, public direction: Vector) { }

  distance(a: Vector): number { return this.point.subtract(a).reject(this.direction).magnitude; }
  distSqr(a: Vector): number { return this.point.subtract(a).reject(this.direction).magSquare; }

  areOnSameSide(a: Vector, b: Vector): boolean {
    const v1 = a.subtract(this.point);
    const v2 = b.subtract(this.point);

    return this.direction.pdot(v1) * this.direction.pdot(v2) > 0;
  }

  outerProduct(v: Vector) {
    return (v.x - this.point.x) * (this.point.add(this.direction).y - this.point.y)
      - (v.y - this.point.y) * (this.point.add(this.direction).x - this.point.x);
  }
}
