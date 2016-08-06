"use strict";

const Bitmap = require('../Bitmap/Bitmap');

class Superblock {
	constructor(blockSize, blocks){
		this.blockSize = blockSize;
		this.bitmap    = new Bitmap(blocks);
	}

	getFreeSpace() {
		return this.bitmap.getFreeBlocks() * this.blockSize;
	}

	getAndSetNext() {
		let next = this.bitmap.getNext();
		this.bitmap.setBlock(next);
		return next;
	}

	init(superblock) {
		this.blockSize = superblock.blockSize;
		this.bitmap    = new Bitmap(0);
		this.bitmap.init(superblock.bitmap);
	}
}

module.exports = Superblock;