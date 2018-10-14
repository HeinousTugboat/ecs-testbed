import { MutableVector, Vector, isPointlike, Pointlike } from './vector';
import { clamp, invalid } from '.';

export class GridItem<T> {
  public readonly position: MutableVector;
  constructor(x: number, y: number, public readonly item: T) {
    this.position = new MutableVector(x, y);
  }

  get x() {
    return this.position.x;
  }

  get y() {
    return this.position.y;
  }
}

let currentX = 0;
let currentY = 0;
let targetX = 0;
let targetY = 0;

// tslint:disable no-bitwise
export class HashGrid<T> {
  private data: GridItem<T>[][][];
  private offset: number;
  private xSize: number;
  private ySize: number;
  private tempArr: GridItem<T>[] = [];

  constructor(public readonly width: number, public readonly height: number, public readonly bucket: number, initial: GridItem<T>[] = []) {
    this.xSize = width / bucket | 0 + 1;
    this.ySize = height / bucket | 0 + 1;
    this.data = Array(this.xSize).fill([]).map(() => Array(this.ySize).fill([]).map(() => Array()));
    this.offset = this.bucket / 2 | 0;

    initial.forEach(i => this.add(i));
  }

  public getNeighbors(v: Vector) {
    targetX = this.getXIndex(v.x);
    targetY = this.getYIndex(v.y);

    this.tempArr = [];
    for (currentX = targetX - 1; currentX <= targetX + 1; currentX++) {
      if (currentX < 0 || currentX >= this.xSize) {
        continue;
      }

      for (currentY = targetY - 1; currentY <= targetY + 1; currentY++) {
        if (currentY < 0 || currentY >= this.ySize) {
          continue;
        }
        this.data[currentX][currentY].forEach(i => this.tempArr.push(i));
      }
    }

    return [...this.tempArr];
  }

  public move(i: GridItem<T>, v: Vector) {
    ({x: currentX, y: currentY} = i.position);
    const from = this.getBucket(i.position);
    i.position.set(v.x, v.y);

    if (this.getXIndex(v.x) === this.getXIndex(currentX) && this.getYIndex(v.y) === this.getYIndex(currentY)) {
      return;
    }

    this.getBucket(v).push(from.splice(from.findIndex(n => n === i), 1)[0]);
  }

  public add(i: GridItem<T>) {
    this.getBucket(i.position).push(i);
  }

  private getBucket(v: Pointlike) {
    return this.data[this.getXIndex(v.x)][this.getYIndex(v.y)];
  }

  private getXIndex(n: number) {
    return this.getIndex(n, this.xSize);
  }

  private getYIndex(n: number) {
    return this.getIndex(n, this.ySize);
  }

  private getIndex(n: number, dim: number) {
    return clamp((n + this.offset) / this.bucket | 0, 0, dim - 1);
  }
}
