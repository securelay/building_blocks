import * as helper from './helper.js'


const key = helper.genKeyPair();

console.log(JSON.stringify(key));

console.log(helper.validate(key.public));
console.log(helper.validate(key.private));
console.log(helper.validate('random'));

