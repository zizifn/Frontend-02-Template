const mymodule = require('./mymodule')
let util = require('util');

function testModule() {
    console.log(mymodule.doSomething[util.promisify.custom])
}

exports.testModule = testModule

