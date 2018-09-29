import { Component } from './component';
import { filter } from 'rxjs/operators';
import { Entity } from './entity';

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
