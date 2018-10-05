import { Component } from '../ecs';
import { Vector, MutableVector } from '../utils';

export class VelocityComponent extends Component {
  velocity: MutableVector = new MutableVector(0, 0);
  acceleration: MutableVector = new MutableVector(0, 0);
}
