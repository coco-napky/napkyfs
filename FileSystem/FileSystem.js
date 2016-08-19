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

				let bitmap     = new Bitmap(blocks);
				let bitmapSize = (bitmap.size + 1)*4;

				let bitmapBlocks = Math.ceil(bitmapSize/blockSize);
				let osBlocks     = 1 + bitmapBlocks;

				for (let i = 0; i < osBlocks; i++)
					bitmap.getAndSetNext();

				let freeSpace        = bitmap.getFreeBlocks() * blockSize;
				let tableEntries     = (freeSpace/4)/512;
				let entryTable       = new EntryTable(tableEntries);
				let entryTableSize   = binaryParser.getSize(entryTable);
				let entryTableBlocks = Math.ceil(entryTableSize/blockSize);

				for (let i = 0; i < entryTableBlocks; i++)
					bitmap.getAndSetNext();

				osBlocks += entryTableBlocks;
				let superblock = new Superblock({blockSize, blocks, entryTableBlocks, bitmapBlocks, osBlocks});
				let unit       = new Unit({name, bitmap, superblock, entryTable});

				this.writeUnit(fd, unit);
				resolve({status:1});
			});
		});
		return promise
	}

	writeUnit(fd, unit) {
		let {name, bitmap, superblock, entryTable} = unit.props;
		let {blockSize, bitmapBlocks} = superblock.props;

		let bitmapBuffer     = binaryParser.bitmapBuffer(bitmap),
		    superblockBuffer = binaryParser.toBinaryBuffer(superblock),
		    entryTableBuffer = binaryParser.toBinaryBuffer(entryTable);

		binaryParser.write(fd, superblockBuffer, blockSize*0);
		binaryParser.write(fd, bitmapBuffer, blockSize*1);
		binaryParser.write(fd, entryTableBuffer, blockSize*(bitmapBlocks+1));

	}

	mountUnit(name){
		let promise  = new Promise( (resolve, reject) => {
			fs.open('./FileSystem/units/' + name, 'r', (err, fd) => {
				if(err){
					reject({status:0, message: 'Error Mounting Unit'});
					return;
				}

				let superblock = binaryParser.parseFromFile(fd, 0);
				let { blockSize, bitmapBlocks } = superblock.props;
				let bitmap     = binaryParser.parseBitmapFromFile(fd, blockSize),
				    entryTable = binaryParser.parseFromFile(fd, blockSize*(bitmapBlocks+1)),
				    unit   = new Unit({name, bitmap, superblock, entryTable});
				this.props.currentUnit = unit;

				resolve({status:1});
			});
		});
		return promise;
	}

	importFile(file) {
		if(!this.checkUnit())
			return new Error('Error Mounting Unit');

		if(this.checkFile(file))
			return new Error('File already exists');

		let { currentUnit } = this.props;
		let { superblock, entryTable, bitmap } = currentUnit.props;
		let { blockSize } = superblock.props;

		let fileName = this.trimFileName(file);
		let buffer   = fs.readFileSync(file);

		fs.open('./FileSystem/units/' + currentUnit.props.name, 'r+', (err, fd) => {

			if(err)
				return err;

			entryTable.addFile(fileName, bitmap.getNext(), buffer.length);
			let bytesAllocated = 0;

			while(bytesAllocated < buffer.length){
				let offset;
				let dataSize     = blockSize-4;
				let currentBlock = bitmap.getAndSetNext();
				let nextBlock    = 0;

				if(bytesAllocated + dataSize >= buffer.length )
					offset = buffer.length - bytesAllocated;
				else{
					offset = blockSize-4;
					nextBlock = bitmap.getNext();
				}

				let subBuffer = buffer.slice(bytesAllocated, bytesAllocated + offset);
				var nextBlockBuffer = new Buffer(4);

				if(nextBlock != -1)
					nextBlockBuffer.writeUInt32BE(nextBlock, 0);

				if(currentBlock == -1)
					return new Error('Disk is full');

				fs.writeSync(fd, subBuffer, 0, subBuffer.length, blockSize*currentBlock+4);
				fs.writeSync(fd, nextBlockBuffer, 0, nextBlockBuffer.length, blockSize*currentBlock);
				bytesAllocated += offset;
			}
			this.writeUnit(fd,this.props.currentUnit);
		});
	}

	exportFile(file, dst) {
		if(!this.checkUnit())
			return new Error('Error Mounting Unit');

		if(!this.checkFile(file))
			return new Error('File doesn\'t exist');

		let { currentUnit } = this.props;
		let { superblock, entryTable, bitmap } = currentUnit.props;
		let { blockSize } = superblock.props;

		let fileName = this.trimFileName(file);
		let buffer   = fs.readFileSync('./FileSystem/units/' + currentUnit.props.name);
		let entry    = entryTable.getEntry(fileName);

		fs.open(dst, 'w', (err, fd) => {

			if(err)
				return err;

			let currentBlock   = entry.data;
			let bytesAllocated = 0;

			while(currentBlock != 0){

				let dataByteOffset = currentBlock*blockSize+4;
				let subBuffer      = buffer.slice(dataByteOffset, dataByteOffset + blockSize - 4);

				currentBlock = buffer.readUInt32BE(blockSize*currentBlock,4);

				let trimIndex = 0;
				if(currentBlock === 0){
					trimIndex = entry.length - bytesAllocated;
					subBuffer = subBuffer.slice(0, trimIndex);
				}

				fs.writeSync(fd, subBuffer, 0, subBuffer.length, bytesAllocated);
				if(currentBlock != 0)
					bytesAllocated += blockSize - 4;
				else
					bytesAllocated += trimIndex;
			}
		});
	}

	checkUnit() {
		return this.props.currentUnit ? true : false;
	}

	checkFile(file) {
		let { entryTable } = this.props.currentUnit.props;
		let fileName = this.trimFileName(file);
		return entryTable.exists(fileName);
	}

	getBlocks(file) {

		if(!this.checkUnit())
			return new Error('Error Mounting Unit');

		if(!this.checkFile(file))
			return new Error('File doesn\'t exist');

		let { currentUnit } = this.props;
		let { superblock, entryTable } = currentUnit.props;
		let { blockSize } = superblock.props;

		let fileName = this.trimFileName(file);
		let buffer   = fs.readFileSync('./FileSystem/units/' + currentUnit.props.name);
		let entry    = entryTable.getEntry(fileName);
		let blocks   = [];
		let currentBlock = entry.data;

		while(currentBlock != 0){
			blocks.push(currentBlock);
			currentBlock = buffer.readUInt32BE(blockSize*currentBlock,4);
		}
		return blocks;
	}

	trimFileName(file) {
		let split = file.split('/');
		return split.length > 1 ? split[split.length - 1] : split[0];
	}
}

module.exports = FileSystem;