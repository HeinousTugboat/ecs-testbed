import { Entity } from './ecs';
import { RenderComponent } from './components/render';
import { MutableVector, Vector } from './utils';

const Joe = new Entity('Joe');
let render: RenderComponent | undefined;

function initialize() {
  render = Joe.add(RenderComponent);
  render.position = new MutableVector(100, 100);
}

function tick(dT: number) {
  // tslint:disable no-non-null-assertion
  render!.visible = !render!.visible;
  render!.position.add(new Vector(dT / 10, dT / 10));
  // tslint:enable no-non-null-assertion
}

export default {
  Joe, initialize, tick
};
