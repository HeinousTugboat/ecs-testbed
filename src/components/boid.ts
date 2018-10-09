import { Component, System, Entity } from '../ecs';
import { RenderComponent } from './render';
import { MutableVector as MVector, invalid, Color } from '../utils';
import { VelocityComponent } from './velocity';
import { PositionComponent } from './position';

let boid: BoidComponent;
let velocity: VelocityComponent;
let position: PositionComponent;
let steer: MVector = new MVector(0, 0);
let alignSum: MVector = new MVector(0, 0);
let cohesionSum: MVector = new MVector(0, 0);
let otherEntity: Boid | undefined;
let otherBoid: BoidComponent;
let otherVelocity: VelocityComponent;
let otherPosition: PositionComponent;
const diff: MVector = new MVector(0, 0);
let dist: number;
let count: number;

export enum BoidClan {
  UNAFFILIATED = '#000000',
  RED = '#CCAA99',
  BLUE = '#99AACC'
}

export class Boid extends Entity {
  boid: BoidComponent;
  position: PositionComponent;
  velocity: VelocityComponent;
  render: RenderComponent;

  constructor(clan: BoidClan) {
    super('boid');
    this.boid = this.add(BoidComponent);
    this.boid.clan = clan;

    this.position = this.add(PositionComponent);
    this.velocity = this.add(VelocityComponent);
    this.render = this.add(RenderComponent);

    this.render.color = new Color(clan);
  }
}

export class BoidComponent extends Component {
  separation: MVector = new MVector(0, 0);
  alignment: MVector = new MVector(0, 0);
  cohesion: MVector = new MVector(0, 0);
  maxForce = 10;
  clan: BoidClan = BoidClan.UNAFFILIATED;
}

export class BoidSystem extends System {
  desiredSeparation = 25 ** 2;
  neighborDistance = 50 ** 2;

  separationScale = 1.5;
  alignmentScale = 0.7;
  cohesionScale = 1;

  constructor() {
    super('boid', [BoidComponent, RenderComponent, VelocityComponent]);
  }
  update(entity: Boid, dT: number) {
    boid = entity.boid;
    velocity = entity.velocity;
    position = entity.position;

    if (invalid(boid) || invalid(velocity) || invalid(position)) {
      return;
    }

    steer = boid.separation.set(0, 0);
    alignSum = boid.alignment.set(0, 0);
    cohesionSum = boid.cohesion.set(0, 0);
    count = 0;

    const processEntity = (id: number) => {
      otherEntity = Entity.map.get(id) as Boid;

      if (invalid(otherEntity)) {
        return;
      }

      otherBoid = otherEntity.boid;
      otherPosition = otherEntity.position;
      otherVelocity = otherEntity.velocity;

      if (invalid(otherPosition) || invalid(otherVelocity) || invalid(otherBoid)) {
        return;
      }

      if (boid.clan !== otherBoid.clan && otherBoid.clan !== BoidClan.UNAFFILIATED) {
        return;
      }

      diff.setV(position.position).subtract(otherPosition.position);
      dist = diff.magSquare;

      if (dist > 0 && dist < this.desiredSeparation) {
        steer.add(diff.normal.scale(1 / Math.sqrt(dist)));
        alignSum.add(otherVelocity.velocity);
        cohesionSum.add(otherPosition.position);

        count++;
      }

    };

    this.entities.forEach(processEntity);

    if (count > 0) {
      steer.scale(1 / count);
      alignSum.scale(1 / count)
        .normalize()
        .scale(velocity.maxSpeed)
        .subtract(velocity.velocity)
        .clampMag(0, velocity.maxSpeed);
      cohesionSum
        .scale(1 / count)
        .subtract(position.position)
        .normalize()
        .scale(velocity.maxSpeed)
        .subtract(velocity.velocity)
        .clampMag(0, boid.maxForce);
    } else {
      alignSum.scale(0);
    }

    if (steer.magSquare > 0) {
      steer
        .normalize()
        .scale(velocity.maxSpeed)
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
  }
}
