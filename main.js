"use strict";

const FileSystem = require('./FileSystem/FileSystem');
let fs = new FileSystem();

fs.createUnit('napky3', 4096, 100).then( response =>{
	fs.mountUnit('napky3').then( response => {

   		let {currentUnit} = fs.props;
   		let {bitmap, superblock, entryTable} = currentUnit.props;
   		entryTable.addFile('test', 5);
   		entryTable.addFile('test2', 5);
   		entryTable.setName('test', 'newtest');
   		console.log(entryTable.getEntries());
 	});
});