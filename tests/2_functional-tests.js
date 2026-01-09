const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
  
  const validPuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
  const solvedPuzzle = '135762984946381257728459613694517832812936745357824196473298561581673429269145378';
  const unsolvablePuzzle = '115..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
  
  // Test 1: Solve a puzzle with valid puzzle string: POST request to /api/solve
  test('Solve a puzzle with valid puzzle string: POST request to /api/solve', function(done) {
    chai.request(server)
      .post('/api/solve')
      .send({ puzzle: validPuzzle })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, 'solution');
        assert.equal(res.body.solution, solvedPuzzle);
        done();
      });
  });
  
  // Test 2: Solve a puzzle with missing puzzle string: POST request to /api/solve
  test('Solve a puzzle with missing puzzle string: POST request to /api/solve', function(done) {
    chai.request(server)
      .post('/api/solve')
      .send({})
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'Required field missing');
        done();
      });
  });
  
  // Test 3: Solve a puzzle with invalid characters: POST request to /api/solve
  test('Solve a puzzle with invalid characters: POST request to /api/solve', function(done) {
    const invalidPuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.3X.';
    chai.request(server)
      .post('/api/solve')
      .send({ puzzle: invalidPuzzle })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'Invalid characters in puzzle');
        done();
      });
  });
  
  // Test 4: Solve a puzzle with incorrect length: POST request to /api/solve
  test('Solve a puzzle with incorrect length: POST request to /api/solve', function(done) {
    const shortPuzzle = '1.5..2.84..63.12.7.2..5.....9..1';
    chai.request(server)
      .post('/api/solve')
      .send({ puzzle: shortPuzzle })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
        done();
      });
  });
  
  // Test 5: Solve a puzzle that cannot be solved: POST request to /api/solve
  test('Solve a puzzle that cannot be solved: POST request to /api/solve', function(done) {
    chai.request(server)
      .post('/api/solve')
      .send({ puzzle: unsolvablePuzzle })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'Puzzle cannot be solved');
        done();
      });
  });
  
  // Test 6: Check a puzzle placement with all fields: POST request to /api/check
  test('Check a puzzle placement with all fields: POST request to /api/check', function(done) {
    chai.request(server)
      .post('/api/check')
      .send({ 
        puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
        coordinate: 'A1',
        value: '7'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, 'valid');
        assert.isTrue(res.body.valid);
        done();
      });
  });
  
  // Test 7: Check a puzzle placement with single placement conflict: POST request to /api/check
  test('Check a puzzle placement with single placement conflict: POST request to /api/check', function(done) {
    chai.request(server)
      .post('/api/check')
      .send({ 
        puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
        coordinate: 'A1',
        value: '6'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, 'valid');
        assert.isFalse(res.body.valid);
        assert.property(res.body, 'conflict');
        assert.isArray(res.body.conflict);
        assert.equal(res.body.conflict.length, 1);
        done();
      });
  });
  
  // Test 8: Check a puzzle placement with multiple placement conflicts: POST request to /api/check
  test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check', function(done) {
    chai.request(server)
      .post('/api/check')
      .send({ 
        puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
        coordinate: 'A1',
        value: '1'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, 'valid');
        assert.isFalse(res.body.valid);
        assert.property(res.body, 'conflict');
        assert.isArray(res.body.conflict);
        assert.isAtLeast(res.body.conflict.length, 2);
        done();
      });
  });
  
  // Test 9: Check a puzzle placement with all placement conflicts: POST request to /api/check
  test('Check a puzzle placement with all placement conflicts: POST request to /api/check', function(done) {
    chai.request(server)
      .post('/api/check')
      .send({ 
        puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
        coordinate: 'A1',
        value: '5'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, 'valid');
        assert.isFalse(res.body.valid);
        assert.property(res.body, 'conflict');
        assert.isArray(res.body.conflict);
        assert.equal(res.body.conflict.length, 3);
        assert.include(res.body.conflict, 'row');
        assert.include(res.body.conflict, 'column');
        assert.include(res.body.conflict, 'region');
        done();
      });
  });
  
  // Test 10: Check a puzzle placement with missing required fields: POST request to /api/check
  test('Check a puzzle placement with missing required fields: POST request to /api/check', function(done) {
    chai.request(server)
      .post('/api/check')
      .send({ 
        puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
        coordinate: 'A1'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'Required field(s) missing');
        done();
      });
  });
  
  // Test 11: Check a puzzle placement with invalid characters: POST request to /api/check
  test('Check a puzzle placement with invalid characters: POST request to /api/check', function(done) {
    const invalidPuzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..X..';
    chai.request(server)
      .post('/api/check')
      .send({ 
        puzzle: invalidPuzzle,
        coordinate: 'A1',
        value: '7'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'Invalid characters in puzzle');
        done();
      });
  });
  
  // Test 12: Check a puzzle placement with incorrect length: POST request to /api/check
  test('Check a puzzle placement with incorrect length: POST request to /api/check', function(done) {
    const shortPuzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71';
    chai.request(server)
      .post('/api/check')
      .send({ 
        puzzle: shortPuzzle,
        coordinate: 'A1',
        value: '7'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
        done();
      });
  });
  
  // Test 13: Check a puzzle placement with invalid placement coordinate: POST request to /api/check
  test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', function(done) {
    chai.request(server)
      .post('/api/check')
      .send({ 
        puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
        coordinate: 'Z1',
        value: '7'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'Invalid coordinate');
        done();
      });
  });
  
  // Test 14: Check a puzzle placement with invalid placement value: POST request to /api/check
  test('Check a puzzle placement with invalid placement value: POST request to /api/check', function(done) {
    chai.request(server)
      .post('/api/check')
      .send({ 
        puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
        coordinate: 'A1',
        value: '0'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'Invalid value');
        done();
      });
  });
  
});


