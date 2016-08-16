"use strict";

const Entry = require('./Entry');

class EntryTable {

	 //entries
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
		//TODO: init each entry
		this.props = entryTable
	}
}

module.exports = EntryTable;