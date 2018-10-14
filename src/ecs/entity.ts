import { Subject } from 'rxjs';
import { ComponentType, Component } from './component';
import { invalid } from '../utils';

export function isEntity(e: Entity | undefined): e is Entity {
  return isFinite((<Entity>e).id) && (<Entity>e).components !== undefined;
}

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
    return new component(this.id);
  }

  remove<T extends Component>(component: ComponentType<T>): void {
    const componentInstance = this.components.get(component.name) as T;
    if (!invalid(componentInstance)) {
      componentInstance.destroy();
    }
  }
}
