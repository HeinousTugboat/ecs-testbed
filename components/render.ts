import { Component, System, Entity } from '../ecs';
import { Vector, invalid } from '../utils';

export class RenderComponent extends Component {
  position: Vector;
  visible = true;
  width = 10;
  height = 10;
}

export class RenderSystem extends System {
  constructor(private ctx: CanvasRenderingContext2D) {
    super('render', [RenderComponent]);
  }

  update(entity: Entity) {
    const render = entity.get(RenderComponent);

    if (invalid(render) || !render.visible) { return; }

    const {position: p, width: w, height: h} = render;

    this.ctx.fillRect(p.x - w / 2, p.y - w / 2, w, h);
  }
}
