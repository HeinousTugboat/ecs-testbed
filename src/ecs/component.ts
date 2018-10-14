import { Subject } from 'rxjs';
import { Entity } from './entity';
import { invalid } from '../utils';

export type ComponentType<T extends Component> = new (id: number) => T;

export class Component {
  static added$ = new Subject<Component>();
  static removed$ = new Subject<Component>();

  constructor(public entity: number) { }

  destroy() {
    Component.removed$.next(this);

    const entity = Entity.map.get(this.entityId);
    if (invalid(entity)) {
      throw new Error(`Component with invalid Entity! ${this} ${entity}`);
    }
    entity.components.delete(this.constructor.name);
  }
}
