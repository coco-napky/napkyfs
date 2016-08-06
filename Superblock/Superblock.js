"use strict";

const Bitmap = require('../Bitmap/Bitmap');

class Superblock {
	constructor(blockSize, blocks){
		this.blockSize = blockSize;
		this.bitmap    = new Bitmap(blocks);
	}

	getFreeSpace(){
		return this.bitmap.getFreeBlocks() * this.blockSize;
	}

	getAndSetNext(){
		let next = this.bitmap.getNext();
		this.bitmap.setBlock(next);
		return next;
	}
}

module.exports = Superblock;