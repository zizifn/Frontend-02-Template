var css = require('css');

/**
 * @type {css.Rule[]}
 */
let rules = [];
function addCSSRules(text) {
    let ast = css.parse(text)
    rules.push(...ast.stylesheet.rules)
}
/**
 *
 * @param {*} stack
 * @param { {
    type: string,
    children: [],
    attributes: [],
    computedStyle: {}
}} element
 */
function computeCSS(stack, element) {
    // 获取父元素，还要翻转, 从内向外
    // div div #myid {}
    var elements = stack.slice().reverse();
    if (!element.computedStyle) {
        element.computedStyle = {};
    }
    for (const rule of rules) {
        // #myid, div div
        let selectors = rule.selectors[0].split(" ").reverse();

        if (!match(element, selectors[0])) {
            continue;
        }
        let matched = false;

        // loop父节点，从第二个选择器开始，因为第一个已经找过了
        var j = 1;
        for (let i = 0; i < elements.length; i++) {
            if (match(elements[i], selectors[j])) {
                j++;
            }
        }

        if (j >= selectors.length) {
            matched = true;
        }
        if (matched) {

            // 把matched rule里面的style拿出来放到element上
            let sp = specificity(rule.selectors[0])
            const computedStyle = rule.declarations.reduce((previous, current) => {
                let { property, value } = current;
                if (compare(previous[property]?.sp, sp)) {
                    return previous;
                };
                return {
                    ...previous, ...{ [property]: { value, sp } }
                };
            }, element.computedStyle);
            element.computedStyle = computedStyle;
            // console.log(element.computedStyle);
        }
    }

    // console.log(element);
}

/**
 *
 * @param {string} selector
 */
function specificity(selector) {
    const selectors = selector.split(" ");
    return selectors.reduce((previous, current) => {
        const counts = [...current].reduce((prev, current) => {
            // 一旦需要特殊字符就代表是一个组合
            if (!current.match(/^[a-zA-Z]$/)) {
                prev.numbers += 1;
            }
            let count = prev[current];
            prev[current] = count ? count + 1 : 1;
            return prev;
        }, { numbers: 1 });

        const idCount = counts['#'] || 0;
        const classCount = counts['.'] || 0;

        if (current.charAt(0) == '#') {
            previous[1] += idCount;
        } else if (current.charAt(0) == '.') {
            previous[2] += classCount;
        } else {
            previous[1] += idCount;
            previous[2] += classCount;
            previous[3] += counts.numbers - idCount - classCount;
        }
        return previous;

    }, [0, 0, 0, 0]);
}

/**
 *
 * @param {number[]} sp1
 * @param {number[]} sp2
 */
function compare(sp1, sp2) {
    if (!sp1 || !sp1) {
        return false;
    }
    if (sp1[0] - sp2[0]) return true;
    if (sp1[1] - sp2[1]) return true;
    if (sp1[2] - sp2[2]) return true;
    if (sp1[3] - sp2[3]) return true;
    return true;
}

// 简单选择器 div .a #a
/**
 *
 * @param { {
    type: string,
    children: [],
    attributes: []
}} element
 * @param {string} selector
 */
function match(element, selector) {
    if (!selector || !element?.attributes) {
        return false;
    }
    if (selector.charAt(0) == '#') {
        /** @type {{name: string, value:string}} */
        var attr = element.attributes.find(attr => attr.name == "id");
        if (attr && attr.value === selector.replace("#", "")) {
            return true;
        }
    } else if (selector.charAt(0) == '.') {
        var attr = element.attributes.find(attr => attr.name == "class");
        //class="box rAF"
        //div div .rAF.test
        if (attr && attr.value) {
            const complexSelectors = selector.split('.').filter(Boolean);
            const classes = attr.value.split(' ').filter(Boolean);
            // 如果selector 每一个“.rAF.test” 都在class 中，就是match
            return complexSelectors.every(value => classes.includes(value));
        }
    } else {
        if (element.tagName === selector) {
            return true;
        }
    }
    return false;
}
module.exports.addCSSRules = addCSSRules;
module.exports.computeCSS = computeCSS;