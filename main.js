"use strict";

import FileSystem from './FileSystem/FileSystem';
import sync from './FileSystem/sync';

let fs = new FileSystem();

sync.init(fs);

(async function(){
	await sync['create']('napky8', 4096, 10000);
	await sync.mount('napky8');
	console.log(fs.props.currentUnit);
})()



