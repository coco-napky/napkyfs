"use strict";

const FileSystem = require('./FileSystem/FileSystem');
let fs = new FileSystem();

// fs.createUnit('napky3', 1024, 1000).then( response =>
// 	fs.mountUnit('napky3').then( response => {
// 	let {currentUnit} = fs.props;
// 	let {bitmap, superblock, entryTable} = currentUnit.props;

// 	fs.importFile('./napky.jpg');
// }));



fs.mountUnit('napky3').then( response => {
	let {currentUnit} = fs.props;
	let {bitmap, superblock, entryTable} = currentUnit.props;

	fs.exportFile('./napky.jpg', './exported3.jpg');
});