import { Component, System, Entity } from '../ecs';
import { Vector, MutableVector, invalid, clamp } from '../utils';
import { PositionComponent } from './position';

export class VelocityComponent extends Component {
  velocity: MutableVector = new MutableVector(0, 0);
  acceleration: MutableVector = new MutableVector(0, 0);
  maxSpeed = 120;
}

const width = 800;
const height = 600;
const r = 5.0;
let position: PositionComponent | undefined;
let velocity: VelocityComponent | undefined;
let normal: Vector;

export class VelocitySystem extends System {
  constructor(private minBoundary: Vector, private maxBoundary: Vector) {
    super('velocity', [PositionComponent, VelocityComponent]);
  }

  update(entity: Entity, dT: number) {
    position = entity.get(PositionComponent);
    velocity = entity.get(VelocityComponent);

    if (invalid(position) || invalid(velocity)) {
      return;
    }

    velocity.velocity.add(velocity.acceleration);
    velocity.velocity.clampMag(0, velocity.maxSpeed);
    velocity.velocity.scale(0.999);
    position.position.add(velocity.velocity.toVector().scale(dT / 1000));

    velocity.acceleration.set(0, 0);

    // if (!position.position.isWithin(this.minBoundary, this.maxBoundary)) {

    // }

    // Wrapped borders
    // if (position.position.x < -r) { position.position.x = width + r; }
    // if (position.position.y < -r) { position.position.y = height + r; }
    // if (position.position.x > width + r) { position.position.x = -r; }
    // if (position.position.y > height + r) { position.position.y = -r; }

    // Bouncing borders
    if (position.position.x > width - r || position.position.x < r) {
      normal = new Vector(width - r - position.position.x, 0).normal;
      velocity.velocity.subtract(normal.scale(2 * velocity.velocity.dot(normal))).scale(1.1);
      position.position.x = clamp(position.position.x, r, width - r);

      if (position.position.x > width - 3 * r || position.position.x < 3 * r) {
        velocity.acceleration.add(normal.scale(velocity.maxSpeed));
      }
    }

    if (position.position.y > height - r || position.position.y < r) {
      normal = new Vector(0, height - r - position.position.y).normal;
      velocity.velocity.subtract(normal.scale(2 * velocity.velocity.dot(normal))).scale(1.1);
      position.position.y = clamp(position.position.y, r, height - r);
      velocity.acceleration.add(normal);

      if (position.position.x > height - 3 * r || position.position.x < 3 * r) {
        velocity.acceleration.add(normal.scale(velocity.maxSpeed));
      }
    }

  }
}
