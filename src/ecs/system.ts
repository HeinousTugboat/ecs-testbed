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
      filter(component => components.some(componentType => component instanceof componentType)),
      filter(component => {
        const entity = Entity.map.get(component.entity);
        if (entity === undefined) {
          return false;
        }

        const entityComponents = [...entity.components.keys()];
        return components
          .map(systemComponent => systemComponent.name)
          .every(systemComponent => entityComponents.includes(systemComponent));
      })
    ).subscribe(component => this.entities.add(component.entity));

    Component.removed$.pipe(
      filter(component => components.some(componentType => component instanceof componentType)),
    ).subscribe(component => this.entities.delete(component.entity));
  }

  tick(dT: number) {
    this.entities.forEach(id => {
      const entity = Entity.map.get(id);
      if (entity === undefined) {
        return;
      }
      this.update(entity, dT);
    });
  }

  protected update(entity: Entity, dT: number) {
    console.log(`[${System.frame.toString(10).padStart(2)}] ${this.label}: ${entity.name} `, dT);
  }
}
