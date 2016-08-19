"use strict";

const FileSystem = require('./FileSystem/FileSystem');
let fs = new FileSystem();

const binaryParser = require('./Binary/BinaryParser');


// fs.createUnit('napky3', 512, 100000).then( response =>
// 	fs.mountUnit('napky3').then( response => {
// 	let {currentUnit} = fs.props;
// 	let {bitmap, superblock, entryTable} = currentUnit.props;

// 	console.log('Unit Mounted : ');

// 	// console.log(superblock);

// 	fs.importFile('./napky.jpg');
// }));

fs.mountUnit('napky3').then( response => {
	let {currentUnit} = fs.props;
	let {bitmap, superblock, entryTable} = currentUnit.props;

	console.log('- Current unit : ', currentUnit.props.name);
	console.log(entryTable.getEntries());
	console.log('Napky blocks : ', fs.getBlocks('napky.jpg').length);
	console.log('Free blocks : ', bitmap.getFreeBlocks());

	// fs.importFile('./hello.mp3');
	// fs.exportFile('napky.jpg','./satan.jpg' );
	// console.log('checkpoint');
	// fs.deleteFile('napky.jpg');
	//console.log(entryTable.getEntries());
});