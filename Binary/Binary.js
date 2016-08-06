const toBinaryBuffer = object => {
	let stringified = JSON.stringify(object);
	let length      = Buffer.byteLength(stringified)
	let buffer      = new Buffer(4 + length);

	buffer.writeUInt32BE(length, 0);
	buffer.write(stringified, 4)

	console.log(stringified);
	console.log(stringified.length);
	console.log(length);

	return buffer;
}

const parseBinary = buffer => {
	let length = buffer.readUInt32BE(0, 4),
	message = buffer.slice(4, length + 4).toString();
	return JSON.parse(message);
}

module.exports = { parseBinary, toBinaryBuffer };