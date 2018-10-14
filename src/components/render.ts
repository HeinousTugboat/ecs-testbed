import { Component, System, Entity } from '../ecs';
import { invalid, Vector, Color } from '../utils';
import { CanvasManager } from '../canvas';
import { VelocityComponent } from './velocity';
import { PositionComponent } from './position';
import { BoidComponent } from './boid';

export class RenderComponent extends Component {
  size: Vector = new Vector(2, 2);
  visible = true;
  color: Color = Color.BLACK;
}

let en: Entity | undefined;
let render: RenderComponent | undefined;
let position: PositionComponent | undefined;
let velocity: VelocityComponent | undefined;
let boid: BoidComponent | undefined;

export type RenderComponents = [RenderComponent, PositionComponent];

export class RenderSystem extends System<RenderComponents> {
  constructor(private canvas: CanvasManager) {
    super('render', [RenderComponent, PositionComponent]);
  }
  tick() {
    this.canvas.tick();

    this.entities.forEach(components => {

      this.drawBody(components);
      // this.drawVelocity(components);
      // this.drawBoid(en);
    });

    this.canvas.render();
  }

  drawBody(components: RenderComponents) {
    [render, position] = components;
    this.canvas.dot(render.color, position.position, render.size);
  }

  drawVelocity(components: RenderComponents) {
    [, position] = components;

    en = Entity.map.get(position.entityId);

    if (invalid(en)) { return; }
    velocity = en.get(VelocityComponent);

    if (invalid(velocity)) { return; }
    this.canvas.line(Color.GRAY, position.position, position.position.toVector().add(velocity.velocity.toVector().scale(0.2)));
  }

  drawBoid(entity: Entity) {
    position = entity.get(PositionComponent);
    boid = entity.get(BoidComponent);

    if (invalid(position) || invalid(boid)) { return; }
    this.canvas.line(Color.RED, position.position, position.position.toVector().add(boid.separation));
    this.canvas.line(Color.GREEN, position.position, position.position.toVector().add(boid.cohesion));
    this.canvas.line(Color.BLUE, position.position, position.position.toVector().add(boid.alignment));
  }
}
