function doSomething(foo, callback) {
    // ...
    callback(null, 'dd')
}

module.exports = Object.freeze({
    doSomething
})



