import { Component, System, Entity } from '../ecs';
import { Vector, MutableVector, invalid, clamp } from '../utils';
import { PositionComponent } from './position';
import { CanvasManager } from '../canvas';

export class VelocityComponent extends Component {
  velocity: MutableVector = new MutableVector(0, 0);
  acceleration: MutableVector = new MutableVector(0, 0);
  maxSpeed = 120;
}

const r = 5.0;
let position: PositionComponent | undefined;
let velocity: VelocityComponent | undefined;
let normal: Vector;

export type VelocityComponents = [PositionComponent, VelocityComponent];

export class VelocitySystem extends System<VelocityComponents> {
  private size: MutableVector;

  constructor(private canvas: CanvasManager) {
    super('velocity', [PositionComponent, VelocityComponent]);
    this.size = new MutableVector(canvas.width, canvas.height);
    canvas.resize$.subscribe(this.resize.bind(this));
  }

  private resize(size: Vector) {
    this.size.setV(size);
  }

  update(components: VelocityComponents, dT: number) {
    [position, velocity] = components;

    velocity.velocity.add(velocity.acceleration);
    velocity.velocity.clampMag(0, velocity.maxSpeed);
    velocity.velocity.scale(0.999);
    position.add(velocity.velocity.toVector().scale(dT / 1000));

    velocity.acceleration.set(0, 0);

    // if (!position.position.isWithin(this.minBoundary, this.maxBoundary)) {

    // }

    // Wrapped borders
    // if (position.position.x < -r) { position.position.x = width + r; }
    // if (position.position.y < -r) { position.position.y = height + r; }
    // if (position.position.x > width + r) { position.position.x = -r; }
    // if (position.position.y > height + r) { position.position.y = -r; }

    // Bouncing borders
    if (position.x > this.size.x - r || position.x < r) {
      normal = new Vector(this.size.x - r - position.x, 0).normal;
      velocity.velocity.subtract(normal.scale(2 * velocity.velocity.dot(normal))).scale(1.1);
      position.x = clamp(position.x, r, this.size.x - r);

      if (position.x > this.size.x - 3 * r || position.x < 3 * r) {
        velocity.acceleration.add(normal.scale(velocity.maxSpeed));
      }
    }

    if (position.y > this.size.y - r || position.y < r) {
      normal = new Vector(0, this.size.y - r - position.y).normal;
      velocity.velocity.subtract(normal.scale(2 * velocity.velocity.dot(normal))).scale(1.1);
      position.y = clamp(position.y, r, this.size.y - r);
      velocity.acceleration.add(normal);

      if (position.x > this.size.x - 3 * r || position.x < 3 * r) {
        velocity.acceleration.add(normal.scale(velocity.maxSpeed));
      }
    }

  }
}
