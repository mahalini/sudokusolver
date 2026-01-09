'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body;
      
      // Check for missing required fields
      if (!puzzle || !coordinate || !value) {
        return res.json({ error: 'Required field(s) missing' });
      }
      
      // Validate puzzle
      const validation = solver.validate(puzzle);
      if (!validation.valid) {
        return res.json({ error: validation.error });
      }
      
      // Validate coordinate format (A-I followed by 1-9)
      if (!/^[A-I][1-9]$/.test(coordinate)) {
        return res.json({ error: 'Invalid coordinate' });
      }
      
      // Validate value (must be 1-9)
      if (!/^[1-9]$/.test(value)) {
        return res.json({ error: 'Invalid value' });
      }
      
      const row = coordinate[0];
      const column = parseInt(coordinate[1]); // Keep as 1-indexed for check functions
      const rowIndex = row.charCodeAt(0) - 'A'.charCodeAt(0);
      const cellIndex = rowIndex * 9 + (column - 1);
      
      // Check if value is already placed at this coordinate
      if (puzzle[cellIndex] === value) {
        return res.json({ valid: true });
      }
      
      // Check row, column, and region
      const conflicts = [];
      
      if (!solver.checkRowPlacement(puzzle, row, column, value)) {
        conflicts.push('row');
      }
      
      if (!solver.checkColPlacement(puzzle, row, column, value)) {
        conflicts.push('column');
      }
      
      if (!solver.checkRegionPlacement(puzzle, row, column, value)) {
        conflicts.push('region');
      }
      
      if (conflicts.length > 0) {
        return res.json({ valid: false, conflict: conflicts });
      }
      
      return res.json({ valid: true });
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      const { puzzle } = req.body;
      
      // Check for missing puzzle
      if (!puzzle) {
        return res.json({ error: 'Required field missing' });
      }
      
      // Validate puzzle
      const validation = solver.validate(puzzle);
      if (!validation.valid) {
        return res.json({ error: validation.error });
      }
      
      // Solve puzzle
      const solution = solver.solve(puzzle);
      
      if (!solution) {
        return res.json({ error: 'Puzzle cannot be solved' });
      }
      
      return res.json({ solution });
    });
};
// end of