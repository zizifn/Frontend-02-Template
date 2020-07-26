function findStr(str) {
    let state = start;
    for (const char of str) {
        state = state(char)
    }

    return state === end;
}

console.log(findStr("abcabcabxx"))

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
    if (char === 'c') {
        return foundC;
    }
    else {
        return start(char);
    }
}

function foundC(char) {
    if (char === 'a') {
        return foundA2;
    } else {
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

// abcabcabxx
function foundB2(char) {
    if (char === 'x') {
        return end;
    } else {
        // 第二B，又可能是第一个B，比如 ABC ABC ABX
        // 所以应该reset 成第一个B
        return foundB(char);
    }
}
