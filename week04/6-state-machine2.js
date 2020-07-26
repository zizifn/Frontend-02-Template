function findStr(str) {
    let state = start;
    for (const char of str) {
        state = state(char)
    }

    return state === end;
}

console.log(findStr("abababx"))
console.log(findStr("ababababababx"))
console.log(findStr("ababababxababx"))
console.log(findStr("aaababaabxababx"))

function end() {
    return end;
}

function start(char) {
    if (char === 'a') {
        return foundA;
    }
    else {
        return start;
    }
}
function foundA(char) {
    if (char === 'b') {
        return foundB;
    }
    else {
        return start(char);
    }
}
function foundB(char) {
    if (char === 'a') {
        return foundA2;
    }
    else {
        return start(char);
    }
}


function foundA2(char) {
    if (char === 'b') {
        return foundB2;
    } else {
        return start(char);
    }
}

function foundB2(char) {
    if (char === 'a') {
        return foundA3;
    } else {
        return start(char);
    }
}

function foundA3(char) {
    if (char === 'b') {
        return foundB3;
    } else {

        return start(char);
    }
}

function foundB3(char) {
    if (char === 'x') {
        return end;
    } else {
        // ab ab abx
        // // 第三个B，如果后面不是X，那么就有可能是第二个B,, ab ab ab abx
        return foundB2(char);
    }
}
