import 'mocha';
import { expect } from 'chai';

import { Line } from '../../src/utils/line';

describe('utils:', () => {
  describe('line', () => {
    it('exists', () => {
      expect(Line).to.exist;
    });
  });
});
