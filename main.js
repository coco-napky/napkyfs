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

	console.log(fs.getBlocks('napky.jpg'));
	// fs.importFile('./hello.mp3');
	// fs.exportFile('hello.mp3','./hello2.mp3' );
});