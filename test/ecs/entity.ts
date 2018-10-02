import 'mocha';
import { expect } from 'chai';

import { Entity } from '../../src/ecs/entity';

describe('ECS:', () => {
  describe('Entity', () => {
    it('exists', () => {
      expect(Entity).to.exist;
    });
  });
});
