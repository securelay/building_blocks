/*
Sources:
https://nodejs.org/api/fs.html#promise-example
https://nodejs.org/api/fs.html#callback-example
https://www.npmjs.com/package/rimraf
https://stackoverflow.com/questions/19167297/in-node-delete-all-files-older-than-an-hour
https://stackoverflow.com/a/44896916
*/

import {rimraf} from 'rimraf';
import fsPromises from 'node:fs/promises' // For Promises API
import fs from 'node:fs' // For Callback API
import {statSync} from 'node:fs' // For synchronous API

// Use with and without await. Without await 'hi' is printed first establishing the async property.
await fsPromises.stat("package.json").then((stats) => {
    let seconds = (new Date().getTime() - stats.mtime) / 1000;
    console.log(stats.mtime); // stats.mtime is a Date() object
    console.log(`File modified ${seconds} ago`);
});

fs.stat("package.json", function(err, stats){
    let seconds = (new Date().getTime() - stats.mtime) / 1000;
    console.log(`File modified ${seconds} ago`);
});

console.log('hi');

// for use as filter method of rimraf, its best to use the synchronous version
function decider(path){
    let seconds = (new Date().getTime() - statSync(path).mtime) / 1000;
        console.log('Path: ' + path + ' = ' + seconds);
        return (seconds < 1800);
}

// Delete all files and folders, including subfolders, if their modification time is less than 1800 seconds.
rimraf('/tmp/rimraf/**/*', {glob: true, filter: decider}).then((val) => {console.log('success');}, (err) => {console.log(err.data);})
