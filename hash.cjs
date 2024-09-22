// Require the framework and instantiate it

const {createHash} = require('node:crypto');
console.log(createHash('md5').update('hello').digest('hex'));
