import { Component } from '../ecs';
import { MutableVector as MVector } from '../utils';

export class PositionComponent extends Component {
  position: MVector = new MVector(0, 0);
}
