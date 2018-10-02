import 'mocha';
import { expect } from 'chai';

import { RenderComponent, RenderSystem } from '../../src/components/render';

describe('Components:', () => {
  describe('RenderComponent', () => {
    it('exists', () => {
      expect(RenderComponent).to.exist;
    });
  });

  describe('RenderSystem', () => {
    it('exists', () => {
      expect(RenderSystem).to.exist;
    });
  });
});
