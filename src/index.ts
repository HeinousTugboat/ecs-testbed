import { RenderSystem } from './components/render';
import { ready } from './utils';
import { System } from './ecs';
import { CanvasManager } from './canvas';
import { BoidSystem, BoidClan } from './components/boid';
import { Boid } from './components/boid';
import { VelocitySystem } from './components/velocity';

const start = performance.now();
let last = start;
let dT = 0;
let tickRes = 0;

ready(() => {
  // Page setup
  const canvasManager = new CanvasManager('primary-canvas');

  // ECS initialization
  const boidSystem = new BoidSystem();
  const velocitySystem = new VelocitySystem(canvasManager);
  const renderSystem = new RenderSystem(canvasManager);

  // Load the Boids!
  const n = 300;
  const div = Math.sqrt(n);

  for (let i = 0; i < n; ++i) {
    const boid = new Boid(i % 2 ? BoidClan.RED : BoidClan.BLUE);
    const positionComponent = boid.position;

    // This evenly distributes our little critters across the entire canvas
    positionComponent.position.x = (i + 0.5) % div * canvasManager.width / div;
    positionComponent.position.y = (Math.floor(i / div) + 0.5) * canvasManager.height / div;
    const velocityComponent = boid.velocity;
    const speed = Math.random() * 2 * Math.PI;
    velocityComponent.velocity.x = Math.cos(speed);
    velocityComponent.velocity.y = Math.sin(speed);
    velocityComponent.velocity.scale(60);
  }

  // Fire the first tick
  tick(start);
});

function tick(time: DOMHighResTimeStamp) {
  // Update timestamps
  dT = time - last;
  last = time;

  // Tick everything until delta below 20ms
  do {
    if (dT > 100) {
      console.log('Slow tick!', dT);
    }
    tickRes = dT > 100 ? 100 : dT;
    System.tick(tickRes);
    dT -= 100;
  } while (dT > 0);

  requestAnimationFrame(tick);
}
