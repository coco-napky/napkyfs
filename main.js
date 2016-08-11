"use strict";


const FileSystem = require('./FileSystem/FileSystem');

let fs = new FileSystem();

fs.createUnit('napky3', 4096, 1000).then( response =>
   fs.mountUnit('napky3').then( response => {
   		console.log(fs.props.currentUnit.props.bitmap);
 	})
);