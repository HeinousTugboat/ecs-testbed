import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

export type ComponentType<T extends Component> = new (id: number) => T;

export class Entity {
  static nextId = 1;
  static added$ = new Subject<Entity>();
  static map = new Map<number, Entity>();
  id = Entity.nextId++;
  components = new Map<string, Component>();

  constructor(public name: string) {
    Entity.added$.next(this);
    Entity.map.set(this.id, this);
  }

  get<T extends Component>(component: ComponentType<T>): T | undefined {
    return this.components.get(component.name) as T | undefined;
  }

  add<T extends Component>(component: ComponentType<T>): T {
    const inst = new component(this.id);
    this.components.set(component.name, inst);
    Component.added$.next(inst);
    return inst;
  }

  remove<T extends Component>(component: ComponentType<T>): T | undefined {
    const inst = this.components.get(component.name) as T;
    if (inst !== undefined) {
      this.components.delete(component.name);
      Component.removed$.next(inst);
    }
    return inst;
  }
}

export class Component {
  static added$ = new Subject<Component>();
  static removed$ = new Subject<Component>();

  constructor(public entity: number) { }
}

export class System {
  static list = new Set<System>();
  static frame = 1;
  private entities = new Set<number>();

  static tick(dT: number) {
    System.list.forEach(system => system.tick(dT));
    System.frame++;
  }

  constructor(
    public label: string,
    public components: typeof Component[],
  ) {
    System.list.add(this);

    Component.added$.pipe(
      filter(x => components.some(y => x instanceof y)),
      filter(x => {
        const e = Entity.map.get(x.entity);
        if (e === undefined) {
          return false;
        }

        const cs = [...e.components.keys()];
        return components.map(c => c.name).every(c => cs.includes(c));
      })
    ).subscribe(x => this.entities.add(x.entity));

    Component.removed$.pipe(
      filter(x => components.some(y => x instanceof y)),
    ).subscribe(x => this.entities.delete(x.entity));
  }

  tick(dT: number) {
    this.entities.forEach(id => {
      const e = Entity.map.get(id);
      if (e === undefined) {
        return;
      }
      this.update(e, dT);
    });
  }

  protected update(e: Entity, dT: number) {
    console.log(`[${System.frame.toString(10).padStart(2)}] ${this.label}: ${e.name} `, dT);
  }
}

// const fn = function(this: System, e: Entity, str: string = '') {
//    console.log(`[${System.frame.toString(10).padStart(2)}] ${this.label}: ${e.name} `, str);
// };

// const pSystem = new System([PositionComponent], 'position', function(this: System, e: Entity, dT: number) {
//   // fn.bind(this)(e);

// });
// const pvSystem = new System([PositionComponent, VelocityComponent], 'movement', function(this: System, e: Entity, dT: number) {
//   const pos = e.get(PositionComponent)!;
//   const v = e.get(VelocityComponent)!;
//   pos.x += v.x * dT / 1000;
//   pos.y += v.y * dT / 1000;
//   // fn.bind(this)(e, `${pos.x}, ${pos.y}`);
// });
// // const sSystem = new System([VelocityComponent], 'speed', fn);
// // const cSystem = new System([ColorComponent], 'color', fn);

// // Component.added$.subscribe(x => console.log('Component!', x));

// const ent = new Entity('Joe');
// System.tick(1);
// ent.add(VelocityComponent);
// System.tick(2);
// ent.add(PositionComponent);
// System.tick(3);
// ent.add(ColorComponent);
// System.tick(4);
// // console.log('    ~~ Added ~~');
// System.tick(5);
// ent.remove(PositionComponent);
// System.tick(6);
// ent.remove(ColorComponent);
// System.tick(7);
// ent.add(PositionComponent);
// System.tick(8);

// for (let i = 1; i < 50_000; ++i) {
//   const e = new Entity(`Drone-${i.toString(10).padStart(3, '0')}`);
//   e.add(PositionComponent);
//   const vel = e.add(VelocityComponent);
//   vel.x = 100;
// }
// let now = performance.now();
// let then = now - 15;
// console.log(now);

// const times: number[] = [];

// for (let i = 0; i < 1000; ++i) {
//   then = now;
//   now = performance.now();
//   console.log(now - then);
//   System.tick(now - then);
//   times.push(now - then);
// }

// const total = times.reduce((t, n) => t + n, 0);
// console.log(total);
// console.log(total / times.length);
