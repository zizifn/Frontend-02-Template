
function findStr(str) {
    let foundA = false;
    let foundB = false;
    let foundC = false;
    let foundD = false;
    let foundE = false;
    let foundF = false;

    for (const char of str) {
        if (char === 'a') {
            foundA = true;
            foundB = false;
            foundC = false;
            foundD = false;
            foundE = false;
            foundF = false;
        } else if (foundA && foundB == false && char === 'b') {
            foundB = true;
            foundC = false;
            foundD = false;
            foundE = false;
            foundF = false;
        } else if (foundB && foundC == false && char === 'c') {
            foundC = true;
            foundD = false;
            foundE = false;
            foundF = false;
        } else if (foundC && foundD == false && char === 'd') {
            foundD = true;
            foundE = false;
            foundF = false;
        } else if (foundD && foundE == false && char === 'e') {
            foundE = true;
            foundF = false;
        } else if (foundE && char === 'f') {
            return true;
        } else {
            foundA = false;
            foundB = false;
            foundC = false;
            foundD = false;
            foundE = false;
            foundF = false;
        }

    }

    return false;
}
console.log(findStr('abcdeff'))
console.log(findStr('ddddaabcdeff'))
console.log(findStr('ddddacftf'))
console.log(findStr('ddddaabcdeftf'))
console.log(findStr('abbcddef'))
console.log(findStr('abbccddef'))


