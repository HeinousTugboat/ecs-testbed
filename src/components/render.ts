import { Component, System, Entity } from '../ecs';
import { invalid, MutableVector as MVector, Vector, Color } from '../utils';
import { CanvasManager } from '../canvas';



export class RenderComponent extends Component {
  position: MVector = new MVector(0, 0);
  size: Vector = new Vector(10, 10);
  visible = true;
  color: Color = Color.BLACK;
}

export class RenderSystem extends System {
  constructor(private canvas: CanvasManager) {
    super('render', [RenderComponent]);
  }
  tick(dT: number) {
    this.canvas.clear();

    super.tick(dT);
  }
  update(entity: Entity) {
    const render = entity.get(RenderComponent);

    if (invalid(render) || !render.visible) { return; }
    this.canvas.rect(
      render.size.scale(-0.5).add(render.position),
      render.size,
      render.color.toString()
    );
  }
}
