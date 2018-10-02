import 'mocha';
import { expect } from 'chai';

import { System } from '../../src/ecs/system';

describe('ECS:', () => {
  describe('System', () => {
    it('exists', () => {
      expect(System).to.exist;
    });
  });
});
