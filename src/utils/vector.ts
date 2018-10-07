import { clamp } from '.';

export class Vector {
  static zero = new Vector(0, 0);

  static distance(a: Vector, b: Vector) { return a.subtract(b).magnitude; }
  static distSquare(a: Vector, b: Vector) { return a.subtract(b).magSquare; }
  static lerp(a: Vector, b: Vector, t: number) { return new Vector(a.x + t * (b.x - a.x), a.y + t * (b.y - a.y)); }
  static isVector(v: any): v is Vector { return !isNaN(parseFloat(v.x)) && !isNaN(parseFloat(v.y)); }
  static copy(v: Vector) { return new Vector(v.x, v.y); }

  constructor(public readonly x: number = 0, public readonly y: number = 0) { }
  toString() { return `(${this.x}, ${this.y})`; }

  /* Properties of this vector */
  get magnitude() { return Math.sqrt(this.x ** 2 + this.y ** 2); }
  get magSquare() { return this.x ** 2 + this.y ** 2; }
  get normal() { return new Vector(this.x / this.magnitude || 0, this.y / this.magnitude || 0); }
  get perpX() { return new Vector(this.y, -this.x); }
  get perpY() { return new Vector(-this.y, this.x); }

  /* Boolean methods */
  equals(v: Vector) { return Math.abs(this.y - v.y) < Number.EPSILON && Math.abs(this.x - v.x) < Number.EPSILON; }
  isOpposite(v: Vector) { return this.normal.dot(v.normal) === -1; }
  isParallel(v: Vector) { return this.normal.equals(v.normal); }
  isPerpendicular(v: Vector) { return this.dot(v) === 0; }
  isWithin(min: Vector, max: Vector) { return this.x >= min.x && this.x <= max.x && this.y >= min.y && this.y <= max.y; }

  /* Vector methods */
  add(v: Vector) { return new Vector(this.x + v.x, this.y + v.y); }
  subtract(v: Vector) { return new Vector(this.x - v.x, this.y - v.y); }

  scale(n: number) { return new Vector(this.x * n, this.y * n); }
  rotate(th: number) { return new Vector(Math.cos(th) * this.x - Math.sin(th) * this.y, Math.sin(th) * this.x + Math.cos(th) * this.y); }

  project(v: Vector) { return v.scale(this.dot(v) / v.magSquare); }
  reject(v: Vector) { return v.perpY.scale(Math.abs(this.perpY.dot(v) / v.magSquare)); }

  copy() { return new Vector(this.x, this.y); }

  clamp(min: Vector, max: Vector) {
    return new Vector(clamp(this.x, min.x, max.x), clamp(this.y, min.y, max.y));
  }

  clampMag(min: number, max: number) {
    return this.normal.scale(clamp(this.magnitude, min, max));
  }

  /* number methods */
  dot(v: Vector) { return this.x * v.x + this.y * v.y; }
  pdot(v: Vector) { return this.perpY.dot(v); }

  angle(v: Vector) { return Math.acos(this.dot(v) / Math.sqrt(this.magSquare * v.magSquare)); }
  // angle(v: Vector2) { return Math.acos(this.dot(v) / (this.magnitude * v.magnitude)); }

  pangle(v: Vector) { return Math.asin(this.perpY.dot(v) / Math.sqrt(this.magSquare * v.magSquare)); }
  // pangle(v: Vector2) { return Math.asin(this.perpY.dot(v) / (this.magnitude * v.magnitude ));}
}

export class MutableVector extends Vector {
  constructor(public x: number, public y: number) {
    super(x, y);
  }

  private mutate<V extends Vector, X>(v: X, op: (x: X) => V) {
    const result = op.call(this, v);
    this.x = result.x;
    this.y = result.y;
    return this;
  }

  // add(v: Vector) { return this.mutate(v, super.add); }
  add(v: Vector) {
    this.x = this.x + v.x;
    this.y = this.y + v.y;
    return this;
  }
  // subtract(v: Vector) { return this.mutate(v, super.subtract); }
  subtract(v: Vector) {
    this.x = this.x - v.x;
    this.y = this.y - v.y;
    return this;
  }

  // scale(n: number) { return this.mutate(n, super.scale); }
  scale(n: number) {
    this.x = this.x * n;
    this.y = this.y * n;
    return this;
  }

  rotate(th: number) { return this.mutate(th, super.rotate); }

  setV(v: Vector): this {
    this.x = v.x;
    this.y = v.y;
    return this;
  }

  set(x: number, y: number): this {
    this.x = x;
    this.y = y;
    return this;
  }

  copy(): MutableVector { return new MutableVector(this.x, this.y); }
  toVector(): Vector { return new Vector(this.x, this.y); }

  normalize(): MutableVector {
    const n = this.normal;
    this.x = n.x;
    this.y = n.y;
    return this;
  }

  clampMag(min: number, max: number): MutableVector {
    const c = super.clampMag.call(this, min, max);
    this.x = c.x;
    this.y = c.y;
    return this;
  }

  // I'm not sure these make sense for a mutable vector.
  // project(v: Vector) { return this.mutate(v, super.project); }
  // reject(v: Vector) { return this.mutate(v, super.reject); }
}
