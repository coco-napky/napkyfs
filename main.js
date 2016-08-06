"use strict";

const Superblock  = require('./Superblock/Superblock');

let superblock = new Superblock(4096, 65);

console.log(superblock.getFreeSpace()/4096);
console.log(superblock.getFreeSpace()/4096);

