"use strict";

const Superblock   = require('../Superblock/Superblock');
const Bitmap       = require('../Bitmap/Bitmap');
const EntryTable   = require('../EntryTable/EntryTable');

class Unit {
	constructor(args) {
		this.props = {};

		this.props.bitmap = new Bitmap(0);
		this.props.bitmap.init(args.bitmap);

		this.props.superblock = new Superblock({});
		this.props.superblock.init(args.superblock.props);

		this.props.entryTable = new EntryTable(0);
		this.props.entryTable.init(args.entryTable.props);
	}

	init(props) {
		this.props = props;
	}

	getFreeBytes() {
		let bitmap = this.props.bitmap;
		let superblock = this.props.superblock;
		return bitmap.getFreeBlocks() * this.getBlockSize();
	}

	getBlockSize() {
		let superblock = this.props.superblock;
		return superblock.props.blockSize;
	}
}

module.exports = Unit;