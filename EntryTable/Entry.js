"use strict";

class Entry {

	//datablock, files
	constructor(file, data){

		file = file.trim();
		this.data = data;

		if(file.length > 60)
			file = file.substring(0,60);

		for (let i = file.length; i < 60; ++i)
			file += ' ';

		this.file = file;
	}

	init(entry) {
		this.file = entry.file;
		this.data = entry.data;
	}
}

module.exports = Entry;