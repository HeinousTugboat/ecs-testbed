import 'mocha';
import { expect, use } from 'chai';
import { spy } from 'sinon';
import { Component } from '../../src/ecs/component';
import { Entity } from '../../src/ecs';
import * as sinonChai from 'sinon-chai';

use(sinonChai);

describe('ECS:', () => {
  class TestComponent extends Component { }

  describe('Component', () => {
    it('exists', () => {
      expect(Component).to.exist;
    });

    describe('constructor', () => {
      it('adds itself to the given entity', () => {
        const entity = new Entity('test-entity');
        const testComponent = new TestComponent(entity.id);

        expect(testComponent).to.exist;
        expect(testComponent.entityId).to.equal(entity.id);
        expect([...entity.components.values()]).to.include(testComponent);
      });

      it('throws an error if unable to find given entity', () => {
        expect(() => new TestComponent(-1)).to.throw(Error);
      });
    });

    describe('destroy', () => {
      it('deletes itself from its entity', () => {
        const entity = new Entity('test-entity');
        const testComponent = new TestComponent(entity.id);

        expect(testComponent).to.exist;
        expect(testComponent.entityId).to.equal(entity.id);

        testComponent.destroy();
        expect([...entity.components.values()]).not.to.include(testComponent);
      });

      it('throws an error if attached to bad entity', () => {
        const entity = new Entity('test-entity');
        const testComponent = new TestComponent(entity.id);
        Entity.map.delete(entity.id);

        expect(() => testComponent.destroy()).to.throw(Error);
      });
    });

    describe('events', () => {
      it('correctly fires component added events', async () => {
        const testSpy = spy();
        Component.added$.subscribe(testSpy);

        const entity = new Entity('test-entity');
        const testComponent = new TestComponent(entity.id);

        expect(testComponent).to.exist;
        expect(testComponent.entityId).to.equal(entity.id);
        expect(testSpy).to.have.been.called;
        expect(testSpy).to.have.been.calledWith(testComponent);
      });

      it('correctly fires component removed events', () => {
        const testSpy = spy();
        Component.removed$.subscribe(testSpy);

        const entity = new Entity('test-entity');
        const testComponent = new TestComponent(entity.id);

        expect(testComponent).to.exist;
        expect(testComponent.entityId).to.equal(entity.id);
        testComponent.destroy();

        expect(testSpy).to.have.been.called;
        expect(testSpy).to.have.been.calledWith(testComponent);
      });
    });
  });
});
