import 'mocha';
import { expect } from 'chai';

import { Component } from '../../src/ecs/component';

describe('ECS:', () => {
  describe('Component', () => {
    it('exists', () => {
      expect(Component).to.exist;
    });
  });
});
