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

				let superblock = new Superblock({blockSize, blocks, entryTableBlocks, bitmapBlocks, osBlocks});
				let unit = new Unit({name, bitmap, superblock, entryTable});

				this.writeUnit(fd, unit);
				resolve({status:1});
			});
		});
		return promise
	}

	writeUnit(fd, unit) {
		let {name, bitmap, superblock, entryTable} = unit.props;
		let {blockSize, bitmapBlocks} = superblock.props;

		let bitmapBuffer     = binaryParser.toBinaryBuffer(bitmap),
		    superblockBuffer = binaryParser.toBinaryBuffer(superblock),
		    entryTableBuffer = binaryParser.toBinaryBuffer(entryTable);

		binaryParser.write(fd, superblockBuffer, blockSize*0);
		binaryParser.write(fd, bitmapBuffer, blockSize*1);
		binaryParser.write(fd, entryTableBuffer, blockSize*(bitmapBlocks+1));

		console.log('Entry Table Written to block : ' + bitmapBlocks+1);
		console.log('Unit ', name, 'has been written');
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
				let bitmap     = binaryParser.parseFromFile(fd, blockSize),
				    entryTable = binaryParser.parseFromFile(fd, blockSize*(bitmapBlocks+1)),
				    unit   = new Unit({name, bitmap, superblock, entryTable});
				this.props.currentUnit = unit;

				resolve({status:1});
			});
		});
		return promise;
	}

	importFile(file) {

		let { currentUnit } = this.props;

		if(!currentUnit) {
			console.log('No unit mounted');
			return;
		}

		fs.open('./FileSystem/units/' + currentUnit.props.name, 'r+', (err, fd) => {

			if(err){
				//reject({status:0, message: 'Error Mounting Unit'});
				return;
			}

			let { bitmap, superblock, entryTable } = currentUnit.props;
			let { blockSize } = superblock.props;

			let split = file.split('/');
			let fileName = split.length > 1 ? split[split.length - 1] : split[0];

			if(!entryTable.addFile(fileName, bitmap.getNext())){
				console.log('File name already exists');
				return;
			}

			let buffer = fs.readFileSync(file);
			let bytesAllocated = 0;

			console.log(entryTable.getEntries());

			while(bytesAllocated < buffer.length){
				let offset;
				let dataSize = blockSize-4;
				let currentBlock = bitmap.getAndSetNext();
				let nextBlock = 0;
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

				if(currentBlock == -1){
					console.log('Disk is full');
					return;
				}

				fs.writeSync(fd, subBuffer, 0, subBuffer.length, blockSize*currentBlock+4);
				fs.writeSync(fd, nextBlockBuffer, 0, nextBlockBuffer.length, blockSize*currentBlock);
				bytesAllocated += offset;
				// console.log(subBuffer.toString()+'|');
			}
			this.writeUnit(fd,this.props.currentUnit);
		});
	}

	exportFile(file, dst) {

		let { currentUnit } = this.props;

		if(!currentUnit) {
			console.log('No unit mounted');
			return;
		}

		let { bitmap, superblock, entryTable } = currentUnit.props;
		let { blockSize } = superblock.props;

		let split = file.split('/');
		let fileName = split.length > 1 ? split[split.length - 1] : split[0];

		if(!entryTable.exists(fileName)){
			console.log('File doesn\'t exists');
			return;
		}

		let buffer = fs.readFileSync('./FileSystem/units/' + currentUnit.props.name);
		let bytesAllocated = 0;

		let entry = entryTable.getEntry(fileName);

		fs.open(dst, 'w', (err, fd) => {
			if(err) {
				console.log('Error Accessing file');
				return;
			}

			let currentBlock = entry.data;
			let bytesAllocated = 0;
			while(currentBlock != 0){

				let dataByteOffset = currentBlock*blockSize+4;
				let subBuffer = buffer.slice(dataByteOffset, dataByteOffset + blockSize - 4);
				currentBlock = buffer.readUInt32BE(blockSize*currentBlock,4);

				if(currentBlock === 0){
					let trimIndex = 0;
					while(subBuffer[trimIndex] != 0)
						++trimIndex;
					subBuffer = subBuffer.slice(0, trimIndex);
					console.log('Trim Index : ', trimIndex);
				}

				fs.writeSync(fd, subBuffer, 0, subBuffer.length, bytesAllocated);
				console.log(subBuffer.length);
				console.log('Next Block', currentBlock);
				bytesAllocated += blockSize - 4;

			}
		});
		// while(bytesAllocated < buffer.length){
		// 	let offset;
		// 	let dataSize = blockSize-4;
		// 	let currentBlock = bitmap.getAndSetNext();
		// 	let nextBlock = 0;
		// 	if(bytesAllocated + dataSize >= buffer.length )
		// 		offset = buffer.length - bytesAllocated;
		// 	else{
		// 		offset = blockSize-4;
		// 		nextBlock = bitmap.getNext();
		// 	}

		// 	let subBuffer = buffer.slice(bytesAllocated, bytesAllocated + offset);
		// 	var nextBlockBuffer = new Buffer(4);

		// 	if(nextBlock != -1)
		// 		nextBlockBuffer.writeUInt32BE(nextBlock, 0);

		// 	if(currentBlock == -1){
		// 		console.log('Disk is full');
		// 		return;
		// 	}

		// 	fs.writeSync(fd, subBuffer, 0, subBuffer.length, blockSize*currentBlock+4);
		// 	fs.writeSync(fd, nextBlockBuffer, 0, nextBlockBuffer.length, blockSize*currentBlock);
		// 	bytesAllocated += offset;
		// 	// console.log(subBuffer.toString()+'|');
		// }
		//this.writeUnit(fd,this.props.currentUnit);
	}
}

module.exports = FileSystem;