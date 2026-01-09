class SudokuSolver {

  validate(puzzleString) {
    // Check if puzzle string exists
    if (!puzzleString) {
      return { valid: false, error: 'Required field missing' };
    }
    
    // Check if length is 81
    if (puzzleString.length !== 81) {
      return { valid: false, error: 'Expected puzzle to be 81 characters long' };
    }
    
    // Check if it contains only valid characters (1-9 or .)
    if (!/^[1-9.]+$/.test(puzzleString)) {
      return { valid: false, error: 'Invalid characters in puzzle' };
    }
    
    return { valid: true };
  }

  checkRowPlacement(puzzleString, row, column, value) {
    // Convert row letter (A-I) to index (0-8)
    const rowIndex = row.charCodeAt(0) - 'A'.charCodeAt(0);
    // Convert column from 1-indexed to 0-indexed
    const colIndex = column - 1;
    
    // Check the entire row
    for (let col = 0; col < 9; col++) {
      if (col === colIndex) continue; // Skip the cell we're checking
      
      const index = rowIndex * 9 + col;
      if (puzzleString[index] === value.toString()) {
        return false; // Value already exists in row
      }
    }
    
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    // Convert row letter (A-I) to index (0-8)
    const rowIndex = row.charCodeAt(0) - 'A'.charCodeAt(0);
    // Convert column from 1-indexed to 0-indexed
    const colIndex = column - 1;
    
    // Check the entire column
    for (let r = 0; r < 9; r++) {
      if (r === rowIndex) continue; // Skip the cell we're checking
      
      const index = r * 9 + colIndex;
      if (puzzleString[index] === value.toString()) {
        return false; // Value already exists in column
      }
    }
    
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    // Convert row letter (A-I) to index (0-8)
    const rowIndex = row.charCodeAt(0) - 'A'.charCodeAt(0);
    // Convert column from 1-indexed to 0-indexed
    const colIndex = column - 1;
    
    // Find the top-left corner of the 3x3 region
    const regionRowStart = Math.floor(rowIndex / 3) * 3;
    const regionColStart = Math.floor(colIndex / 3) * 3;
    
    // Check the entire 3x3 region
    for (let r = regionRowStart; r < regionRowStart + 3; r++) {
      for (let c = regionColStart; c < regionColStart + 3; c++) {
        if (r === rowIndex && c === colIndex) continue; // Skip the cell we're checking
        
        const index = r * 9 + c;
        if (puzzleString[index] === value.toString()) {
          return false; // Value already exists in region
        }
      }
    }
    
    return true;
  }

  solve(puzzleString) {
    // Validate the puzzle first
    const validation = this.validate(puzzleString);
    if (!validation.valid) {
      return false;
    }
    
    // Convert string to array for easier manipulation
    let grid = puzzleString.split('');
    
    // Find the next empty cell
    const findEmpty = () => {
      for (let i = 0; i < 81; i++) {
        if (grid[i] === '.') {
          return i;
        }
      }
      return -1; // No empty cells found
    };
    
    // Check if a value is valid at a given position
    const isValid = (index, value) => {
      const row = Math.floor(index / 9);
      const col = index % 9;
      const rowLetter = String.fromCharCode('A'.charCodeAt(0) + row);
      const column = col + 1; // Convert to 1-indexed for check functions
      
      // Temporarily place the value to check
      const temp = grid[index];
      grid[index] = '.'; // Treat current cell as empty for checking
      
      const rowValid = this.checkRowPlacement(grid.join(''), rowLetter, column, value);
      const colValid = this.checkColPlacement(grid.join(''), rowLetter, column, value);
      const regionValid = this.checkRegionPlacement(grid.join(''), rowLetter, column, value);
      
      grid[index] = temp; // Restore original value
      
      return rowValid && colValid && regionValid;
    };
    
    // Backtracking solver
    const backtrack = () => {
      const emptyIndex = findEmpty();
      
      // No empty cells means puzzle is solved
      if (emptyIndex === -1) {
        return true;
      }
      
      // Try values 1-9
      for (let num = 1; num <= 9; num++) {
        if (isValid(emptyIndex, num)) {
          grid[emptyIndex] = num.toString();
          
          if (backtrack()) {
            return true;
          }
          
          // Backtrack
          grid[emptyIndex] = '.';
        }
      }
      
      return false; // No valid number found
    };
    
    // Check if initial puzzle is valid (no conflicts)
    for (let i = 0; i < 81; i++) {
      if (grid[i] !== '.') {
        const value = grid[i];
        grid[i] = '.'; // Temporarily remove to check
        
        const row = Math.floor(i / 9);
        const col = i % 9;
        const rowLetter = String.fromCharCode('A'.charCodeAt(0) + row);
        const column = col + 1; // Convert to 1-indexed
        
        if (!this.checkRowPlacement(grid.join(''), rowLetter, column, value) ||
            !this.checkColPlacement(grid.join(''), rowLetter, column, value) ||
            !this.checkRegionPlacement(grid.join(''), rowLetter, column, value)) {
          return false; // Invalid initial puzzle
        }
        
        grid[i] = value; // Restore
      }
    }
    
    if (backtrack()) {
      return grid.join('');
    }
    
    return false;
  }
}

module.exports = SudokuSolver;

