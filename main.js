"use strict";


const FileSystem = require('./FileSystem/FileSystem');

let fs = new FileSystem();

fs.createDisk('napky', 4096, 100);