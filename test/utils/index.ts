import 'mocha';
import { expect } from 'chai';
import { spy } from 'sinon';

import { invalid, ready, Color, clamp } from '../../src/utils';

describe('utils:', () => {
  describe('invalid()', () => {
    let argument: any;

    function isInvalid() {
      expect(invalid(argument)).to.be.true;
    }

    function isNotInvalid() {
      expect(invalid(argument)).to.be.false;
    }

    context('with undefined', () => {
      before(() => argument = undefined);
      it('should return true', isInvalid);
    });

    context('with null', () => {
      before(() => argument = null);
      it('should return true', isInvalid);
    });

    context('with {}', () => {
      before(() => argument = {});
      it('should return false', isNotInvalid);
    });

    context('with false', () => {
      before(() => argument = false);
      it('should return false', isNotInvalid);
    });

    context('with 0', () => {
      before(() => argument = 0);
      it('should return false', isNotInvalid);
    });
  });

  describe('ready()', () => {
    const eventListenerSpy = spy();
    const cbSpy = spy();

    const document = {
      readyState: '',
      addEventListener: eventListenerSpy
    };

    beforeEach(() => {
      (<any>global).document = document;
      cbSpy.resetHistory();
      eventListenerSpy.resetHistory();
    });

    context('ready state is \'loading\'', () => {
      beforeEach(() => {
        document.readyState = 'loading';
      });

      it('does not call callback', () => {
        ready(cbSpy);
        expect(cbSpy.called).to.be.false;
      });

      it('does call add event listener', () => {
        ready(cbSpy);
        expect(eventListenerSpy.called).to.be.true;
        expect(eventListenerSpy.calledWith('DOMContentLoaded', cbSpy)).to.be.true;
      });
    });

    context('ready state is \'completed\'', () => {
      beforeEach(() => {
        document.readyState = 'completed';
      });

      it('does call callback', () => {
        ready(cbSpy);
        expect(cbSpy.called).to.be.true;
      });

      it('does not call event listener', () => {
        ready(cbSpy);
        expect(eventListenerSpy.called).to.be.false;
      });
    });
  });

  describe('clamp()', () => {
    it('returns n if a <= n <= b', () => {
      expect(clamp(5, 0, 10)).to.equal(5);
    });

    it('returns a if n <= a <= b', () => {
      expect(clamp(0, 5, 10)).to.equal(5);
    });

    it('returns b if a <= b <= n', () => {
      expect(clamp(10, 0, 5)).to.equal(5);
    });

    it('returns n if a == n == b', () => {
      expect(clamp(3, 3, 3)).to.equal(3);
    });
  });

  describe('Color', () => {
    let color: Color;

    describe('#WHITE', () => {
      it('returns #FFFFFF', () => {
        color = Color.WHITE;
        expect(color.toString()).to.equal('#FFFFFF');
        expect(color.r).to.equal(255);
        expect(color.g).to.equal(255);
        expect(color.b).to.equal(255);
      });
    });

    describe('#BLACK', () => {
      it('returns #000000', () => {
        color = Color.BLACK;
        expect(color.toString()).to.equal('#000000');
        expect(color.r).to.equal(0);
        expect(color.g).to.equal(0);
        expect(color.b).to.equal(0);
      });
    });

    describe('constructor', () => {
      it('accepts a standard hex string', () => {
        color = new Color('#123DEF');

        expect(color.toString()).to.equal('#123DEF');
        expect(color.r).to.equal(0x12);
        expect(color.g).to.equal(0x3D);
        expect(color.b).to.equal(0xEF);
      });

      it('accepts standard numbers', () => {
        color = new Color(238, 238, 238);

        expect(color.toString()).to.equal('#EEEEEE');
        expect(color.r).to.equal(0xEE);
        expect(color.g).to.equal(0xEE);
        expect(color.b).to.equal(0xEE);
      });

      it('automatically clamps numbers below 0 and above 255', () => {
        color = new Color(-255, 0, 512);

        expect(color.toString()).to.equal('#0000FF');
        expect(color.r).to.equal(0);
        expect(color.g).to.equal(0);
        expect(color.b).to.equal(255);
      });
    });

    describe('setters', () => {
      it('correctly sets new colors', () => {
        color = new Color('#99AAFF');

        expect(color.toString()).to.equal('#99AAFF');

        color.r = 0;
        color.g = 0xAB;
        color.b = 0x01;
        expect(color.toString()).to.equal('#00AB01');
      });
    });
  });
});
