"use strict";

const assert = require("assert");
const Parser = require("../lcl.js").Parser;
const parser = new Parser();

describe("Parser", function () {
    describe("tokenize id", function () {
        it(`a`, function () {
            assert.deepStrictEqual(parser.tokenize(`a`),
                ["(", "a", ")"]);
        });

        it(`id`, function () {
            assert.deepStrictEqual(parser.tokenize(`id`),
                ["(", "id", ")"]);
        });
    });

    describe("tokenize lambda", function () {
        it(`λx.x`, function () {
            assert.deepStrictEqual(parser.tokenize(`λx.x`),
                ["(", "λ", "x", ".", "x", ")"]);
        });

        it(`λx y.x`, function () {
            assert.deepStrictEqual(parser.tokenize(`λx y.x`),
                ["(", "λ", "x", "y", ".", "x", ")"]);
        });

        it(`λx y.x y`, function () {
            assert.deepStrictEqual(parser.tokenize("λx y.x y"),
                ["(", "λ", "x", "y", ".", "x", "y", ")"]);
        });
    });

    describe("tokenize let", function () {
        it(`let one λf x.f x`, function () {
            assert.deepStrictEqual(parser.tokenize("let one λf x.f x"),
                ["(", "let", "one", "λ", "f", "x", ".", "f", "x", ")"]);
        });

        it(`let 1 λf x.f x`, function () {
            assert.deepStrictEqual(parser.tokenize(`let 1 λf x.f x`),
                ["(", "let", "1", "λ", "f", "x", ".", "f", "x", ")"]);
        });

        it(`let 2 λf.λx.f(f x)`, function () {
            assert.deepStrictEqual(parser.tokenize(`let 2 λf.λx.f (f x)`),
                ["(", "let", "2", "λ", "f", ".", "λ", "x", ".", "f", "(", "f", "x", ")", ")"]);
        });
    });

    describe("tokenize print", function () {
        it(`print "id" id`, function () {
            assert.deepStrictEqual(parser.tokenize(`print "id" id`),
                ["(", "print", "(", "string", "id", ")", "id", ")"]);
        });
    });

    describe("parser", function () {
        it(`let 2 λf.λx.f (f x)`, function () {
            assert.deepStrictEqual(parser.parse(`let 2 λf.λx.f (f x)`),
                [["let", "2", "λ", "f", ".", "λ", "x", ".", "f", ["f", "x"]]]);
        });
    });
});
