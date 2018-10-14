import { Component, System, Entity } from '../ecs';
import { RenderComponent } from './render';
import { MutableVector as MVector, invalid, Color } from '../utils';
import { VelocityComponent } from './velocity';
import { PositionComponent, PositionSystem } from './position';
import { GridItem } from '../utils/hash-grid';

let boid: BoidComponent;
let velocity: VelocityComponent;
let position: PositionComponent;
let steer: MVector = new MVector(0, 0);
let alignSum: MVector = new MVector(0, 0);
let cohesionSum: MVector = new MVector(0, 0);
let otherEntity: Entity | undefined;
let otherBoid: BoidComponent | undefined;
let otherVelocity: VelocityComponent | undefined;
let otherPosition: PositionComponent | undefined;
const diff: MVector = new MVector(0, 0);
let dist: number;
let count: number;

export enum BoidClan {
  UNAFFILIATED = '#FF00FF',
  SHEPHERD = '#555555',
  RED = '#CCAA99',
  BLUE = '#99AACC'
}

export class Boid extends Entity {
  boid: BoidComponent;
  position: PositionComponent;
  velocity: VelocityComponent;
  render: RenderComponent;

  constructor(clan: BoidClan = BoidClan.UNAFFILIATED) {
    super('boid');
    this.boid = new BoidComponent(this.id);
    this.boid.clan = clan;

    this.position = new PositionComponent(this.id);
    this.velocity = new VelocityComponent(this.id);
    this.render = new RenderComponent(this.id);

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

export type BoidComponents = [BoidComponent, RenderComponent, VelocityComponent, PositionComponent];

export class BoidSystem extends System<BoidComponents> {
  desiredSeparation = 25 ** 2;
  neighborDistance = 50 ** 2;

  separationScale = 1.5;
  alignmentScale = 0.7;
  cohesionScale = 1;

  constructor() {
    super('boid', [BoidComponent, RenderComponent, VelocityComponent, PositionComponent]);
  }
  update(components: BoidComponents, dT: number) {
    [boid, , velocity, position] = components;

    steer = boid.separation.set(0, 0);
    alignSum = boid.alignment.set(0, 0);
    cohesionSum = boid.cohesion.set(0, 0);
    count = 0;

    const processPosition = (gridPosition: GridItem<PositionComponent>) => {
      otherPosition = undefined;
      otherBoid = undefined;
      otherVelocity = undefined;
      otherPosition = undefined;

      ({item: otherPosition} = gridPosition);

      otherEntity = Entity.map.get(otherPosition.entityId);

      if (invalid(otherEntity) || invalid(otherPosition)) {
        return;
      }

      otherBoid = otherEntity.get(BoidComponent);
      otherVelocity = otherEntity.get(VelocityComponent);

      if (invalid(otherBoid) || invalid(otherVelocity)) {
        return;
      }

      if (boid.clan !== otherBoid.clan && otherBoid.clan !== BoidClan.UNAFFILIATED && otherBoid.clan !== BoidClan.SHEPHERD) {
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

    PositionSystem.grid.getNeighbors(position.position).forEach(processPosition);


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
