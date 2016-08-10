"use strict";

class Superblock {
	//blockSize, blocks, bitmapSize, directorySize
	constructor(props){
		this.props = props;
	}

	init(superblock) {
		this.props = superblock
	}
}

module.exports = Superblock;