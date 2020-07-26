let util = require('util');
let mymodule = require('./mymodule')
let mymodule2 = require('./mymodule2')




mymodule.doSomething[util.promisify.custom] = (foo) => {
    return getPromiseSomehow();
};

util.promisify = () => { console.log('change util.promisify') }
mymodule.doSomething = () => { console.log('dddd') }

mymodule2.testModule()

const promisified = util.promisify(mymodule.doSomething);

promisified(null).then(
    console.log
)

console.log(promisified === doSomething[util.promisify.custom]);