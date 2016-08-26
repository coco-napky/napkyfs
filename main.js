"use strict";

const FileSystem = require('./FileSystem/FileSystem');
let fs = new FileSystem();

const binaryParser = require('./Binary/BinaryParser');

// fs.createUnit('napky4', 512, 100000).then( response =>
// 	fs.mountUnit('napky4').then( response => {
// 	let { currentUnit } = fs.props;
// 	let { bitmap, superblock, entryTable } = currentUnit.props;

// 	// fs.importFile('./napky.jpg');
// }));


fs.mountUnit('napky4').then( response => {
	let {currentUnit} = fs.props;
	let {bitmap, superblock, entryTable} = currentUnit.props;

	console.log('- Current unit : ', currentUnit.props.name);
	console.log(entryTable.getEntries());
	// console.log('Napky blocks : ', fs.getBlocks('song.mp3'));
	console.log('Free blocks : ', bitmap.getFreeBlocks());

	// fs.importFile('./Dream Theater - Learning to Live.mp3', 'song.mp3');
	// fs.exportFile('song.mp3','./pollito.mp3' );
	// console.log('checkpoint');
	// fs.deleteFile('song.mp3');
	// console.log(entryTable.getEntries());
});