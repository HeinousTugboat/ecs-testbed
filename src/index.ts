import { RenderSystem, RenderComponent } from './components/render';
import { ready, MutableVector as Vector, Color } from './utils';
import { Entity, System } from './ecs';
import { JoeBox } from './Joe';
import { CanvasManager } from './canvas';

const start = performance.now();
const Joe: JoeBox[] = [];

let last = start;
let dT = 0;
let tickRes = 0;

ready(() => {
  // Page setup
  const canvasManager = new CanvasManager('primary-canvas');

  // ECS initialization
  const renderSystem = new RenderSystem(canvasManager);

  for (let i = 0; i < 300; ++i) {
    const joe = new JoeBox();
    // const n = Math.floor(Math.random() * 17) * 16;
    // joe.initialize(new Vector(250, 250), new Color(n, n, n));
    joe.initialize(new Vector(200, 200), Color.BLACK);
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

  // Tick everything until delta below 20ms
  do {
    tickRes = dT > 100 ? 100 : dT;
    Joe.forEach(joe => joe.tick(tickRes));
    System.tick(tickRes);
    dT -= 100;
  } while (dT > 0);

  // Only run for intended duration
  // if (time - start < 20000) {
    requestAnimationFrame(tick);
  // }
}
