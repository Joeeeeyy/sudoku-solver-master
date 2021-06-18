'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {

  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const {
        puzzle,
        coordinate,
        value
      } = req.body;

      // Validate coordinate and value
      if (!puzzle || !value || !coordinate) {
        return res.json({
          error: "Required field(s) missing"
        })
      }

      const row = coordinate.split('')[0];
      const column = coordinate.split('')[1];

      if (coordinate.length !== 2 || !/[a-i]/i.test(row) || !/[1-9]/i.test(column)) {
        return res.json({
          error: 'Invalid coordinate'
        });
      }

      if (!Number.isInteger(parseInt(value)) || value < 1 || value > 9) {
        //   if (!/[1-9]/i.test(value)) {
        res.json({
          error: "Invalid value"
        });
      }

      if (puzzle.length != 81) {
        return res.json({
          error: 'Expected puzzle to be 81 characters long'
        });
      }

      if (/[^0-9.]/g.test(puzzle)) {
        return res.json({
          error: 'Invalid characters in puzzle'
        });
      }

      // Check placement

      // validCol check
      const colCheck = solver.checkColPlacement(puzzle, row, column, value);
      // validRow check
      const rowCheck = solver.checkRowPlacement(puzzle, row, column, value);
      // validReg check
      const regionCheck = solver.checkRegionPlacement(puzzle, row, column, value);

      const conflicts = [];
      if (colCheck && rowCheck && regionCheck) {
        return res.json({
          valid: true
        });
      } else {
        if (!rowCheck) {
          conflicts.push('row');
        }
        if (!colCheck) {
          conflicts.push('column');
        }
        if (!regionCheck) {
          conflicts.push('region');
        }
        return res.json({
          valid: false,
          conflict: conflicts
        });
      }
    });

  app.route('/api/solve')
    .post((req, res) => {
      const {
        puzzle
      } = req.body;

      if (!puzzle) {
        return res.json({
          error: 'Required field missing'
        })
      }

      if (puzzle.length != 81) {
        return res.json({
          error: 'Expected puzzle to be 81 characters long'
        });
      }

      if (/[^0-9.]/g.test(puzzle)) {
        return res.json({
          error: 'Invalid characters in puzzle'
        });
      }

      let solvedString = solver.solve(puzzle);
      if (!solvedString) {
        res.json({
          error: 'Puzzle cannot be solved'
        });
      } else {
        res.json({
          solution: solvedString
        });
      }

    });
};