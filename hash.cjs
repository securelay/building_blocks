/*
Sources:
https://nodejs.org/api/crypto.html#cryptohashalgorithm-data-outputencoding
*/

// Require the framework and instantiate it

const {createHash, hash} = require('node:crypto');
console.log(createHash('md5').update('hello').digest('hex')); // Legacy method
console.log(hash('md5', 'hello', 'base64url')) // Faster method
