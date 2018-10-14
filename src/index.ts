import { RenderSystem } from './components/render';
import { ready } from './utils';
import { System } from './ecs';
import { CanvasManager } from './canvas';
import { BoidSystem, BoidClan } from './components/boid';
import { Boid } from './components/boid';
import { VelocitySystem } from './components/velocity';
import { PositionSystem } from './components/position';

const start = performance.now();
let last = start;
let dT = 0;
let tickRes = 0;
let spawnTime = 0;
let spawning = true;

ready(() => {
  // Page setup
  const canvasManager = new CanvasManager('primary-canvas');

  // ECS initialization
  const boidSystem = new BoidSystem();
  const velocitySystem = new VelocitySystem(canvasManager);
  const renderSystem = new RenderSystem(canvasManager);
  const positionSystem = new PositionSystem(canvasManager, Math.sqrt(boidSystem.neighborDistance));

  // Load the Boids!
  const n = 50;
  const div = Math.sqrt(n);

  for (let i = 0; i < n; ++i) {
    const {position: {position}, velocity: {velocity, maxSpeed}} = new Boid(BoidClan.SHEPHERD);

    // This evenly distributes our little critters across the entire canvas
    position.x = (i + 0.5) % div * canvasManager.width / div;
    position.y = (Math.floor(i / div) + 0.5) * canvasManager.height / div;

    const speed = Math.random() * 2 * Math.PI;
    velocity.x = Math.cos(speed);
    velocity.y = Math.sin(speed);
    velocity.scale(Math.random() * (maxSpeed - 60) + 60);
  }

  spawnTime = start;

  // Fire the first tick
  tick(start);
});

function tick(time: DOMHighResTimeStamp) {
  // Update timestamps
  dT = time - last;
  last = time;
  // Tick everything until delta below 50ms
  do {
    if (dT > 100) {
      dT -= 50;
      spawning = false;
    }

    if (spawning && dT < 17 && time - spawnTime > 100) {
      const boid = new Boid(Math.random() < 0.5 ? BoidClan.RED : BoidClan.BLUE);
      const {position: {position}, velocity: {velocity, maxSpeed}} = boid;

      position.set(Math.random() * innerWidth, Math.random() * innerHeight);
      const speed = Math.random() * 2 * Math.PI;
      velocity.set(Math.cos(speed), Math.sin(speed));
      velocity.scale(Math.random() * (maxSpeed - 60) + 60);

      spawnTime = time;
    }
    tickRes = dT > 50 ? 50 : dT;
    System.tick(tickRes);
    dT -= tickRes;
  } while (dT > 0);

  requestAnimationFrame(tick);
}
