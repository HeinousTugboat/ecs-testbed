import { RenderSystem, RenderComponent } from './components/render';
import { ready, Vector, Color } from './utils';
import { System, Entity } from './ecs';
import { CanvasManager } from './canvas';
import { BoidSystem } from './components/boid';
import { Boid } from './components/boid';
import { VelocitySystem } from './components/velocity';
import { PositionComponent } from './components/position';

const start = performance.now();
let last = start;
let dT = 0;
let tickRes = 0;

ready(() => {
  // Page setup
  const canvasManager = new CanvasManager('primary-canvas');
  const width = 800;
  const height = 600;

  // ECS initialization
  const boidSystem = new BoidSystem();
  const velocitySystem = new VelocitySystem(new Vector(0, 0), new Vector(width, height));
  const renderSystem = new RenderSystem(canvasManager);

  // Load the Boids!
  const n = 300;
  const div = Math.sqrt(n);

  for (let i = 0; i < n; ++i) {
    const boid = new Boid();
    const positionComponent = boid.position;

    // This evenly distributes our little critters across the entire canvas
    positionComponent.position.x = i % div * width / div;
    positionComponent.position.y = Math.floor(i / div) * height / div;
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
