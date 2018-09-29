export class Vector {
  static zero = new Vector(0, 0);
  static distance(a: Vector, b: Vector) { return a.subtract(b).magnitude; }
  static distSquare(a: Vector, b: Vector) { return a.subtract(b).magSquare; }

  constructor()
  constructor(x: number, y: number)
  constructor(public readonly x = 0, public readonly y = 0) { }
  toString() { return `(${this.x}, ${this.y})`; }

  /* Properties of this vector */
  get magnitude() { return Math.sqrt(this.x ** 2 + this.y ** 2); }
  get magSquare() { return this.x ** 2 + this.y ** 2; }
  get normal() { return new Vector(this.x / this.magnitude, this.y / this.magnitude); }
  get perpY() { return new Vector(-this.y, this.x); }
  get perpX() { return new Vector(this.y, -this.x); }

  /* Boolean methods */
  equals(v: Vector) { return this.y === v.y && this.x === v.x; }
  isOpposite(v: Vector) { return this.normal.dot(v.normal) === -1; }
  isParallel(v: Vector) { return this.normal.equals(v.normal); }
  isPerpendicular(v: Vector) { return this.dot(v) === 0; }

  /* Vector methods */
  add(v: Vector) { return new Vector(this.x + v.x, this.y + v.y); }
  subtract(v: Vector) { return new Vector(this.x - v.x, this.y - v.y); }

  scale(n: number) { return new Vector(this.x * n, this.y * n); }
  rotate(th: number) { return new Vector(Math.cos(th) * this.x - Math.sin(th) * this.y, Math.sin(th) * this.x + Math.cos(th) * this.y); }

  project(v: Vector) { return v.scale(this.dot(v) / v.magSquare); }
  reject(v: Vector) { return v.perpY.scale(Math.abs(this.perpY.dot(v) / v.magSquare)); }

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

  add(v: Vector) { return this.mutate(v, super.add); }
  subtract(v: Vector) { return this.mutate(v, super.subtract); }
  scale(n: number) { return this.mutate(n, super.scale); }
  rotate(th: number) { return this.mutate(th, super.rotate); }
  project(v: Vector) { return this.mutate(v, super.project); }
  reject(v: Vector) { return this.mutate(v, super.reject); }
}
