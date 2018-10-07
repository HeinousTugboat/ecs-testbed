import { Component, System, Entity } from '../ecs';
import { RenderComponent } from './render';
import { MutableVector as MVector, invalid } from '../utils';
import { VelocityComponent } from './velocity';

const width = 800;
const height = 600;
let boid: BoidComponent;
let velocity: VelocityComponent;
let render: RenderComponent;
const steer: MVector = new MVector(0, 0);
const alignSum: MVector = new MVector(0, 0);
const cohesionSum: MVector = new MVector(0, 0);
let otherEntity: Boid | undefined;
let otherVelocity: VelocityComponent;
let otherRender: RenderComponent;
const diff: MVector = new MVector(0, 0);
let dist: number;
let count: number;

export class Boid extends Entity {
  boid: BoidComponent;
  render: RenderComponent;
  velocity: VelocityComponent;

  constructor() {
    super('boid');
    this.boid = this.add(BoidComponent);
    this.render = this.add(RenderComponent);
    this.velocity = this.add(VelocityComponent);
  }
}

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
  update(entity: Boid, dT: number) {
    boid = entity.boid;
    velocity = entity.velocity;
    render = entity.render;

    // if (invalid(boid) || invalid(velocity) || invalid(render)) {
    //   return;
    // }

    steer.set(0, 0);
    alignSum.set(0, 0);
    cohesionSum.set(0, 0);
    count = 0;

    const processEntity = (id: number) => {
      otherEntity = Entity.map.get(id) as Boid;

      if (invalid(otherEntity)) {
        return;
      }

      otherRender = otherEntity.render;
      otherVelocity = otherEntity.velocity;

      // if (invalid(otherRender) || invalid(otherVelocity)) {
      //   return;
      // }
      diff.setV(render.position).subtract(otherRender.position);
      dist = diff.magSquare;

      if (dist > 0 && dist < this.desiredSeparation) {
        steer.add(diff.normal.scale(1 / Math.sqrt(dist)));
        alignSum.add(otherVelocity.velocity);
        cohesionSum.add(otherRender.position);

        count++;
      }

    };

    this.entities.forEach(processEntity);

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
