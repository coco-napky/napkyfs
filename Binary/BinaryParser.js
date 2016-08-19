"use strict";

const fs = require('fs');

const toBinaryBuffer = object => {
	let stringified = JSON.stringify(object);
	let length      = Buffer.byteLength(stringified)
	let buffer      = new Buffer(4 + length);

	buffer.writeUInt32BE(length, 0);
	buffer.write(stringified, 4)

	return buffer;
}

const bitmapBuffer = bitmap => {
	let { blocks, size } = bitmap;
	let buffer = new Buffer( (size * 4) + 4);

	buffer.writeUInt32BE(blocks, 0);

	for (let i = 0; i < size; ++i)
		buffer.writeUInt32BE(bitmap.bits[i], 4 + i*4);

	return buffer;
}

const parseBitmap = buffer => {

	let blocks = buffer.readUInt32BE(0, 4);
	let size = Math.floor((blocks - 1)/32) + 1;
	let bits = [];

	for (let i = 1; i < size + 1; ++i){
		let offset = i*4;
		let data = buffer.readUInt32BE(offset, offset+4);
		bits.push(data);
	}

	return {size, bits, blocks};
}

const parseBitmapFromFile = (fd, position) => {
	let blocksBuffer = new Buffer(4);
	read(fd, blocksBuffer, position);
	let blocks = blocksBuffer.readUInt32BE(0, 4);
	let size = Math.floor((blocks - 1)/32) + 1;
	let length = 4 + size*4;

	let buffer = new Buffer(length);
	read(fd,buffer,position);
	return parseBitmap(buffer);
}

const getSize = object => toBinaryBuffer(object).length;

const parseBinary = buffer => {
	let length = buffer.readUInt32BE(0, 4);
	return JSON.parse(buffer.slice(4, length + 4).toString());
}


const write = (fd, buffer, position) => fs.writeSync(fd, buffer, 0, buffer.length, position);
const read = (fd, buffer, position) => fs.readSync(fd, buffer, 0, buffer.length, position);

const parseFromFile = (fd, position) => {
	let length = new Buffer(4);
	read(fd, length, position);
	length = length.readUInt32BE(0, 4);

	let object = new Buffer(length + 4);
	read(fd, object, position);
	return parseBinary(object);
}

module.exports = {
	parseBinary,
	toBinaryBuffer,
	write,
	read,
	parseFromFile,
	getSize,
	bitmapBuffer,
	parseBitmap,
	parseBitmapFromFile
};
