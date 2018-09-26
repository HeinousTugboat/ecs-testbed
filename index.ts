import { Entity, Component, System } from './testbed';
import { performance } from 'perf_hooks';

let now = performance.now();
let then = now;

const TEST_CONFIG = {
  BORDER: 100
};

class PositionComponent extends Component {
  public x = 0;
  public y = 0;
  public z = 0;
}

class RotationComponent extends Component {
  public x = 0;
  public y = 0;
  public z = 0;
  public w = 0;
}

class VelocityComponent extends Component {
  public x = 0;
  public y = 0;
  public z = 0;
}

const transformSystem = new System([PositionComponent, VelocityComponent], 'transform',
  function(this: System, entity: Entity, dT: number) {
    const p = entity.get(PositionComponent)!;
    const v = entity.get(VelocityComponent)!;

    p.x += v.x * dT / 1000;
    p.y += v.y * dT / 1000;
    p.z += v.z * dT / 1000;
    if (p.x < -TEST_CONFIG.BORDER) {
      p.x = -TEST_CONFIG.BORDER;
      v.x *= -1.0;
    }
    if (p.x > TEST_CONFIG.BORDER) {
      p.x = TEST_CONFIG.BORDER;
      v.x *= -1.0;
    }

    if (p.y < -TEST_CONFIG.BORDER) {
      p.y = -TEST_CONFIG.BORDER;
      v.y *= -1.0;
    }
    if (p.y > TEST_CONFIG.BORDER) {
      p.y = TEST_CONFIG.BORDER;
      v.y *= -1.0;
    }

    if (p.z < -TEST_CONFIG.BORDER) {
      p.z = -TEST_CONFIG.BORDER;
      v.z *= -1.0;
    }
    if (p.z > TEST_CONFIG.BORDER) {
      p.z = TEST_CONFIG.BORDER;
      v.z *= -1.0;
    }
});

const rotationSystem = new System([RotationComponent, VelocityComponent], 'rotation',
  function(this: System, entity: Entity, dT: number) {
    const r = entity.get(RotationComponent)!;
    const v = entity.get(VelocityComponent)!;

    r.x += v.x * dT / 1000;
    r.y += v.y * dT / 1000;
    r.z += v.z * dT / 1000;

    r.x %= 360;
    r.y %= 360;
    r.z %= 360;
});

for (let i = 0; i < 50_000; ++i) {
  const entity = new Entity(`cube-${i.toString(10).padStart(2, '0')}`);
  entity.add(RotationComponent);
  entity.add(VelocityComponent);
  entity.add(PositionComponent);
}

then = now;
now = performance.now();
console.log(`Init: ${now - then}`);

System.tick(10);

then = now;
now = performance.now();
console.log(`Tick: ${now - then}`);
const times: number[] = [];

for (let i = 0; i < 1_000; ++i) {
  const delta = now - then;
  System.tick(delta);
  times.push(delta);
  console.log(delta);
  then = now;
  now = performance.now();
}

const total = times.reduce((t, n) => t + n);
console.log(total);
console.log(total / times.length);
