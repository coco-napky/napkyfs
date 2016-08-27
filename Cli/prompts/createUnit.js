'use strict';

import { XSM_BLOCK, SM_BLOCK, MD_BLOCK, LG_BLOCK } from '../constants';

const blocksize = {
    type: 'list',
    name: 'blocksize',
    message: 'Choose block size in bytes',
    choices: [
	  XSM_BLOCK,
	  SM_BLOCK,
	  MD_BLOCK,
	  LG_BLOCK
    ]
}

const unit = {
    type: 'input',
    name: 'name',
    message: 'Type unit name'
}

const size = {
    type: 'input',
    name: 'size',
    message: 'Type unit size in megabytes',
    validate: value => {
    	let data = parseInt(value);
    	if(typeof data === 'number' && data % 1 === 0)
    		return true;
    	return 'Input must be an integer';
    }
}

module.exports = [blocksize, unit, size];