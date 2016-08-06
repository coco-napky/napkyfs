"use strict";

const Superblock  = require('./Superblock/Superblock');
const { parseBinary, toBinaryBuffer } = require('./Binary/Binary');
const fs = require('fs');
let superblock = new Superblock(4096, 10);


superblock.getAndSetNext();
superblock.getAndSetNext();
superblock.getAndSetNext();
superblock.getAndSetNext();
superblock.getAndSetNext();

let buffer = toBinaryBuffer(superblock);

let content = fs.readFileSync('test.bin');
console.log(content.length);

let test = parseBinary(content);

let sb = new Superblock();
sb.init(test);

console.log(sb.getFreeSpace()/sb.blockSize);
console.log(sb.blockSize);

// fs.open('test.bin', 'w', (err, fd) => {
//     if (err) {
//         throw 'error opening file: ' + err;
//     }

//     fs.writeSync(fd, buffer, 0, buffer.length, 0);
// });

