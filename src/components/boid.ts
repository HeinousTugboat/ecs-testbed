import { Component, System, Entity } from '../ecs';
import { RenderComponent } from './render';
import { Vector, MutableVector as MVector, invalid } from '../utils';
import { VelocityComponent } from './velocity';

const width = 800;
const height = 600;

export class BoidComponent extends Component {
  separation: MVector = new MVector(0, 0);
  alignment: MVector = new MVector(0, 0);
  cohesion: MVector = new MVector(0, 0);
  r = 2.0;
  maxSpeed = 2;
  maxForce = 0.0005;
}

export class BoidSystem extends System {
  desiredSeparation = 20 ** 2;
  neighborDistance = 50 ** 2;

  separationScale = 1.5;
  alignmentScale = 1.0;
  cohesionScale = 1.0;

  constructor() {
    super('boid', [BoidComponent, RenderComponent, VelocityComponent]);
  }
  update(entity: Entity, dT: number) {
    const boid = entity.get(BoidComponent);
    const velocity = entity.get(VelocityComponent);
    const render = entity.get(RenderComponent);

    if (invalid(boid) || invalid(velocity) || invalid(render)) {
      return;
    }

    const steer = new MVector(0, 0);
    const alignSum = new MVector(0, 0);
    const cohesionSum = new MVector(0, 0);
    let count = 0;

    this.entities.forEach(id => {
      const en = Entity.map.get(id);
      if (invalid(en)) {
        return;
      }

      const otherRender = en.get(RenderComponent);
      const otherVelocity = en.get(VelocityComponent);

      if (invalid(otherRender) || invalid(otherVelocity)) {
        return;
      }
      const diff = render.position.toVector().subtract(otherRender.position);
      const dist = diff.magSquare;

      if (dist > 0 && dist < this.desiredSeparation) {
        steer.add(diff.normal.scale(1 / Math.sqrt(dist)));
        alignSum.add(otherVelocity.velocity);
        cohesionSum.add(otherRender.position);

        count++;
      }

    });

    if (count > 0) {
      steer.scale(1 / count);
      alignSum.scale(1 / count)
        .normalize()
        .scale(boid.maxSpeed)
        .subtract(velocity.velocity)
        .clampMag(0, boid.maxSpeed);
      cohesionSum
        .scale(1 / count)
        .subtract(render.position)
        .normalize()
        .scale(boid.maxSpeed)
        .subtract(velocity.velocity)
        .clampMag(0, boid.maxForce);
    } else {
      alignSum.scale(0);
    }

    if (steer.magSquare > 0) {
      steer
        .normalize()
        .scale(boid.maxSpeed)
        .subtract(velocity.velocity)
        .clampMag(0, boid.maxForce);
    }

    steer.scale(this.separationScale);
    alignSum.scale(this.alignmentScale);
    cohesionSum.scale(this.cohesionScale);

    velocity.acceleration
      .add(steer)
      .add(alignSum)
      .add(cohesionSum);
    velocity.velocity.add(velocity.acceleration).clampMag(0, boid.maxSpeed);
    render.position.add(velocity.velocity);
    velocity.acceleration.scale(0);

    if (render.position.x < -boid.r) { render.position.x = width + boid.r; }
    if (render.position.y < -boid.r) { render.position.y = height + boid.r; }
    if (render.position.x > width + boid.r) { render.position.x = -boid.r; }
    if (render.position.y > height + boid.r) { render.position.y = -boid.r; }

  }
}
