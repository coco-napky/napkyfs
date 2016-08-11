"use strict";

const Superblock   = require('../Superblock/Superblock');
const Bitmap       = require('../Bitmap/Bitmap');

class Unit {
	constructor(props){
		this.props = props;
	}

	init(props){
		this.props = props;
	}

	getFreebytes(){
		let bitmap = this.props.bitmap;
		let superblock = this.props.superblock;
		let bytes = bitmap.getFreeBlocks() * superblock.props.blockSize;
		console.log(bytes);
	}
}

module.exports = Unit;