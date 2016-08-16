"use strict";


const FileSystem = require('./FileSystem/FileSystem');
const EntryTable = require('./EntryTable/EntryTable');
const Entry = require('./EntryTable/Entry');

let fs = new FileSystem();

let entryTable = new EntryTable(6);

let string = JSON.stringify(entryTable);
let string2 = JSON.stringify(entryTable.props.entries[0]);
let delta = 24 + entryTable.props.entries.length - 1 ;
let size  = (string.length - delta)/81;


console.log(string.length);
console.log('===');
console.log(size);

// fs.createUnit('napky3', 4096, 1000).then( response =>
//    fs.mountUnit('napky3').then( response => {
//    		console.log(fs.props.currentUnit.props.bitmap);
//  	})
// );