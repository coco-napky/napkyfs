"use strict";


const FileSystem = require('./FileSystem/FileSystem');

let fs = new FileSystem();

fs.createUnit('napky3', 4096, 10000).then( (response) =>{
	console.log('response 3');
});

fs.createUnit('napky4', 4096, 1000).then( (response) =>{
	console.log('response 4');
});

fs.createUnit('napky5', 4096, 10).then( (response) =>{
	console.log('response 5');
});