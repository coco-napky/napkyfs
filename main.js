"use strict";

const FileSystem = require('./FileSystem/FileSystem');
let fs = new FileSystem();

fs.createUnit('napky3', 512, 20).then( response =>
	fs.mountUnit('napky3').then( response => {
	let {currentUnit} = fs.props;
	let {bitmap, superblock, entryTable} = currentUnit.props;

	fs.importFile('./test.txt');
}));