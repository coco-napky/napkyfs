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
		this.props = entryTable
	}

	setName(src, dst) {
		console.log('checkpoint : SetName');
		for (var i = 0; i < this.props.entries.length; ++i) {
			let entry = this.props.entries[i];
			if(src === entry.file.trim()){
				if(!entry instanceof Entry)
					this.props.entries[i] = new Entry(dst, entry.data);
				else
					this.props.entries[i].setName(dst);
				return;
			}
		}
	}

	addFile(file, data) {
		for (var i = 0; i < this.props.entries.length; ++i) {
			let entry = this.props.entries[i];
			if(entry.data === -1){
				this.props.entries[i] = new Entry(file, data);
				return;
			}
		}
	}

	getEntries() {
		return this.props.entries.filter( entry => entry.data !== -1)
		.map( entry => {
			return {file: entry.file.trim(), data: entry.data};
		});
	}
}

module.exports = EntryTable;