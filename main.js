"use strict";

const Bitmap  = require('./Bitmap/Bitmap');

let bitmap = new Bitmap(65);


bitmap.setBlock(65);
bitmap.setBlock(64);
bitmap.setBlock(32);


for (let i =32; i < 63; ++i){
    bitmap.setBlock(i);
}

console.log(bitmap);
console.log(bitmap.bits[0]);

console.log(bitmap.checkBlock(3));

console.log(bitmap.getFreeBlocks());
console.log(bitmap.getNext());
