import { RenderSystem, RenderComponent } from './components/render';
import { ready, invalid, MutableVector as Vector } from './utils';
import { Entity, System } from './ecs';
import { JoeBox } from './Joe';
import { CanvasManager } from './canvas';

const start = performance.now();
let last = start;
let dT = 0;
const Joe: JoeBox[] = [];

ready(() => {
  // Page setup
  const canvasManager = new CanvasManager('primary-canvas');

  // ECS initialization
  const renderSystem = new RenderSystem(canvasManager);
  for (let i = 0; i < 2500; ++i) {
    const joe = new JoeBox();
    joe.initialize(new Vector(250, 250));
    Joe.push(joe);
  }

  // Fire the first tick
  tick(start);

  // Debugging stuff
  const testBed = {
    canvasManager, renderSystem, RenderComponent, Entity, Joe
  };
  (window as any).testBed = testBed;
});

function tick(time: DOMHighResTimeStamp) {
  // Update timestamps
  dT = time - last;
  last = time;

  // Tick everything once
  Joe.forEach(joe => joe.tick(dT));
  System.tick(dT);

  // Only run for intended duration
  // if (time - start < 20000) {
    requestAnimationFrame(tick);
  // }
}
