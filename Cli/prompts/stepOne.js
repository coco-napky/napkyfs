'use strict';

import { UNMOUNT_UNIT, MOUNT_UNIT, CREATE_UNIT, LIST_UNITS, INSPECT } from '../constants';


const actions = {
    type: 'list',
    name: 'action',
    message: 'What do you want to do?',
    choices: [
      MOUNT_UNIT,
      UNMOUNT_UNIT,
      CREATE_UNIT,
      LIST_UNITS,
      INSPECT
    ]
}

module.exports = [actions];