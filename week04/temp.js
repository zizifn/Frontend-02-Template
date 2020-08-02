// console.log('dddd')

// for (let i = 0; i < 10; i++)
//     console.log("i " + i), i += 2, setTimeout(
//         function () {
//             console.log("str1 " + i);
//             i += 2;
//         }
//     );


// function foo(tp1, ...values) {
//     console.log(tp1);
//     console.log(values);
// }

// foo`try call ${foo.name}.`
// foo(`try call ${foo.name}.`)
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

specificity('div div #id')