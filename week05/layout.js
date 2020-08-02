
/**
 *
 * @param {{
    type: string,
    children: [],
    attributes: [],
    computedStyle: {}
}} element
 */
function layout(element) {
    if (!element.computedStyle || Object.keys(element.computedStyle).length === 0) {
        return;
    }

    /**@type Object<string, string> */
    const elementStyle = getStyle(element);

    // 只处理flex的
    if (elementStyle.display !== 'flex') {
        return;
    }

    const items = element.children.filter(e => e.type === 'element');
    items.sort((a, b) => {
        return (a.order || 0) - (b.order || 0)
    });

    /**
     * flex-direction:row
     * MAIN: width x left right
     * Cross: height y top bottom
     *
     * flex-direction:column
     * reverse
     *
     */
    ['width', 'height'].forEach(size => {
        if (elementStyle[size] === 'auto' || elementStyle[size] === '') {
            elementStyle[size] = null;
        }
    });

    // 给其他属性一个初始值
    if (!elementStyle.flexDirection || elementStyle.flexDirection === 'auto') {
        elementStyle.flexDirection = 'row';
    }
    if (!elementStyle.alignItems || elementStyle.alignItems === 'auto') {
        elementStyle.alignItems = 'stretch';
    }
    if (!elementStyle.justifyContent || elementStyle.justifyContent === 'auto') {
        elementStyle.justifyContent = 'flex-start';
    }
    if (!elementStyle.flexWrap || elementStyle.flexWrap === 'auto') {
        elementStyle.flexWrap = 'noWrap';
    }
    if (!elementStyle.alignContent || elementStyle.alignContent === 'auto') {
        elementStyle.alignContent = 'stretch';
    }

    let mainSize, mainStart, mainEnd, mainSign, mainBase,
        crossSize, crossStart, crossEnd, crossSign, crossBase;
    if (elementStyle.flexDirection == 'row') {
        mainSize = 'width';
        mainStart = 'left';
        mainEnd = 'right';
        mainSign = +1;
        mainBase = 0;

        crossSize = 'height';
        crossStart = 'top';
        crossEnd = 'bottom';
    }
    if (elementStyle.flexDirection == 'row-reverse') {
        mainSize = 'width';
        mainStart = 'right';
        mainEnd = 'left';
        mainSign = -1;
        mainBase = elementStyle.width;

        crossSize = 'height';
        crossStart = 'top';
        crossEnd = 'bottom';
    }
    if (elementStyle.flexDirection == 'colum') {
        mainSize = 'height';
        mainStart = 'top';
        mainEnd = 'bottom';
        mainSign = +1;
        mainBase = 0;

        crossSize = 'width';
        crossStart = 'left';
        crossEnd = 'right';
    }
    if (elementStyle.flexDirection == 'colum-reverse') {
        mainSize = 'height';
        mainStart = 'top';
        mainEnd = 'bottom';
        mainSign = -1;
        mainBase = elementStyle.width;

        crossSize = 'width';
        crossStart = 'left';
        crossEnd = 'right';
    }

    if (elementStyle.flexDirection == 'wrap-reverse') {
        let tmp = crossStart;
        crossStart = crossEnd;
        crossEnd = temp;
        crossSign = -1;
    } else {
        crossBase = 0;
        crossSign = 1;
    }

    let isAutoMainSize = false;

    // 处理特例
    if (!elementStyle[mainSize]) {
        elementStyle[mainSize] = 0;

        // items 为经过css的所有element
        for (let index = 0; index < items.length; index++) {
            const item = items[index];
            const itemStyle = getStyle(item);
            if (itemStyle[mainSize] !== null) {
                elementStyle[mainSize] += itemStyle[mainSize];
            }
            isAutoMainSize = true;
        }
    }

    let flexLine = [];
    let flexLines = [flexLine];

    let mainSpace = elementStyle[mainSize];
    let crossSpace = 0;

    for (let index = 0; index < items.length; index++) {
        const item = items[index];
        const itemStyle = getStyle(item);
        if (itemStyle[mainSize] !== null) {
            itemStyle[mainSize] = 0;
        }

        if (itemStyle.flex) {
            flexLine.push(item);
        } else if (elementStyle.flexWrap == 'nowrap' && isAutoMainSize) {
            mainSpace -= itemStyle[mainSize];
            if (itemStyle[crossSize]) {
                crossSpace = Math.max(crossSpace, itemStyle[crossSize])
            }
            flexLine.push(item)
        } else {
            if (itemStyle[mainSize] > elementStyle[mainSize]) {
                itemStyle[mainSize] = elementStyle[mainSize]
            }
            if (mainSpace < itemStyle[mainSize]) {
                flexLine.mainSpace = mainSpace;
                flexLine.crossSpace = crossSpace;
                flexLine = [item];
                flexLines.push(flexLine);

                mainSpace = elementStyle[mainSize];
                crossSpace = 0;
            } else {
                flexLine.push(item);
            }

            if (itemStyle[crossSize]) {
                crossSpace = Math.max(crossSpace, itemStyle[crossSize])
            }
            mainSpace -= itemStyle[mainSize];
        }
    }

    flexLine.mainSpace = mainSpace;

    if (elementStyle.flexWrap == 'nowrap' && isAutoMainSize) {
        flexLine.crossSpace = elementStyle[crossSize] ? elementStyle[crossSize] : crossSpace;
    } else {
        flexLine.crossSpace = crossSpace;
    }

    if (mainSpace < 0) {
        let scale = elementStyle[mainSize] / (elementStyle[mainSize] - mainSpace);
        let currentMain = mainBase;

        for (let index = 0; index < items.length; index++) {
            const item = items[index];
            const itemStyle = getStyle(item);

            if (itemStyle.flex) {
                itemStyle[mainSize] = 0;
            }

            itemStyle[mainSize] = itemStyle[mainSize] * scale;

            itemStyle[mainStart] = currentMain;
            itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];

            currentMain = itemStyle[mainEnd];
        }
    } else {
        flexLines.forEach((items) => {
            let mainSpace = items.mainSpace;
            let flexTotal = 0;

            for (let index = 0; index < items.length; index++) {
                const item = items[index];
                const itemStyle = getStyle(item);

                if (itemStyle.flex) {
                    flexTotal += itemStyle.flex;
                    continue;
                }
            }

            if (flexTotal > 0) {
                let currentMain = mainBase;
                for (let index = 0; index < items.length; index++) {
                    const item = items[index];
                    const itemStyle = getStyle(item);

                    if (itemStyle.flex) {
                        itemStyle[mainSize] = (mainSpace / flexTotal) * itemStyle.flex;
                    }
                    itemStyle[mainStart] = currentMain;
                    itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
                    currentMain = itemStyle[mainEnd];
                }
            } else {
                let currentMain = mainBase;
                let step = 0;
                if (elementStyle.justifyContent === 'flex-start') {
                    currentMain = mainBase;
                    step = 0;
                }
                if (elementStyle.justifyContent === 'flex-end') {
                    currentMain = mainSpace * mainSign + mainBase;
                    step = 0;
                }
                if (elementStyle.justifyContent === 'center') {
                    currentMain = mainSpace / 2 * mainSign + mainBase;
                    step = 0;
                }
                if (elementStyle.justifyContent === 'space-between') {
                    step = mainSpace / (items.length - 1) * mainSign;
                    currentMain = mainBase;
                }
                if (elementStyle.justifyContent === 'space-around') {
                    step = mainSpace / (items.length) * mainSign;
                    currentMain = step / 2 + mainBase;
                }

                for (let index = 0; index < items.length; index++) {
                    const item = items[index];
                    const itemStyle = getStyle(item);
                    itemStyle[mainStart] = currentMain;
                    itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];

                    currentMain = itemStyle[mainEnd] + step;
                }
            }
        });
    }

    // crossSpace

    if (!elementStyle[crossSize]) {
        crossSpace = 0;
        elementStyle[crossSize] = 0;

        for (let index = 0; index < flexLines.length; index++) {
            const flexLine = flexLines[index];
            elementStyle[crossSize] = elementStyle[crossSize] + flexLine.crossSpace;

        }
    } else {
        crossSpace = elementStyle[crossSize];
        for (let index = 0; index < flexLines.length; index++) {
            const flexLine = flexLines[index];
            elementStyle[crossSize] -= flexLine.crossSpace;

        }
    }
    if (elementStyle.flexWrap === 'wrap-reverse') {
        crossBase = elementStyle[crossSize];
    } else {
        crossBase = 0;
    }

    let lineSize = elementStyle[crossSize] / flexLines.length;
    let step;

    if (elementStyle.alignContent === 'flex-start') {
        crossBase += 0;
        step = 0;
    }
    if (elementStyle.alignContent === 'flex-end') {
        crossBase += crossSign * crossSpace;
        step = 0;
    }

    if (elementStyle.alignContent === 'center') {
        crossBase += crossSign * crossSpace / 2;
        step = 0;
    }

    if (elementStyle.alignContent === 'space-between') {
        crossBase += 0;
        step = crossSpace / (flexLines.length - 1);
    }
    if (elementStyle.alignContent === 'space-around') {
        crossBase += 0;
        step = crossSpace / (flexLines.length);
    }
    if (elementStyle.alignContent === 'stretch') {
        crossBase += 0;
        step = 0;
    }

    flexLines.forEach((items => {
        let lineCross = elementStyle.alignContent === 'stretch' ?
            items.crossSpace + crossSpace / flexLines.length :
            items.crossSpace;

        for (let index = 0; index < items.length; index++) {
            const item = items[index];
            const itemStyle = getStyle(item);

            let align = itemStyle.alignSelf || elementStyle.alignItems;

            if (align === null) {
                itemStyle[crossStart] = crossBase;
                itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize];
            }

            if (align === 'flex-start') {
                itemStyle[crossStart] = crossBase + crossSign * lineCross;
                itemStyle[crossEnd] = itemStyle[crossStart] - crossSign * itemStyle[crossSize];
            }

            if (align === 'center') {
                itemStyle[crossStart] = crossBase + crossSign * (lineCross - itemStyle[crossSize]) / 2;
                itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize];
            }

            if (align === 'stretch') {
                itemStyle[crossStart] = crossBase;
                itemStyle[crossEnd] = crossBase + crossSign * (itemStyle[crossSize] ? itemStyle[crossSize] : crossSize);
                itemStyle[crossSize] = crossSign * (itemStyle[crossEnd] - itemStyle[crossStart]);
            }

        }
        crossBase += crossSign * (lineCross + step)
    }));
    // console.log(items);

}

/**
 *
 * @param {{
    type: string,
    children: [],
    attributes: [],
    computedStyle: Object<string, {value:string}>
}} element
 */
function getStyle(element) {

    if (!element.style) {
        element.style = {};
    }
    for (const prop in element.computedStyle) {
        if (element.computedStyle.hasOwnProperty(prop)) {
            const computedStyleProp = element.computedStyle[prop];
            element.style[prop] = computedStyleProp.value;
            if (computedStyleProp.value.match(/px$/)) {
                element.style[prop] = parseInt(computedStyleProp.value);
            }
            if (computedStyleProp.value.match(/^[0-9]$/)) {
                element.style[prop] = parseInt(computedStyleProp.value);
            }
        }
    }
    return element.style;

}



module.exports = layout