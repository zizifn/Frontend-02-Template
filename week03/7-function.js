
var set = new Set();
var objects = [
    eval,
    isFinite,
    isNaN,
    parseFloat,
    parseInt,
    decodeURI,
    decodeURIComponent,
    encodeURI,
    encodeURIComponent,
    Array,
    Date,
    RegExp,
    Promise,
    Proxy,
    Map,
    WeakMap,
    Set,
    WeakSet,
    Function,
    Boolean,
    String,
    Number,
    Symbol,
    Object,
    Error,
    EvalError,
    RangeError,
    ReferenceError,
    SyntaxError,
    TypeError,
    URIError,
    ArrayBuffer,
    SharedArrayBuffer,
    DataView,
    Float32Array,
    Float64Array,
    Int8Array,
    Int16Array,
    Int32Array,
    Uint8Array,
    Uint16Array,
    Uint32Array,
    Uint8ClampedArray,
    Atomics,
    JSON,
    Math,
    Reflect];
objects.forEach(o => set.add(o));

for (var i = 0; i < objects.length; i++) {
    var o = objects[i]
    for (var p of Object.getOwnPropertyNames(o)) {
        var d = Object.getOwnPropertyDescriptor(o, p)
        if ((d.value !== null && typeof d.value === "object") || (typeof d.value === "function"))
            if (!set.has(d.value))
                set.add(d.value), objects.push(d.value);
        if (d.get)
            if (!set.has(d.get))
                set.add(d.get), objects.push(d.get);
        if (d.set)
            if (!set.has(d.set))
                set.add(d.set), objects.push(d.set);
    }
}



var realmsObj = Array.from(set).reduce(
    (previous, current, index) => {

        // const child = current;
        const name = current?.name || current?.constructor?.toString() || current.toString();
        const child = {
            id: name
        };
        if (previous.children.find(value => value.id === (name.length % 10))) {
            previous.children.find(value => value.id === (name.length % 10)).children.push(child)

        } else {
            const parentChild = {
                id: (name.length % 10),
                children: [child]
            }
            previous.children.push(parentChild);
        }

        return previous;

    },
    {
        id: "realms object",
        children: []
    }
);

var realmsObj = Array.from(set).reduce(
    (previous, current, index) => {

        const child = current;
        // const name = current?.name || current?.constructor?.toString() || current.toString();
        // const child = {
        //     id: name
        // };
        if (previous.children.find(value => value.id === (typeof current))) {
            previous.children.find(value => value.id === (typeof current)).children.push(child)

        } else {
            const parentChild = {
                id: (typeof current),
                children: [child]
            }
            previous.children.push(parentChild);
        }

        return previous;

    },
    {
        id: "realms object",
        children: []
    }
);


Promise.resolve(realmsObj)