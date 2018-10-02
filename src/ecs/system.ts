import { Component } from './component';
import { filter } from 'rxjs/operators';
import { Entity } from './entity';


let en: Entity | undefined;
let enComponents: string[];

export class System {
  static list = new Set<System>();
  static frame = 1;
  protected entities = new Set<number>();

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
      filter(component => components.some(componentType => component instanceof componentType)),
      filter(component => {
        en = Entity.map.get(component.entity);
        if (en === undefined) {
          return false;
        }

        enComponents = [...en.components.keys()];
        return components
          .map(systemComponent => systemComponent.name)
          .every(systemComponent => enComponents.includes(systemComponent));
      })
    ).subscribe(component => this.entities.add(component.entity));

    Component.removed$.pipe(
      filter(component => components.some(componentType => component instanceof componentType)),
    ).subscribe(component => this.entities.delete(component.entity));
  }

  tick(dT: number) {
    this.entities.forEach(id => {
      en = Entity.map.get(id);
      if (en === undefined) {
        return;
      }
      this.update(en, dT);
    });
  }

  protected update(entity: Entity, dT: number) {
    console.log(`[${System.frame.toString(10).padStart(2)}] ${this.label}: ${entity.name} `, dT);
  }
}
