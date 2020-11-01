var assert = require('assert')
import { parseHTML } from "../src/htmlParser.js"

describe("html Parser", () => {
    it("<a>abc</a>", () => {
        const tree = parseHTML("<a>abc</a>");
        // console.log(tree);
        assert.strictEqual(tree.children[0].tagName, 'a');
    });

    it('<a id="123">abc</a>', () => {
        const tree = parseHTML('<a id="123">abc</a>');
        // console.log(tree);
        // console.log(tree.children[0].attributes);
        assert.strictEqual(tree.children[0].tagName, 'a');
        assert.strictEqual(tree.children[0].attributes[0].name, "id");
        assert.strictEqual(tree.children[0].attributes[0].value, "123");
    });

    it('<a class="test">abc</a>', () => {
        const tree = parseHTML('<a class="test">abc</a>');
        // console.log(tree);
        // console.log(tree.children[0].attributes);
        assert.strictEqual(tree.children[0].tagName, 'a');
        assert.strictEqual(tree.children[0].attributes[0].name, "class");
        assert.strictEqual(tree.children[0].attributes[0].value, "test");
    });


    it('<a test="1" />', () => {
        const tree = parseHTML('<a test="1" />');
        // console.log(tree);
        // console.log(tree.children[0].attributes);
        // assert.strictEqual(tree.children[0].tagName, 'a');
        assert.strictEqual(tree.children[0].attributes[0].name, "test");
        assert.strictEqual(tree.children[0].attributes[1].name, "isSelfClosing");
    });

    it('<div test="dd"x=""></div>', () => {
        const tree = parseHTML('<div test="dd" x=""></div>');
        // console.log(tree);
        // console.log(tree.children[0].attributes);
        assert.strictEqual(tree.children[0].tagName, 'div');
        assert.strictEqual(tree.children[0].attributes[0].name, "test");
        assert.strictEqual(tree.children[0].attributes[1].name, "x");
    });

    it('<a test=a />', () => {
        const tree = parseHTML('<a test=a />');
        // console.log(tree);
        // console.log(tree.children[0].attributes);
        assert.strictEqual(tree.children[0].attributes[0].name, "test");
        assert.strictEqual(tree.children[0].attributes[0].value, "a");
    });

    it('<A>abc</A>', () => {
        const tree = parseHTML('<A>abc</A>');
        assert.strictEqual(tree.children[0].tagName, 'A');

    });

});
