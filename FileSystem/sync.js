"use strict";

let fs = {};

const init =  filesystem => fs = filesystem

async function mount(unit) {
	try { await fs.mountUnit(unit);
	} catch(e){
		console.log(e.message)
	}
}

async function create(unit, blockSize, blocks) {
	try {
		await fs.createUnit(unit, blockSize, blocks);
	} catch(e){
		console.log(e.message)
	}
}

async function importFile(path, dst) {
	try {
		await fs.importFile(path, dst);
	} catch(e){
		console.log(e.message)
	}
}

async function exportFile(file, dst) {
	try {
		await fs.exportFile(file, dst);
	} catch(e){
		console.log(e.message)
	}
}

async function deleteFile(file) {
	try {
		await fs.deleteFile(file);
	} catch(e){
		console.log(e.message)
	}
}

export default { init, mount, create, import: importFile, export: exportFile,  delete: deleteFile }