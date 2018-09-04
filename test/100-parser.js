"use strict";

const assert = require("assert");
const Parser = require("../lcl.js").Parser;
const parser = new Parser();

describe('Parser', function () {
    describe("tokenize expression", function () {
        it(`a`, function () {
            assert.deepStrictEqual(parser.tokenize("a"),
                ["a"]);
        });

        it(`id`, function () {
            assert.deepStrictEqual(parser.tokenize("id"),
                ["id"]);
        });

        it(`λx.x`, function () {
            assert.deepStrictEqual(parser.tokenize("λx.x"),
                ["λ", "x", ".", "x"]);
        });

        it(`λx.x`, function () {
            assert.deepStrictEqual(parser.tokenize("λx.x"),
                ["λ", "x", ".", "x"]);
        });

        it(`λx y.x`, function () {
            assert.deepStrictEqual(parser.tokenize("λx y.x"),
                ["λ", "x", "y", ".", "x"]);
        });

        it(`λx y.x y`, function () {
            assert.deepStrictEqual(parser.tokenize("λx y.x y"),
                ["λ", "x", "y", ".", "x", "y"]);
        });

        it(`λx y.x y`, function () {
            assert.deepStrictEqual(parser.tokenize("λx y.x y"),
                ["λ", "x", "y", ".", "x", "y"]);
        });

        it(`let one λf x.f x`, function () {
            assert.deepStrictEqual(parser.tokenize("let one λf x.f x"),
                ["let", "one", "λ", "f", "x", ".", "f", "x"]);
        });

        it(`let 1 λf x.f x`, function () {
            assert.deepStrictEqual(parser.tokenize("let 1 λf x.f x"),
                ["let", "1", "λ", "f", "x", ".", "f", "x"]);
        });
    });

    describe("tokenize strings", function () {
        it("empty string", function () {
            assert.deepStrictEqual(parser.tokenize(`""`),
                ['(', 'string', '', ')']);
        });

        it("non empty string", function () {
            assert.deepStrictEqual(parser.tokenize(`"id"`),
                ['(', 'string', 'id', ')']);
        });

        it("two strings", function () {
            assert.deepStrictEqual(parser.tokenize(`"lambda " "calculus"`),
                ["(", "string", "lambda ", ")", "(", "string", "calculus", ")"]);
        });

        it("string with quotes", function () {
            assert.deepStrictEqual(parser.tokenize(`{let text "He said ""Hello World!""."}`),
                ["{", "let", "text", "(", "string", "He said \"Hello World!\".", ")", "}"]);
        });

        it("string with an empty string", function () {
            assert.deepStrictEqual(parser.tokenize(`"Empty """"?"}`),
                ['(', 'string', 'Empty ""?', ')', '}']);
        });

        it("string with only an empty string", function () {
            assert.deepStrictEqual(parser.tokenize(`""""""`),
                ['(', 'string', '""', ')']);
        });
    });

    describe("tokenize comments", function () {
        it("comment at new line", function () {
            assert.deepStrictEqual(parser.tokenize(";; me comment"), []);
        });

        it("comment after code", function () {
            assert.deepStrictEqual(parser.tokenize("let id \"lambda\" ;; It's a lambda"),
                ["let", "id", "(", "string", "lambda", ")"]);
        });
    });

    describe('parser', function () {
        it('parse a', function () {
            const codeText = "a";
            const tree = JSON.stringify(parser.parse(codeText));
            assert.deepStrictEqual(tree, '["a"]');
        });
        it('parse a b', function () {
            const codeText = "a b";
            assert.deepStrictEqual(parser.parse(codeText), ["a", "b"]);
        });
        it('parse (a) (b)', function () {
            const codeText = "(a) (b)";
            assert.deepStrictEqual(parser.parse(codeText), [["a"], ["b"]]);
        });
        it('parse (f (x y))', function () {
            const codeText = "(f (x y))";
            assert.deepStrictEqual(parser.parse(codeText), [['f', ['x', 'y']]]);
        });
        it('parse empty string', function () {
            const codeText = '(let a "")';
            assert.deepStrictEqual(parser.parse(codeText),
                [['let', 'a', ['string', '']]]);
        });
        it('parse string', function () {
            const codeText = 'let name "John"';
            assert.deepStrictEqual(parser.parse(codeText),
                ['let', 'name', ['string', 'John']]);
        });
    });
});
