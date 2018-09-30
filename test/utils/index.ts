import 'mocha';
import { expect } from 'chai';
import { spy } from 'sinon';

import { invalid, ready } from '../../src/utils';

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
});
