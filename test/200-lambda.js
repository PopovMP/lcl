"use strict";

const assert = require("assert");
const Lcl = require("../lcl.js").Lcl;
const lcl = new Lcl();

describe('lambda', function () {
    it(`λx.x`, function () {
        assert.strictEqual(lcl.evaluate("λx.x"), "λx.x");
    });
    it(`λxy.x`, function () {
        assert.strictEqual(lcl.evaluate("λx y.x"), "λx.x");
    });
    it(`λxy.xy`, function () {
        assert.strictEqual(lcl.evaluate("(λx y.x y) a b"), "λx.x");
    });
    it(`λxλy.xy`, function () {
        assert.strictEqual(lcl.evaluate("(λx λy.x y)"), "λx.x");
    });
});
