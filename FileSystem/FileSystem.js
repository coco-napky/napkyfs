"use strict";

const EntryTable = require('../EntryTable/EntryTable');
const Superblock   = require('../Superblock/Superblock');
const Bitmap       = require('../Bitmap/Bitmap');
const Unit         = require('./Unit');
const binaryParser = require('../Binary/BinaryParser');
const fs 		   = require('fs');

class FilySystem {

	constructor(){
		this.props = {};
	}

	init(props){
		this.props = props;
	}

	createUnit(name, blockSize, blocks){
		let promise  = new Promise( (resolve, reject) => {
			fs.open('./FileSystem/units/' + name, 'w+', (err, fd) => {

				if(err)
					reject({status:0, message: 'Error opening file'});

				let buffer = new Buffer(blockSize);
				for (let i = 0; i < blockSize; ++i)
					buffer[i] = 0;

				for (let i = 0; i < blocks; ++i)
					binaryParser.write(fd, buffer, blockSize*i);

				let bitmap = new Bitmap(blocks);
				let bitmapSize = binaryParser.getSize(bitmap);

				let osBlocks = 1 + Math.ceil(bitmapSize/blockSize);
				console.log('Bitmap Size :' + bitmapSize);
				for (let i = 0; i < osBlocks; i++)
					bitmap.getAndSetNext();


				let bitmapBuffer = binaryParser.toBinaryBuffer(bitmap);

				let superblock = new Superblock({blockSize, blocks, bitmapSize});
				superblock = binaryParser.toBinaryBuffer(superblock);

				binaryParser.write(fd, superblock, blockSize*0);
				binaryParser.write(fd, bitmapBuffer, blockSize*1);
				resolve({status:1});
			});
		});
		return promise
	}

	mountUnit(name){
		let promise  = new Promise( (resolve, reject) => {
			fs.open('./FileSystem/units/' + name, 'r', (err, fd) => {
				if(err)
					reject({status:1, message: 'Error opening file'});

				let superblock = binaryParser.parseFromFile(fd, 0);
				let blockSize  = superblock.props.blockSize;
				let bitmap     = binaryParser.parseFromFile(fd, blockSize);
				let unit   = new Unit({bitmap, superblock});
				this.props.currentUnit = unit;

				resolve({status:1});
			});
		});
		return promise;
	}
}

module.exports = FilySystem;