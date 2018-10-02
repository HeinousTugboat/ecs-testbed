import { Entity } from './ecs';
import { RenderComponent } from './components/render';
import { MutableVector, Vector, Color, clamp } from './utils';
import { VelocityComponent } from './components/velocity';

let normal: Vector;

export class JoeBox {
  private Joe = new Entity('Joe');
  private render: RenderComponent | undefined;
  private velocity: VelocityComponent | undefined;

  initialize(start: Vector, color: Color = Color.LIGHT_BLUE) {
    this.render = this.Joe.add(RenderComponent);
    this.render.position = new MutableVector(start.x, start.y);
    this.render.color = color;

    this.velocity = this.Joe.add(VelocityComponent);
    this.velocity.velocity = new MutableVector(Math.random() * 200, Math.random() * 200);
    this.velocity.velocity.rotate(Math.random() * 2 * Math.PI);
  }

  tick(dT: number) {
    // tslint:disable no-non-null-assertion
    // this.render!.visible = !this.render!.visible;
    this.velocity!.velocity.add(this.velocity!.acceleration.scale(dT / 1000));
    this.render!.position.add(this.velocity!.velocity.scale(0.999).toVector().scale(dT / 1000));

    if (this.render!.position.x > 790 || this.render!.position.x < 10) {
      normal = new Vector(790 - this.render!.position.x, 0).normal;
      this.velocity!.velocity.subtract(normal.scale(2 * this.velocity!.velocity.dot(normal))).scale(1.1);
      this.render!.position.x = clamp(this.render!.position.x, 10, 790);
    }

    if (this.render!.position.y > 590 || this.render!.position.y < 10) {
      normal = new Vector(0, 590 - this.render!.position.y).normal;
      this.velocity!.velocity.subtract(normal.scale(2 * this.velocity!.velocity.dot(normal))).scale(1.1);
      this.render!.position.y = clamp(this.render!.position.y, 10, 590);
    }
    // tslint:enable no-non-null-assertion
  }

}
