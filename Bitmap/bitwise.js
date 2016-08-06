"use strict";

//unsigned int with 32 bits on
const _32BITS = 4294967295;

const setBit   = (src, n) =>    src |  (1 << n >>> 0) >>> 0;
const resetBit = (src, n) =>    src & ~(1 << n >>> 0) >>> 0;
const checkBit = (src, n) => !((src &  (1 << n >>> 0) >>> 0) == 0);

module.exports = { setBit, resetBit, checkBit, _32BITS }
