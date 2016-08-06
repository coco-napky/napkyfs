"use strict";

const Bitmap  = require('./Bitmap/Bitmap');

let bitmap = new Bitmap(65);

for (let i = 0; i < 65; ++i){
	bitmap.setBlock(i);
}

console.log(bitmap);
console.log(bitmap.bits[0].toString(2));
console.log('Free : ' + bitmap.getNext());
