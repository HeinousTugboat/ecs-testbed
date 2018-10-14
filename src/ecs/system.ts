import { Component, ComponentType } from './component';
import { filter, map } from 'rxjs/operators';
import { Entity, isEntity } from './entity';


let enComponents: string[];

export type ComponentTypes<T extends Component[]> = {[K in keyof T]: ComponentType<T[K] extends Component ? T[K] : never> };

export class System<T extends Component[]> {
  static list = new Set<System<any>>();
  static frame = 1;
  protected entities = new Set<T>();

  static tick(dT: number) {
    System.list.forEach(system => system.tick(dT));
    System.frame++;
  }

  constructor(
    public label: string,
    public components: ComponentTypes<T>,
  ) {
    System.list.add(this);

    Component.added$.pipe(
      filter(component => components.some(componentType => component instanceof componentType)),
      map(component => Entity.map.get(component.entityId)),
      filter(isEntity),
      filter(entity => {
        enComponents = [...entity.components.keys()];
        return components
          .map(systemComponent => systemComponent.name)
          .every(systemComponent => enComponents.includes(systemComponent));
      }),
      map((entity: Entity) => {
        return components.map(componentType => entity.get(componentType)) as T;
      })
    ).subscribe(componentArr => this.entities.add(componentArr));

    Component.removed$.pipe(
      filter(component => components.some(componentType => component instanceof componentType)),
      map(component => Entity.map.get(component.entityId)),
      filter(isEntity),
      map((entity: Entity) => {
        return [...this.entities.values()]
          .filter(entityComponents => entityComponents.every(component => component.entityId === entity.id));
      })
    ).subscribe(componentArr => this.entities.delete(componentArr[0]));
  }

  tick(dT: number) {
    this.entities.forEach(components => {
      this.update(components, dT);
    });
  }

  protected update(components: T, dT: number) {
    console.log(`[${System.frame.toString(10).padStart(2)}] ${this.label}: ${components} `, dT);
  }
}
