import { Component, System, Entity } from '../ecs';
import { invalid, MutableVector as MVector, Vector, Color } from '../utils';
import { CanvasManager } from '../canvas';
import { VelocityComponent } from './velocity';

export class RenderComponent extends Component {
  position: MVector = new MVector(0, 0);
  size: Vector = new Vector(1.5, 1.5);
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
    this.canvas.clear();
    // super.tick(dT);

    this.canvas.startPath();
    this.entities.forEach(id => {
      en = Entity.map.get(id);
      if (en === undefined) {
        return;
      }
      this.drawVelocity(en);
    });

    this.canvas.stroke(Color.LIGHT_BLUE.toString());
    this.canvas.startPath();

    this.entities.forEach(id => {
      en = Entity.map.get(id);
      if (en === undefined) {
        return;
      }
      this.drawBody(en);
    });
    this.canvas.fill(Color.BLACK.toString());
  }

  drawBody(entity: Entity) {
    render = entity.get(RenderComponent);

    if (invalid(render) || !render.visible) { return; }
    this.canvas.dot(render.position, render.size);
  }

  drawVelocity(entity: Entity) {
    render = entity.get(RenderComponent);
    velocity = entity.get(VelocityComponent);

    if (invalid(render) || !render.visible || invalid(velocity)) { return; }
    this.canvas.line(render.position, render.position.toVector().add(velocity.velocity.toVector().scale(0.2)));
  }
}
