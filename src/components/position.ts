import { Component, System } from '../ecs';
import { MutableVector as MVector, Vector } from '../utils';
import { HashGrid, GridItem } from '../utils/hash-grid';
import { CanvasManager } from '../canvas';

export class PositionComponent extends Component {
  position: MVector = new MVector(0, 0);
  gridLocation = new GridItem(0, 0, this);
  constructor(public readonly entityId: number) {
    super(entityId);
    PositionSystem.grid.add(this.gridLocation);
  }

  add(v: Vector) {
    this.position.add(v);
    PositionSystem.grid.move(this.gridLocation, this.position);
  }

  get x() {
    return this.position.x;
  }

  set x(x: number) {
    this.position.x = x;
    PositionSystem.grid.move(this.gridLocation, this.position);
  }

  get y() {
    return this.position.y;
  }

  set y(y: number) {
    this.position.y = y;
    PositionSystem.grid.move(this.gridLocation, this.position);
  }
}

export class PositionSystem extends System<[PositionComponent]> {
  static grid: HashGrid<PositionComponent> = new HashGrid(10, 10, 10);
  constructor(private canvas: CanvasManager, private bucket: number) {
    super('position', [PositionComponent]);
    canvas.resize$.subscribe(this.resize.bind(this));
    PositionSystem.grid = new HashGrid<PositionComponent>(canvas.width, canvas.height, bucket);
  }
  resize(size: Vector) {
    PositionSystem.grid = new HashGrid<PositionComponent>(size.x, size.y, this.bucket);
    this.entities.forEach(([{gridLocation}]) => PositionSystem.grid.add(gridLocation));
  }
  update() { }
}
