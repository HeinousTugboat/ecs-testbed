import { Subject } from 'rxjs';

export type ComponentType<T extends Component> = new (id: number) => T;

export class Component {
  static added$ = new Subject<Component>();
  static removed$ = new Subject<Component>();

  constructor(public entity: number) { }
}
