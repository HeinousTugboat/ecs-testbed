import { Component, System, Entity } from '../ecs';
import { invalid, MutableVector as MVector, Vector, Color } from '../utils';
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

export class RenderSystem extends System {
  constructor(private canvas: CanvasManager) {
    super('render', [RenderComponent, PositionComponent]);
  }
  tick() {
    this.canvas.tick();

    this.entities.forEach(id => {
      en = Entity.map.get(id);
      if (invalid(en)) {
        return;
      }

      this.drawBody(en);
      this.drawVelocity(en);
      // this.drawBoid(en);
    });

    this.canvas.render();
  }

  drawBody(entity: Entity) {
    render = entity.get(RenderComponent);
    position = entity.get(PositionComponent);

    if (invalid(render) || invalid(position) || !render.visible) { return; }
    this.canvas.dot(render.color, position.position, render.size);
  }

  drawVelocity(entity: Entity) {
    position = entity.get(PositionComponent);
    velocity = entity.get(VelocityComponent);

    if (invalid(position) || invalid(velocity)) { return; }
    this.canvas.line(Color.LIGHT_BLUE, position.position, position.position.toVector().add(velocity.velocity.toVector().scale(0.2)));
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
