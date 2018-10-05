import { Component, System, Entity } from '../ecs';
import { invalid, MutableVector as MVector, Vector, Color } from '../utils';
import { CanvasManager } from '../canvas';
import { VelocityComponent } from './velocity';

export class RenderComponent extends Component {
  position: MVector = new MVector(0, 0);
  size: Vector = new Vector(2, 2);
  visible = true;
  color: Color = Color.BLACK;
}

let en: Entity | undefined;
let render: RenderComponent | undefined;
let velocity: VelocityComponent | undefined;

export class RenderSystem extends System {
  constructor(private canvas: CanvasManager) {
    super('render', [RenderComponent]);
  }
  tick(dT: number) {
    this.canvas.tick();
    // super.tick(dT);

    this.entities.forEach(id => {
      en = Entity.map.get(id);
      if (en === undefined) {
        return;
      }
      this.drawBody(en);
      this.drawVelocity(en);
    });

    this.canvas.render();
  }

  drawBody(entity: Entity) {
    render = entity.get(RenderComponent);

    if (invalid(render) || !render.visible) { return; }
    this.canvas.dot(render.color, render.position, render.size);
  }

  drawVelocity(entity: Entity) {
    render = entity.get(RenderComponent);
    velocity = entity.get(VelocityComponent);

    if (invalid(render) || !render.visible || invalid(velocity)) { return; }
    this.canvas.line(Color.LIGHT_BLUE, render.position, render.position.toVector().add(velocity.velocity.toVector().scale(0.2)));
  }
}
