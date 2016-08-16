"use strict";

const Entry = require('./Entry');

class EntryTable {

	 //datablock, files
	constructor(size){
		this.props = {};

		let entries = [];

		for (var i = 0; i < size; ++i) {
			let entry = new Entry(' ', -1);
			entries.push(entry);
		}

		this.props.entries = entries;
	}

	init(entryTable) {
		this.props = entryTable
	}
}

module.exports = EntryTable;