
//  十进制 0 | 0. | .2 | 1e3

// 二进制 0b111

// 八进制 0o10

// 十六进制 0xFF

function stringToNumber(str) {
    if (str === null || str === (void 0)) {
        return Number.NaN;
    }
    str = str.toString();
    let numbers = new Map(
        [
            ['0', 0], ['1', 1], ['2', 2], ['3', 3], ['4', 4], ['5', 5], ['6', 6], ['7', 7], ['8', 8], ['9', 9]
        ]
    );
    let radix = 10;
    let negative = false;
    let numberStr = str;
    let number = Number.NaN;
    // check number is negative or not?
    if (numberStr[0] === '-') {
        negative = true;
        numberStr = str.slice(1);
    }
    if (numberStr[0] === '+') {
        negative = false;
        numberStr = str.slice(1);
    }
    if (numberStr.slice(0, 2) === '0b') {
        radix = 2;
        numbers = new Map(
            [
                ['0', 0], ['1', 1]
            ]
        );
        numberStr = numberStr.slice(2);
    }
    if (numberStr.slice(0, 2) === '0o') {
        radix = 8;
        numbers = new Map(
            [
                ['0', 0], ['1', 1], ['2', 2], ['3', 3], ['4', 4], ['5', 5], ['6', 6], ['7', 7], ['8', 8]
            ]
        );
        numberStr = numberStr.slice(2);
    }
    if (numberStr.slice(0, 2) === '0x') {
        radix = 16;
        numbers = new Map(
            [
                ['0', 0], ['1', 1], ['2', 2], ['3', 3], ['4', 4], ['5', 5], ['6', 6], ['7', 7], ['8', 8], ['9', 9], ['A', 10], ['B', 11], ['C', 12], ['D', 13], ['E', 14], ['F', 15]
            ]
        );
        numberStr = numberStr.slice(2);
    }
    if (radix === 10) {
        //  处理科学及算法
        const scientificNumbers = numberStr.toUpperCase().split('E')
        if (scientificNumbers.length == 2) {

            number = scientificNumbers[0] * Math.pow(radix, scientificNumbers[1]);
            if (negative) {
                number = -Math.abs(number);
            }
            return number;
        }
    }
    //
    const numberStrs = numberStr.toUpperCase().split('.');
    // 正数部分
    number = numberStrs[0].split('').reverse().reduce(
        (previous, current, index) => {
            if (!numbers.has(current)) {
                return Number.NaN;
            }
            return previous + numbers.get(current) * Math.pow(radix, index);
        },
        0
    )
    // 小数部分
    if (numberStrs.length > 1) {
        number = numberStrs[1].split('').reduce(
            (previous, current, index) => {
                if (!numbers.has(current)) {
                    return Number.NaN;
                }
                return previous + numbers.get(current) * Math.pow(radix, -index - 1);
            },
            number
        )
    }
    if (negative) {
        number = -Math.abs(number);
    }
    return number;
}
console.log(stringToNumber(0))
console.log(stringToNumber(0.))
console.log(stringToNumber(.023))
console.log(stringToNumber('125.365'))
console.log(stringToNumber('0b111'))
console.log(stringToNumber('0o10'))
console.log(stringToNumber('0xFF'))
console.log(stringToNumber('0xff.ff0010c6f7a')) //255.99609475
console.log(stringToNumber("-0x4d2.8f5c28f5c28"))
console.log(stringToNumber('1.99609475e+0'))
console.log(stringToNumber("1.23456e+2"))
console.log(stringToNumber("4.56e-1"))


function numberToString(number, radix) {
    // 最高支持16进制, 其实可以支持任何进制
    if (Number.isNaN(number) || radix > 16) {
        return 'NaN'
    }
    let numbers = new Map(
        [[0, '0'], [1, '1'], [2, '2'], [3, '3'], [4, '4'], [5, '5'], [6, '6'], [7, '7'], [8, '8'], [9, '9'], [10, 'A'], [11, 'B'], [12, 'C'], [13, 'D'], [14, 'E'], [15, 'F']
        ]
    );
    let negative = false;
    if (number < 0) {
        negative = true;
    }
    let integerPart = Math.floor(Math.abs(number));
    let integerParts = [];
    let decimalPart = Math.abs(number % 1);
    let decimalParts = [];
    if (decimalPart !== 0) {
        decimalParts = ['.'];
    }
    // 整数部分
    for (; ;) {
        const radixIntegerPart = integerPart % radix;
        if (!numbers.has(radixIntegerPart)) {
            return 'NaN';
        }
        integerParts.push(numbers.get(radixIntegerPart));
        integerPart = Math.floor(integerPart / radix);
        if (integerPart === 0) {
            break;
        }
    }
    // 小数部分
    for (; ;) {
        // 有些数是除不尽的，所以小数部分最大精度为54
        if (decimalPart === 0 || integerParts.length === 54) {
            break;
        }
        decimalPart = decimalPart * radix
        const radixDecimalPart = Math.floor(decimalPart);
        if (!numbers.has(radixDecimalPart)) {
            return 'NaN';
        }
        decimalParts.push(numbers.get(radixDecimalPart));
        decimalPart = decimalPart % 1;
    }

    let numberStr = integerParts.reverse().concat(decimalParts).join('');
    if (negative) {
        numberStr = '-' + numberStr;
    }

    return numberStr;
}
console.log(numberToString(123, 2)) //1111011
console.log(numberToString(-123, 2)) //1111011
console.log(numberToString(-123.125, 2)) //-1111011.001
console.log(numberToString(123.134, 2)) //1111011.0010001001001101110100101111000110101001111111
console.log(numberToString(-123.134, 8)) //173.1044672274324774
console.log(numberToString(-123.134, 16)) //7b.224dd2f1a9fc