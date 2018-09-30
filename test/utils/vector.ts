import 'mocha';
import { expect } from 'chai';
import { spy, SinonSpy } from 'sinon';

import { Vector, MutableVector } from '../../src/utils';

describe('utils/vector:', () => {
  describe('Vector', () => {
    let v1: Vector;
    let v2: Vector;

    describe('#zero', () => {
      it('returns (0, 0)', () => {
        v1 = Vector.zero;
        v2 = new Vector(0, 0);
        expect(v1.x).to.equal(v2.x);
        expect(v1.y).to.equal(v2.y);
      });
    });

    describe('#distance', () => {
      it('returns 2 for (3, 4) and (3, 2)', () => {
        v1 = new Vector(3, 4);
        v2 = new Vector(3, 2);
        expect(Vector.distance(v1, v2)).to.equal(2);
        expect(Vector.distance(v2, v1)).to.equal(2);
      });

      it('returns 5 for (1, 3) and (-2, -1)', () => {
        v1 = new Vector(1, 3);
        v2 = new Vector(-2, -1);
        expect(Vector.distance(v1, v2)).to.equal(5);
        expect(Vector.distance(v2, v1)).to.equal(5);
      });
    });

    describe('#distSquare', () => {
      it('returns 4 for (3, 4) and (3, 2)', () => {
        v1 = new Vector(3, 4);
        v2 = new Vector(3, 2);
        expect(Vector.distSquare(v1, v2)).to.equal(4);
        expect(Vector.distSquare(v2, v1)).to.equal(4);
      });

      it('returns 25 for (1, 3) and -2, -1)', () => {
        v1 = new Vector(1, 3);
        v2 = new Vector(-2, -1);
        expect(Vector.distSquare(v1, v2)).to.equal(25);
        expect(Vector.distSquare(v2, v1)).to.equal(25);
      });
    });

    describe('#lerp', () => {
      it('returns (3, 2.5) for (3, 4) to (3, 2) at 0.75t', () => {
        v1 = new Vector(3, 4);
        v2 = new Vector(3, 2);

        const result = Vector.lerp(v1, v2, 0.75);
        expect(result.x).to.equal(3);
        expect(result.y).to.be.closeTo(2.5, 0.001);
      });
    });

    describe('constructor', () => {
      it('defaults to (0, 0)', () => {
        v1 = new Vector();
        expect(v1.x).to.equal(0);
        expect(v1.y).to.equal(0);
      });
    });

    describe('toString', () => {
      it('returns \'(3, 4)\' for (3, 4)', () => {
        v1 = new Vector(3, 4);
        expect(v1.toString()).to.equal('(3, 4)');
      });
    });

    describe('magnitude', () => {
      it('returns 5.0 for (3,4)', () => {
        v1 = new Vector(3, 4);

        expect(v1.magnitude).to.equal(5.0);
      });
    });

    describe('magSquare', () => {
      it('returns 25.0 for (3,4)', () => {
        v1 = new Vector(3, 4);

        expect(v1.magSquare).to.equal(25.0);
      });
    });

    describe('normal', () => {
      it('returns (1, 0) for (5, 0)', () => {
        v1 = new Vector(5, 0);
        const normal = v1.normal;
        expect(normal.x).to.equal(1);
        expect(normal.y).to.equal(0);
      });

      it('returns (0, 1) for (0, 5)', () => {
        v1 = new Vector(0, 5);
        const normal = v1.normal;
        expect(normal.x).to.equal(0);
        expect(normal.y).to.equal(1);
      });

      it('returns (0.707, 0.707) for (5, 5) [close to sqrt(1/2)]', () => {
        v1 = new Vector(5, 5);
        const normal = v1.normal;
        expect(normal.x).to.be.closeTo(0.707, 0.001);
        expect(normal.y).to.be.closeTo(0.707, 0.001);
      });
    });

    describe('perpX', () => {
      it('returns (2, -1) for (1, 2)', () => {
        v1 = new Vector(1, 2);
        const perpX = v1.perpX;
        expect(perpX.x).to.equal(2);
        expect(perpX.y).to.equal(-1);
      });
    });

    describe('perpY', () => {
      it('returns (-2, 1) for (1, 2)', () => {
        v1 = new Vector(1, 2);
        const perpY = v1.perpY;
        expect(perpY.x).to.equal(-2);
        expect(perpY.y).to.equal(1);
      });
    });

    describe('equals()', () => {
      it('returns true for (3, 5) and (3, 5)', () => {
        v1 = new Vector(3, 5);
        v2 = new Vector(3, 5);
        expect(v1.equals(v2)).to.be.true;
        expect(v2.equals(v1)).to.be.true;
      });

      it('returns true for (0.2+0.1, 0.2+0.1) and (0.3, 0.3)', () => {
        v1 = new Vector(0.2 + 0.1, 0.2 + 0.1);
        v2 = new Vector(0.3, 0.3);
        expect(v1.equals(v2)).to.be.true;
        expect(v2.equals(v1)).to.be.true;
      });

      it('returns false for (3, 5) and (5, 3)', () => {
        v1 = new Vector(3, 5);
        v2 = new Vector(5, 3);
        expect(v1.equals(v2)).to.be.false;
        expect(v2.equals(v1)).to.be.false;
      });

      it('returns false for (1, 0) and (2, 0)', () => {
        v1 = new Vector(1, 0);
        v2 = new Vector(2, 0);
        expect(v1.equals(v2)).to.be.false;
        expect(v2.equals(v1)).to.be.false;
      });

      it('returns false for (0, 0) and (0, 1)', () => {
        v1 = new Vector(0, 0);
        v2 = new Vector(0, 1);
        expect(v1.equals(v2)).to.be.false;
        expect(v2.equals(v1)).to.be.false;
      });
    });

    describe('isOpposite()', () => {
      it('returns true for (1, 0) and (-1, 0)', () => {
        v1 = new Vector(1, 0);
        v2 = new Vector(-1, 0);
        expect(v1.isOpposite(v2)).to.be.true;
        expect(v2.isOpposite(v1)).to.be.true;
      });

      it('returns false for (1, 0) and (-1, 0.001)', () => {
        v1 = new Vector(1, 0);
        v2 = new Vector(-1, 0.001);
        expect(v1.isOpposite(v2)).to.be.false;
        expect(v2.isOpposite(v1)).to.be.false;
      });

      it('returns false for (1, 0) and (0, 1)', () => {
        v1 = new Vector(1, 0);
        v2 = new Vector(0, 1);
        expect(v1.isOpposite(v2)).to.be.false;
        expect(v2.isOpposite(v1)).to.be.false;
      });

      it('returns false for (1, 0) and (1, 0)', () => {
        v1 = new Vector(1, 0);
        v2 = new Vector(1, 0);
        expect(v1.isOpposite(v2)).to.be.false;
        expect(v2.isOpposite(v1)).to.be.false;
      });
    });

    describe('isParallel()', () => {
      it('returns true for (1, 1) and (2, 2)', () => {
        v1 = new Vector(1, 1);
        v2 = new Vector(2, 2);
        expect(v1.isParallel(v2)).to.be.true;
        expect(v2.isParallel(v1)).to.be.true;
      });

      it('returns false for (1, 0) and (0, 1)', () => {
        v1 = new Vector(1, 0);
        v2 = new Vector(0, 1);
        expect(v1.isParallel(v2)).to.be.false;
        expect(v2.isParallel(v1)).to.be.false;
      });
    });

    describe('isPerpendicular()', () => {
      it('returns true for (1, 0) and (0, 2)', () => {
        v1 = new Vector(1, 0);
        v2 = new Vector(0, 2);
        expect(v1.isPerpendicular(v2)).to.be.true;
        expect(v2.isPerpendicular(v1)).to.be.true;
      });

      it('returns false for (1, 0) and (-1, 0)', () => {
        v1 = new Vector(1, 0);
        v2 = new Vector(-1, 0);
        expect(v1.isPerpendicular(v2)).to.be.false;
        expect(v2.isPerpendicular(v1)).to.be.false;
      });
    });

    describe('add()', () => {
      it('returns (5, 5) for (3, 4) + (2, 1)', () => {
        v1 = new Vector(3, 4);
        v2 = new Vector(2, 1);

        let result = v1.add(v2);
        expect(result.x).to.equal(5);
        expect(result.y).to.equal(5);

        result = v2.add(v1);
        expect(result.x).to.equal(5);
        expect(result.y).to.equal(5);
      });
    });

    describe('subtract()', () => {
      it('returns (1, 3) for (3, 4) - (2, 1)', () => {
        v1 = new Vector(3, 4);
        v2 = new Vector(2, 1);

        let result = v1.subtract(v2);
        expect(result.x).to.equal(1);
        expect(result.y).to.equal(3);

        result = v2.subtract(v1);
        expect(result.x).to.not.equal(1);
        expect(result.y).to.not.equal(3);
      });
    });

    describe('scale()', () => {
      it('returns (4.5, 6) for (3, 4) * 1.5', () => {
        v1 = new Vector(3, 4);
        v2 = v1.scale(1.5);

        expect(v2.x).to.be.closeTo(4.5, 0.001);
        expect(v2.y).to.be.closeTo(6, 0.001);
      });
    });

    describe('rotate()', () => {
      it('returns (-1, 1) for (1.414, 0) rotated 3*PI/4 [close to sqrt(2)]', () => {
        v1 = new Vector(Math.sqrt(2), 0);

        const result = v1.rotate(3 * Math.PI / 4);
        expect(result.x).to.be.closeTo(-1, 0.001);
        expect(result.y).to.be.closeTo(1, 0.001);
      });
    });

    describe('project()', () => {
      it('returns (3, 0) for (3, 4) onto (4, 0)', () => {
        v1 = new Vector(3, 4);
        v2 = new Vector(4, 0);

        let result = v1.project(v2);
        expect(result.x).to.equal(3);
        expect(result.y).to.equal(0);

        result = v2.project(v1);
        expect(result.x).to.not.equal(3);
        expect(result.y).to.not.equal(0);
      });
    });

    describe('reject()', () => {
      it('returns (0, 4) for (3, 4) from (4, 0)', () => {
        v1 = new Vector(3, 4);
        v2 = new Vector(4, 0);

        let result = v1.reject(v2);
        expect(result.x).to.equal(0);
        expect(result.y).to.equal(4);

        result = v2.reject(v1);
        expect(result.x).to.not.equal(0);
        expect(result.y).to.not.equal(4);
      });
    });

    describe('dot()', () => {
      it('returns 39 for (3, 4) . (5, 6)', () => {
        v1 = new Vector(3, 4);
        v2 = new Vector(5, 6);
        expect(v1.dot(v2)).to.be.closeTo(39, 0.001);
        expect(v2.dot(v1)).to.be.closeTo(39, 0.001);
      });
    });

    describe('pdot()', () => {
      it('returns -2 for (3, 4) p. (5, 6)', () => {
        v1 = new Vector(3, 4);
        v2 = new Vector(5, 6);
        expect(v1.pdot(v2)).to.be.closeTo(-2, 0.001);
      });

      it('returns 2 for (5, 6) p. (3, 4)', () => {
        v1 = new Vector(5, 6);
        v2 = new Vector(3, 4);
        expect(v1.pdot(v2)).to.be.closeTo(2, 0.001);
      });
    });

    describe('angle()', () => {
      it('returns PI/4 for (2, 2) and (2, 0)', () => {
        v1 = new Vector(2, 2);
        v2 = new Vector(2, 0);
        expect(v1.angle(v2)).to.be.closeTo(Math.PI / 4, 0.001);
        expect(v2.angle(v1)).to.be.closeTo(Math.PI / 4, 0.001);
      });
    });

    describe('pangle()', () => {
      it('returns -PI/4 for (2, 2) and (2, 0)', () => {
        v1 = new Vector(2, 2);
        v2 = new Vector(2, 0);
        expect(v1.pangle(v2)).to.be.closeTo(-Math.PI / 4, 0.001);
        expect(v2.pangle(v1)).to.be.closeTo(Math.PI / 4, 0.001);
      });
    });
  });

  describe('MutableVector', () => {
    it('inherits from Vector', () => {
      expect(MutableVector.prototype instanceof Vector).to.be.true;
    });

    let mutateSpy: SinonSpy;
    let v1: MutableVector;
    let v2: Vector;

    beforeEach(function spyOnMutate() {
      mutateSpy = spy(MutableVector.prototype, <any>'mutate');
    });

    afterEach(function restoreMutate() {
      mutateSpy.restore();
    });

    describe('add', () => {
      it('changes (3, 4) to (5,4) when (2, 0) added', () => {
        v1 = new MutableVector(3, 4);
        v2 = new Vector(2, 0);

        v2.add(v1);
        expect(v2.x).to.equal(2);
        expect(v2.y).to.equal(0);
        expect(mutateSpy.called).to.be.false;

        v1.add(v2);
        expect(v1.x).to.equal(5);
        expect(v1.y).to.equal(4);
        expect(mutateSpy.called).to.be.true;
        expect(mutateSpy.calledWith(v2, Vector.prototype.add)).to.be.true;
      });
    });

    describe('subtract', () => {
      it('changes (3, 4) to (3, 1) when (0, 3) subtracted', () => {
        v1 = new MutableVector(3, 4);
        v2 = new Vector(0, 3);

        v2.subtract(v1);
        expect(v2.x).to.equal(0);
        expect(v2.y).to.equal(3);
        expect(mutateSpy.called).to.be.false;

        v1.subtract(v2);
        expect(v1.x).to.equal(3);
        expect(v1.y).to.equal(1);
        expect(mutateSpy.called).to.be.true;
        expect(mutateSpy.calledWith(v2, Vector.prototype.subtract)).to.be.true;
      });
    });

    describe('scale', () => {
      it('changes (3, 4) to (1.5, 2) when scaled by 0.5', () => {
        v1 = new MutableVector(3, 4);

        v1.scale(0.5);
        expect(v1.x).to.be.closeTo(1.5, 0.001);
        expect(v1.y).to.be.closeTo(2, 0.001);
        expect(mutateSpy.called).to.be.true;
        expect(mutateSpy.calledWith(0.5, Vector.prototype.scale)).to.be.true;
      });
    });

    describe('rotate', () => {
      it('changes(1.414, 0) to (-1, 1) when rotated 3*PI/4 [close to sqrt(2)]', () => {
        v1 = new MutableVector(Math.sqrt(2), 0);

        v1.rotate(3 * Math.PI / 4);
        expect(v1.x).to.be.closeTo(-1, 0.001);
        expect(v1.y).to.be.closeTo(1, 0.001);
        expect(mutateSpy.called).to.be.true;
        expect(mutateSpy.calledWith(3 * Math.PI / 4, Vector.prototype.rotate)).to.be.true;
      });
    });

    xdescribe('project', () => {});
    xdescribe('reject', () => {});
  });
});
