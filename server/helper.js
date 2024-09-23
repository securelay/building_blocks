import fs from 'node:fs';
import {rimraf} from 'rimraf';
import Crypto from 'node:crypto';
import { secret, sigLength } from './env.js';

function hash(str){
    return Crypto.hash('sha256', str, 'base64url'); // For small size str this is faster than fs.createHash()
}

function sign(str){
    // Note: https://nodejs.org/api/crypto.html#using-strings-as-inputs-to-cryptographic-apis
    return Crypto.createHmac('sha256', secret).update(str).digest('base64url').substr(0,sigLength);
}

export function validate(key){
    const sig = key.substr(0, sigLength);
    const hash = key.substr(sigLength,);
    if (sig === sign(hash + 'public')){
        return 'public';
    } else if (sig === sign(hash + 'private')){
        return 'private';
    } else {
        return false;
    }
}

export function genPublicKey(privateKey){
    const privateHash = privateKey.substr(sigLength,);
    const publicHash = hash(privateHash);
    const publicKey = sign(publicHash + 'public') + publicHash;
    return publicKey
}

export function genKeyPair(seed){
    if (!seed) seed = Crypto.randomUUID();
    const privateHash = hash(seed);
    const privateKey = sign(privateHash + 'private') + privateHash;
    const publicKey = genPublicKey(privateKey);
    return {private: privateKey, public: publicKey};
}
