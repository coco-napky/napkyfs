"use strict";

const EntryTable = require('../EntryTable/EntryTable');
const Superblock   = require('../Superblock/Superblock');
const Bitmap       = require('../Bitmap/Bitmap');
const Unit         = require('./Unit');
const binaryParser = require('../Binary/BinaryParser');
const fs 		   = require('fs');

class FileSystem {

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
				for (let i = 0; i < osBlocks; i++)
					bitmap.getAndSetNext();

				let freeSpace  = bitmap.getFreeBlocks() * blockSize;
				let tableEntries = (freeSpace/4)/512;
				let entryTable = new EntryTable(tableEntries);
				let entryTableSize = binaryParser.getSize(entryTable);
				let entryTableBlocks = Math.ceil(entryTableSize/blockSize);

				for (let i = 0; i < entryTableBlocks; i++)
					bitmap.getAndSetNext();

				let bitmapBlocks = osBlocks - 1;
				    osBlocks += entryTableBlocks;
				let bitmapBuffer = binaryParser.toBinaryBuffer(bitmap);

				let superblock = new Superblock({blockSize, blocks, entryTableBlocks, bitmapBlocks, osBlocks}),
				    superblockBuffer = binaryParser.toBinaryBuffer(superblock);

				let entryTableBuffer = binaryParser.toBinaryBuffer(entryTable);

				binaryParser.write(fd, superblockBuffer, blockSize*0);
				binaryParser.write(fd, bitmapBuffer, blockSize*1);
				binaryParser.write(fd, entryTableBuffer, blockSize*osBlocks);

				resolve({status:1});
			});
		});
		return promise
	}

	mountUnit(name){
		let promise  = new Promise( (resolve, reject) => {
			fs.open('./FileSystem/units/' + name, 'r', (err, fd) => {
				if(err){
					reject({status:0, message: 'Error Mounting Unit'});
					return;
				}

				let superblock = binaryParser.parseFromFile(fd, 0);
				let { blockSize, osBlocks, bitmapBlocks } = superblock.props;

				let bitmap     = binaryParser.parseFromFile(fd, blockSize),
				    entryTable = binaryParser.parseFromFile(fd, blockSize*osBlocks),
				    unit   = new Unit({bitmap, superblock, entryTable});
				this.props.currentUnit = unit;

				resolve({status:1});
			});
		});
		return promise;
	}
}

module.exports = FileSystem;