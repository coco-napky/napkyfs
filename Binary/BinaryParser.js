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

module.exports = { parseBinary, toBinaryBuffer, write, read, parseFromFile, getSize };