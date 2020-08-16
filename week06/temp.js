
/**
 *
 * @param {string} selector
 * @param {Element} element
 */
function match(selector, element) {
    // div.my-things > div #id.class
    // let selectors = selector.split(/[ \-\>\~\+]/).reverse();
    // for (const sel of selectors) {
    //     if (simple_selector(sel, element) === false) {
    //         return false;
    //     }
    //     // z这里要处理‘-’/>/~/+
    // }


    let reverseSelector = selector.trim().split('').reverse();
    //加个结束字符'\'。
    reverseSelector.push('\\');

    let combinator = '';
    let simpleSelector = '';
    let match = true;
    for (const sel of reverseSelector) {
        if (sel.match(/[ \-\>\~\+\\]/)) {
            if (combinator === '') {
                match = simple_selector(simpleSelector.split('').reverse().join(''), element);
            }
            // ' '
            if (combinator === ' ') {
                while (element.parentElement) {
                    element = element.parentElement;
                    match = simple_selector(simpleSelector.split('').reverse().join(''), element);
                    if (match) {
                        break;
                    }
                }
            }
            if (combinator === '>') {
                element = element.parentElement;
                match = simple_selector(simpleSelector.split('').reverse().join(''), element);
            }
            combinator = sel;
            simpleSelector = '';

        } else {
            simpleSelector += sel;
        }
        if (!match) {
            return false;
        }
    }

    return true;
}

/**
 *
 * @param {string} selector
 * @param {Element} element
 */
function simple_selector(selector, element) {

    let map = new Map();
    let word = '';
    let nonWord = '';
    for (const c of ('//' + selector + '//')) {
        // 一旦不是
        if (c.match(/\W/)) {
            if (nonWord) {
                if (!map.get(nonWord)) {
                    map.set(nonWord, [])
                }
                map.get(nonWord).push(word)
                word = '';
            }
            nonWord = c;
        } else {
            word += c;
        }
    }

    let isHashSelector = false;
    let isClassSelector = false;
    let isTagSelector = false;
    // #`
    /**
     * @type {string[]}
     */
    let hashSelector = map.get('#');
    if (!hashSelector || hashSelector.includes(element.id)) {
        isHashSelector = true;
    }
    /**
     * @type {string[]}
     */
    let classSelector = map.get('.');
    isClassSelector = !classSelector || classSelector.every(cls => element.classList.contains(cls))

    let tag = map.get('//');
    isTagSelector = !tag || tag.every(tag => element.tagName == tag);

    return isHashSelector && isClassSelector && isTagSelector;
}
//simple_selector('#id.div')


// match("div.my-things > div #id.class", document.getElementById("id"));