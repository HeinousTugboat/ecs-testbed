import { Subject } from 'rxjs';
import { ComponentType, Component } from './component';

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
