import { RenderSystem, RenderComponent } from './components/render';
import { ready, invalid } from './utils';
import { Entity, System } from './ecs';

let Joe: Entity;
let joeRender: RenderComponent;

ready(() => {
  const canvas = document.getElementById('primary-canvas') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d');
  if (invalid(ctx)) {
    throw new Error('No context available on #primary-canvas!');
  }

  const renderSystem = new RenderSystem(ctx);

  Joe = new Entity('Joe');
  joeRender = Joe.add(RenderComponent);

  joeRender.position.x = 100;
  joeRender.position.y = 100;

  tick(0);

  const testBed = {
    canvas, ctx, renderSystem, RenderComponent, Entity, Joe
  };
  (window as any).testBed = testBed;
});

function tick(dT: number) {
  joeRender.position.x += dT / 1000;
  joeRender.position.y += dT / 1000;
  System.tick(dT);
  requestAnimationFrame(tick);
}
