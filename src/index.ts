import { RenderSystem, RenderComponent } from './components/render';
import { ready, invalid, MutableVector as Vector } from './utils';
import { Entity, System } from './ecs';
import Joe from './Joe';

const start = performance.now();
let last = start;
let dT = 0;

ready(() => {
  // Page setup
  const canvas = document.getElementById('primary-canvas') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d');
  if (invalid(ctx)) {
    throw new Error('No context available on #primary-canvas!');
  }

  // ECS initialization
  const renderSystem = new RenderSystem(ctx);
  Joe.initialize();

  // Fire the first tick
  tick(start);

  // Debugging stuff
  const testBed = {
    canvas, ctx, renderSystem, RenderComponent, Entity, Joe
  };
  (window as any).testBed = testBed;
});

function tick(time: DOMHighResTimeStamp) {
  // Update timestamps
  dT = time - last;
  last = time;

  // Tick everything once
  Joe.tick(dT);
  System.tick(dT);

  // Only run for intended duration
  if (time - start < 2000) {
    requestAnimationFrame(tick);
  }
}
