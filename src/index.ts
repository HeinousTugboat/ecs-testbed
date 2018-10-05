import { RenderSystem, RenderComponent } from './components/render';
import { ready, Vector, MutableVector, Color, Line } from './utils';
import { Entity, System } from './ecs';
import { JoeBox } from './Joe';
import { CanvasManager } from './canvas';
import { BoidComponent, BoidSystem } from './components/boid';
import { VelocityComponent } from './components/velocity';

const start = performance.now();
const Joe: JoeBox[] = [];

let last = start;
let dT = 0;
let tickRes = 0;

ready(() => {
  // Page setup
  const canvasManager = new CanvasManager('primary-canvas');

  // ECS initialization
  const boidSystem = new BoidSystem();
  const renderSystem = new RenderSystem(canvasManager);

  const n = 200;
  const div = Math.sqrt(n);
  const width = 800;
  const height = 600;

  for (let i = 0; i < n; ++i) {
    const boid = new Entity('boid');
    const boidComponent = boid.add(BoidComponent);
    const renderComponent = boid.add(RenderComponent);
    renderComponent.position.x = i % div * width / div;
    renderComponent.position.y = Math.floor(i / div) * height / div;
    const velocityComponent = boid.add(VelocityComponent);
    const speed = Math.random() * 2 * Math.PI;
    velocityComponent.velocity.x = Math.cos(speed);
    velocityComponent.velocity.y = Math.sin(speed);
    console.log(boid);
  }

  // for (let i = 0; i < 300; ++i) {
  //   const joe = new JoeBox();
  //   // const n = Math.floor(Math.random() * 17) * 16;
  //   // joe.initialize(new Vector(250, 250), new Color(n, n, n));
  //   joe.initialize(new MutableVector(200, 200), Color.BLACK);
  //   Joe.push(joe);
  // }

  // Fire the first tick
  tick(start);

  // Debugging stuff
  const testBed = {
    canvasManager, boidSystem, renderSystem, RenderComponent, Entity, Joe, Vector, Line
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
    // Joe.forEach(joe => joe.tick(tickRes));
    System.tick(tickRes);
    dT -= 100;
  } while (dT > 0);

  // Only run for intended duration
  // if (time - start < 20000) {
    requestAnimationFrame(tick);
  // }
}
