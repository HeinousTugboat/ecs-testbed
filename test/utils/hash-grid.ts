import 'mocha';
import { expect } from 'chai';

import { HashGrid, GridItem } from '../../src/utils/hash-grid';
import { Vector } from '../../src/utils';

describe('utils:', () => {
  describe('grid-item', () => {
    it('exists', () => {
      expect(GridItem).to.exist;
    });

    it('returns the correct item', () => {
      const testItem = new GridItem(5, 6, 'test-item');

      expect(testItem.item).to.equal('test-item');
    });

    it('returns the correct x and y', () => {
      const testItem = new GridItem(5, 6, 'test-item');

      expect(testItem.x).to.equal(5);
      expect(testItem.y).to.equal(6);
    });
  });

  describe('hash-grid', () => {
    it('exists', () => {
      expect(HashGrid).to.exist;
    });

    describe('constructor', () => {
      it('creates the proper size grid of empty cells', () => {
        const grid = new HashGrid<string>(100, 100, 10);

        expect(grid['xSize']).to.equal(11);
        expect(grid['ySize']).to.equal(11);
        expect(grid['offset']).to.equal(5);
        expect(grid['data'].length).to.equal(11);
        grid['data'].forEach(col => {
          expect(col.length).to.equal(11);

          col.forEach(cell => {
            expect(cell).to.be.empty;
          });
        });
      });

      it('properly adds any items passed in via optional constructor argument', () => {
        const gridItems = [
          new GridItem(1, 1, 'test-item-upper-left'),
          new GridItem(10, 1, 'test-item-upper-middle'),
          new GridItem(20, 1, 'test-item-upper-right'),
          new GridItem(1, 10, 'test-item-middle-left'),
          new GridItem(10, 10, 'test-item-middle-middle'),
          new GridItem(20, 10, 'test-item-right-middle'),
          new GridItem(1, 20, 'test-item-lower-left'),
          new GridItem(10, 20, 'test-item-lower-middle'),
          new GridItem(20, 20, 'test-item-lower-right')
        ];
        const grid = new HashGrid<string>(100, 100, 10, gridItems);

        expect(grid['data'][0][0].length).to.equal(1);
        const data = grid['data'].reduce((rowAcc, row) => {
          return [...rowAcc, ...row];
        }).reduce((cellAcc, cell) => {
          return [...cellAcc, ...cell];
        });

        expect(data).to.contain.members(gridItems);
      });
    });

    describe('getNeighbors', () => {
      let grid: HashGrid<string>;
      let testItems: GridItem<string>[];
      let testItem: GridItem<string>;
      beforeEach(() => {
        grid = new HashGrid<string>(100, 100, 10);
        testItems = [
          new GridItem(1, 1, 'test-item-upper-left'),
          new GridItem(10, 1, 'test-item-upper-middle'),
          new GridItem(20, 1, 'test-item-upper-right'),
          new GridItem(1, 10, 'test-item-middle-left'),
          new GridItem(10, 10, 'test-item-middle-middle'),
          new GridItem(20, 10, 'test-item-right-middle'),
          new GridItem(1, 20, 'test-item-lower-left'),
          new GridItem(10, 20, 'test-item-lower-middle'),
          new GridItem(20, 20, 'test-item-lower-right')
        ];
        testItems.forEach(i => grid.add(i));

        testItem = new GridItem(10, 10, 'item-under-test');
        grid.add(testItem);
      });

      it('correctly gets neighbors from all 8 adjacent cells', () => {
        const neighbors = grid.getNeighbors(testItem.position);
        expect(neighbors.length).to.equal(10);
      });

      it('correctly handles edge and corner cases', () => {
        const neighbors = grid.getNeighbors(new Vector(1, 1));
        expect(neighbors.length).to.equal(5);

        const neighbors2 = grid.getNeighbors(new Vector(-10, 30));
        expect(neighbors2.length).to.equal(2);
      });
    });

    describe('move', () => {
      it('correctly changes an item\'s position and cell', () => {
        const grid = new HashGrid<string>(100, 100, 10);
        const testItem = new GridItem(2, 2, 'test-item');

        grid.add(testItem);
        expect(grid['data'][0][0]).to.contain(testItem);
        grid.move(testItem, new Vector(1, 1));
        expect(testItem.x).to.equal(1);
        expect(testItem.y).to.equal(1);
        expect(grid['data'][0][0]).to.contain(testItem);
        grid.move(testItem, new Vector(10, 21));
        expect(testItem.x).to.equal(10);
        expect(testItem.y).to.equal(21);
        expect(grid['data'][0][0]).to.be.empty;
        expect(grid['data'][1][2]).to.contain(testItem);
      });
    });

    describe('add', () => {
      it('adds the item in the correct cell', () => {
        const grid = new HashGrid<string>(100, 100, 10);
        const testItem = new GridItem(2, 2, 'test-item');

        expect(grid['data'][0][0]).to.be.empty;
        grid.add(testItem);
        expect(grid['data'][0][0]).to.not.be.empty;
        expect(grid['data'][0][0]).to.contain(testItem);
      });

      it('adds items outside of the grid to the nearest edge cell', () => {
        const grid = new HashGrid<string>(100, 100, 10);
        const testItem = new GridItem(105, 0, 'test-item');

        expect(grid['data'][10][0]).to.be.empty;
        grid.add(testItem);
        expect(grid['data'][10][0]).to.not.be.empty;
        expect(grid['data'][10][0]).to.contain(testItem);
      });
    });
  });
});
