function utf_encode(str) {
    const textEncoder = new TextEncoder();
    return textEncoder.encode(str)
}


/**
 * U(85)->1010101
 * T(84)->1010100
 * F(70)->1000110
 * 8(56)->111000
 * 你(20320--01001111 01100000)-> 1110'0100'(196) /10 '111101'(189)/ 10'100000'(160)
 */
utf_encode('UTF8你').reduce((previous, current) => {
    previous.push(current.toString(2))
    return previous;
}, []);