'use strict';

import inquirer from 'inquirer';
import stepOnePrompts  from './prompts/stepOne';
import createUnitPrompts  from './prompts/createUnit';
import { UNMOUNT_UNIT, MOUNT_UNIT, CREATE_UNIT, LIST_UNITS, INSPECT, DELETE_UNIT } from './constants';

import FileSystem from '../FileSystem/FileSystem';
import sync from '../FileSystem/sync';

let fs = new FileSystem();

sync.init(fs);

async function run() {
	while(true){
		await stepOne();
	}
	return 0;
}

async function stepOne() {
	let answer = {};
	answer.action = LIST_UNITS;

	while(answer.action == LIST_UNITS){
		answer = await inquirer.prompt(stepOnePrompts);
		let units = fs.getUnits();

		switch(answer.action){
			case MOUNT_UNIT:
				if(units.length > 0)
					await mountUnit();
				else
					console.log('\n', '*** No Units Created ***', '\n');
			break

			case UNMOUNT_UNIT:
				fs.unmountUnit();
				console.log('\n', '*** Unit unmounted ***', '\n');
			break

			case CREATE_UNIT:
				await createUnit();
			break

			case DELETE_UNIT:
				await deleteUnit();
			break

			case LIST_UNITS:
				if(units.length > 0)
					console.log('\n', ...units, '\n');
				else
					console.log('\n', '*** No Units Created ***', '\n');
			break

			case INSPECT:
				inspect();
			break

		}
	}
}

async function mountUnit() {
	let answer = await inquirer.prompt({
	    type: 'list',
	    name: 'unit',
	    message: 'Choose unit to mount :',
	    choices: fs.getUnits()
	});
	await sync.mount(answer.unit);
}

function inspect() {
	let { currentUnit } = fs.props;

	console.log('');
	if(currentUnit) {

		let { bitmap, entryTable, name, superblock } = currentUnit.props;
		let {blockSize, blocks, entryTableBlocks, bitmapBlocks, osBlocks} = superblock.props;

		let unitsize  = blocks*blockSize,
		    freeSpace = currentUnit.getFreeBytes()/unitsize * 100;

		freeSpace = freeSpace.toFixed(2);

		let numberOfEntries  = entryTable.props.entries.length,
		    occuppiedEntries = currentUnit.getEntries().length,
		    freeEntries      = numberOfEntries - occuppiedEntries;

		console.log('*****************************************');
		console.log('Unit name : ', name);
		console.log('*****************************************');
		console.log('Blocksize : ', blockSize);
		console.log('Total number of blocks : ', blocks);
		console.log('Blocks occupied by bitmap : ', bitmapBlocks);
		console.log('Blocks occupied by entry table : ', entryTableBlocks);
		console.log('Blocks occupied by OS : ', osBlocks);
		console.log('*****************************************');
		console.log('Unit size in bytes : ', unitsize);
		console.log('Free space in bytes : ', currentUnit.getFreeBytes());
		console.log('Free blocks : ', bitmap.getFreeBlocks());
		console.log('Free space : ', freeSpace + '%');
		console.log('*****************************************');
		console.log('Total number of entries  : ', numberOfEntries);
		console.log('Number of entries occupied  : ', occuppiedEntries);
		console.log('Number of free entries : ', freeEntries);
		console.log('*****************************************');
	}
	else
		console.log('*** No Unit Mounted ***');
	console.log('');
}

async function deleteUnit() {
	let answer = await inquirer.prompt({
	    type: 'list',
	    name: 'unit',
	    message: 'Choose unit to delete :',
	    choices: fs.getUnits()
	});
	fs.deleteUnit(answer.unit);
	// await sync.mount(answer.unit);
}

async function createUnit() {
	let answer = await inquirer.prompt(createUnitPrompts);
	let { blocksize, name, size } = answer;

	blocksize = parseInt(blocksize);
	let bytes = size*1000*1000;
	let blocks = Math.floor(bytes/blocksize);
	await sync.create(name, blocksize, blocks);
}

module.exports = { run };