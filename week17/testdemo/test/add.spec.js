var assert = require('assert')
import { add, mul } from "../add.js"

// const add = require('../add.js').add
// const mul = require('../add.js').mul

describe("add test suit", () => {
    it("should return 3", () => {
        assert.strictEqual(add(1, 2), 3);
    });
    it("should return -1", () => {
        assert.strictEqual(add(1, -2), -1);
    });

    it("should mul return -1", () => {
        assert.strictEqual(mul(1, -2), -2);
    });
});
