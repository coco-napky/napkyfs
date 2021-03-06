"use strict";

class Entry {

	//datablock, files
	constructor(file, data, length){

		file = file.trim();
		this.data = data;
		this.length = length;

		if(file.length > 60)
			file = file.substring(0,60);

		for (let i = file.length; i < 60; ++i)
			file += ' ';

		this.file = file;
	}

	setName(name) {
		name = name.trim();
		if(name.length > 60)
			name = name.substring(0,60);

		for (let i = name.length; i < 60; ++i)
			name += ' ';

		this.file = name;
	}

	init(entry) {
		this.file = entry.file;
		this.data = entry.data;
	}
}

module.exports = Entry;