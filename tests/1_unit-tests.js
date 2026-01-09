const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver;

suite('Unit Tests', () => {
  
  const validPuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
  const solvedPuzzle = '135762984946381257728459613694517832812936745357824196473298561581673429269145378';
  
  suiteSetup(() => {
    solver = new Solver();
  });
  
  // Test 1: Logic handles a valid puzzle string of 81 characters
  test('Logic handles a valid puzzle string of 81 characters', function(done) {
    const result = solver.validate(validPuzzle);
    assert.isTrue(result.valid);
    done();
  });
  
  // Test 2: Logic handles a puzzle string with invalid characters (not 1-9 or .)
  test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', function(done) {
    const invalidPuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.3X.';
    const result = solver.validate(invalidPuzzle);
    assert.isFalse(result.valid);
    assert.equal(result.error, 'Invalid characters in puzzle');
    done();
  });
  
  // Test 3: Logic handles a puzzle string that is not 81 characters in length
  test('Logic handles a puzzle string that is not 81 characters in length', function(done) {
    const shortPuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16';
    const result = solver.validate(shortPuzzle);
    assert.isFalse(result.valid);
    assert.equal(result.error, 'Expected puzzle to be 81 characters long');
    done();
  });
  
  // Test 4: Logic handles a valid row placement
  test('Logic handles a valid row placement', function(done) {
    const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
    const result = solver.checkRowPlacement(puzzle, 'A', 1, 3);
    assert.isTrue(result);
    done();
  });
  
  // Test 5: Logic handles an invalid row placement
  test('Logic handles an invalid row placement', function(done) {
    const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
    const result = solver.checkRowPlacement(puzzle, 'A', 1, 9);
    assert.isFalse(result);
    done();
  });
  
  // Test 6: Logic handles a valid column placement
  test('Logic handles a valid column placement', function(done) {
    const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
    const result = solver.checkColPlacement(puzzle, 'A', 1, 3);
    assert.isTrue(result);
    done();
  });
  
  // Test 7: Logic handles an invalid column placement
  test('Logic handles an invalid column placement', function(done) {
    const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
    const result = solver.checkColPlacement(puzzle, 'A', 1, 8);
    assert.isFalse(result);
    done();
  });
  
  // Test 8: Logic handles a valid region (3x3 grid) placement
  test('Logic handles a valid region (3x3 grid) placement', function(done) {
    const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
    const result = solver.checkRegionPlacement(puzzle, 'A', 1, 7);
    assert.isTrue(result);
    done();
  });
  
  // Test 9: Logic handles an invalid region (3x3 grid) placement
  test('Logic handles an invalid region (3x3 grid) placement', function(done) {
    const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
    const result = solver.checkRegionPlacement(puzzle, 'A', 1, 9);
    assert.isFalse(result);
    done();
  });
  
  // Test 10: Valid puzzle strings pass the solver
  test('Valid puzzle strings pass the solver', function(done) {
    const result = solver.solve(validPuzzle);
    assert.isString(result);
    assert.equal(result.length, 81);
    done();
  });
  
  // Test 11: Invalid puzzle strings fail the solver
  test('Invalid puzzle strings fail the solver', function(done) {
    const invalidPuzzle = '115..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    const result = solver.solve(invalidPuzzle);
    assert.isFalse(result);
    done();
  });
  
  // Test 12: Solver returns the expected solution for an incomplete puzzle
  test('Solver returns the expected solution for an incomplete puzzle', function(done) {
    const result = solver.solve(validPuzzle);
    assert.equal(result, solvedPuzzle);
    done();
  });
  
});

