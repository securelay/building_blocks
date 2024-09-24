import * as helper from './helper.js'


const key = helper.genKeyPair();

console.log(JSON.stringify(key));

console.log(helper.validate(key.public));
console.log(helper.validate(key.private));
console.log(helper.validate('random'));

helper.setupDB();

helper.publicProduce(key.public, 'dataA');
helper.publicProduce(key.public, 'dataB');
helper.publicProduce(key.public, 'dataC');

console.log(JSON.stringify(helper.privateConsume(key.private)));

helper.privateProduce(key.private, 'data')
console.log(JSON.stringify(helper.publicConsume(key.public)));
