const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');
const {
    puzzlesAndSolutions
} = require('../controllers/puzzle-strings');

chai.use(chaiHttp);

let validPuzzle = puzzlesAndSolutions[1][0];

suite('Functional Tests', () => {


    //Functional Test #1-Solve a puzzle with valid puzzle string: POST request to /api/solve
    test('#1-Solve a puzzle with valid puzzle string: POST request to /api/solve', (done) => {
        chai
            .request(server)
            .post('/api/solve')
            .send({
                puzzle: validPuzzle
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.isObject(res.body);
                assert.property(res.body, 'solution');
                let solvedPuzzle = puzzlesAndSolutions[1][1];
                assert.equal(res.body.solution, solvedPuzzle);
                done();
            })
    })

    //Functional Test #2-Solve a puzzle with missing puzzle string: POST request to /api/solve

    test('#2-Solve a puzzle with missing puzzle string: POST request to /api/solve', (done) => {
        chai
            .request(server)
            .post('/api/solve')
            .send({})
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, "Required field missing");
                done();
            })
    })
    //Functional Test #3-Solve a puzzle with invalid characters: POST request to /api/solve

    test('#3-Solve a puzzle with invalid characters: POST request to /api/solve', (done) => {
        chai
            .request(server)
            .post('/api/solve')
            .send({
                puzzle: validPuzzle.replace(9, 'a')
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.isObject(res.body);
                assert.property(res.body, 'error');
                let solvedPuzzle = puzzlesAndSolutions[1][1];
                //   assert.equal(res.body.solution, solvedPuzzle);
                assert.equal(res.body.error, 'Invalid characters in puzzle');
                done();
            })
    })

    //Functional Test #4-Solve a puzzle with incorrect length: POST request to /api/solve

    test('#4-Solve a puzzle with incorrect length: POST request to /api/solv', (done) => {
        chai
            .request(server)
            .post('/api/solve')
            .send({
                puzzle: validPuzzle.slice(77)
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.isObject(res.body);
                assert.property(res.body, 'error');
                assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
                done();
            })
    })


    //Functional Test #5-Solve a puzzle that cannot be solved: POST request to /api/solve

    test('#5-Solve a puzzle that cannot be solved: POST request to /api/solve', (done) => {
        chai
            .request(server)
            .post('/api/solve')
            .send({
                puzzle: '828.4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51'
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.isObject(res.body);
                assert.property(res.body, 'error');
                assert.equal(res.body.error, 'Puzzle cannot be solved');
                done();
            })
    })

    //Functional Test #6-Check a puzzle placement with all fields: POST request to /api/check

    test('#6-Check a puzzle placement with all fields: POST request to /api/check', (done) => {
        chai
            .request(server)
            .post('/api/check')
            .send({
                puzzle: validPuzzle,
                coordinate: 'A4',
                value: '9'
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.isObject(res.body);
                //  assert.property(res.body, 'error');
                assert.equal(res.body.valid, true);
                done();
            })
    })


    //Functional Test #7-Check a puzzle placement with single placement conflict: POST request to /api/check

    test('#7-Check a puzzle placement with single placement conflict: POST request to /api/check', (done) => {
        chai
            .request(server)
            .post('/api/check')
            .send({
                puzzle: validPuzzle,
                coordinate: 'B2',
                value: '2'
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.isObject(res.body);
                assert.equal(res.body.valid, false);
                assert.equal(res.body.conflict.length, 1);
                done();
            })
    })


    //Functional Test #8-Check a puzzle placement with multiple placement conflicts: POST request to /api/check

    test('#8-Check a puzzle placement with multiple placement conflicts: POST request to /api/check', (done) => {
        chai
            .request(server)
            .post('/api/check')
            .send({
                puzzle: validPuzzle,
                coordinate: 'B2',
                value: '3'
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.isObject(res.body);
                assert.property(res.body, 'valid');
                assert.equal(res.body.valid, false);
                assert.isArray(res.body.conflict);
                assert.isAbove(res.body.conflict.length, 1);
                assert.equal(res.body.conflict.length, 2);
                done();
            })
    })


    //Functional Test #9-Check a puzzle placement with all placement conflicts: POST request to /api/check

    test('#9-Check a puzzle placement with all placement conflicts: POST request to /api/check', (done) => {
        chai
            .request(server)
            .post('/api/check')
            .send({
                puzzle: validPuzzle,
                coordinate: 'B2',
                value: '5'
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.isObject(res.body);
                assert.property(res.body, 'valid');
                assert.equal(res.body.valid, false);
                assert.isArray(res.body.conflict);
                assert.isAbove(res.body.conflict.length, 1);
                assert.equal(res.body.conflict.length, 3);
                done();
            })


    })


    //Functional Test #10-Check a puzzle placement with missing required fields: POST request to /api/check


    test('#10-Check a puzzle placement with missing required fields: POST request to /api/check', (done) => {
        chai
            .request(server)
            .post('/api/check')
            .send({
                puzzle: validPuzzle,
                coordinate: 'B2',
                value: ''
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.isObject(res.body);
                //      assert.property(res.body, 'valid');
                //      assert.equal(res.body.valid, false);
                //      assert.isArray(res.body.conflict);
                //    assert.isAbove(res.body.conflict.length, 1);
                assert.equal(res.body.error, "Required field(s) missing");
                done();
            })
    })


    //Functional Test #11-Check a puzzle placement with invalid characters: POST request to /api/check

    test('#11-Check a puzzle placement with invalid characters: POST request to /api/check', (done) => {
        chai
            .request(server)
            .post('/api/check')
            .send({
                puzzle: validPuzzle.replace(1, 'x'),
                coordinate: 'B2',
                value: '1'
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.isObject(res.body);
                assert.property(res.body, 'error');
                //      assert.equal(res.body.valid, false);
                //      assert.isArray(res.body.conflict);
                //    assert.isAbove(res.body.conflict.length, 1);
                assert.equal(res.body.error, "Invalid characters in puzzle");
                done();
            })
    })

    //Functional Test #12-Check a puzzle placement with incorrect length: POST request to api/check.

    test('#12-Check a puzzle placement with incorrect length: POST request to api/check.', (done) => {
        chai
            .request(server)
            .post('/api/check')
            .send({
                puzzle: validPuzzle.slice(0, -1),
                coordinate: 'B2',
                value: '1'
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.isObject(res.body);
                assert.property(res.body, 'error');
                //      assert.equal(res.body.valid, false);
                //      assert.isArray(res.body.conflict);
                //    assert.isAbove(res.body.conflict.length, 1);
                assert.equal(res.body.error, "Expected puzzle to be 81 characters long");
                done();
            })
    })


    //Functional Test #13-Check a puzzle placement with invalid placement coordinate: POST request to /api/check

    test('#13-Check a puzzle placement with invalid placement coordinate: POST request to /api/check', (done) => {
        chai
            .request(server)
            .post('/api/check')
            .send({
                puzzle: validPuzzle,
                coordinate: 'J2',
                value: '1'
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.isObject(res.body);
                assert.property(res.body, 'error');
                //      assert.equal(res.body.valid, false);
                //      assert.isArray(res.body.conflict);
                //    assert.isAbove(res.body.conflict.length, 1);
                assert.equal(res.body.error, "Invalid coordinate");
                done();
            })
    })


    //Functional Test #14-Check a puzzle placement with invalid placement value: POST request to /api/check

    test('#14-Check a puzzle placement with invalid placement value: POST request to /api/check', (done) => {
        chai
            .request(server)
            .post('/api/check')
            .send({
                puzzle: validPuzzle,
                coordinate: 'B2',
                value: '11'
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.isObject(res.body);
                assert.equal(res.body.error, "Invalid value");
                done();
            })

    })







});