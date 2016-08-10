"use strict";

const Superblock   = require('../Superblock/Superblock');
const Bitmap       = require('../Bitmap/Bitmap');
const binaryParser = require('../Binary/BinaryParser');
const fs = require('fs');

class FilySystem {

	constructor(){
		this.props = {};
	}

	init(props){
		this.props = props;
	}

	createDisk(name, blockSize, blocks){
		fs.open('./FileSystem/units/' + name, 'w+', (err, fd) => {
			let buffer = new Buffer(blockSize);

			for (let i = 0; i < blockSize; ++i)
				buffer[i] = 0;

			for (let i = 0; i < blocks; ++i)
				binaryParser.write(fd, buffer, blockSize*i);

			let bitmap = new Bitmap(blocks);
			bitmap = binaryParser.toBinaryBuffer(bitmap);
			let bitmapSize = bitmap.length;

			let superblock = new Superblock({blockSize, blocks, bitmapSize});
			superblock = binaryParser.toBinaryBuffer(superblock);

			binaryParser.write(fd, superblock, blockSize*0);
			binaryParser.write(fd, bitmap, blockSize*1);
		});
	}
}

module.exports = FilySystem;