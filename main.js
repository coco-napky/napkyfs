"use strict";

const Superblock  = require('./Superblock/Superblock');
const binaryParser = require('./Binary/BinaryParser');
const fs = require('fs');
let superblock = new Superblock(4096, 100);

superblock.getAndSetNext();
superblock.getAndSetNext();
superblock.getAndSetNext();
superblock.getAndSetNext();
superblock.getAndSetNext();

// let content = fs.readFileSync('test.bin');
fs.open('test.bin', 'r+', (err, fd) => {
    if (err)
        throw 'error opening file: ' + err;

	let buffer = binaryParser.toBinaryBuffer(superblock);
	// let buffer = new Buffer(73);

    binaryParser.write(fd, buffer, 0);
	// let data = binaryParser.parseBinary(buffer);
	// console.log(data);
	// let sb = new Superblock();
	// sb.init(data);
	// console.log(data);
});