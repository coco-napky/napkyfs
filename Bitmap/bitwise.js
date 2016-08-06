"use strict";

const setBit   = (src, n) =>    src |  (1 << n >>> 0) >>> 0;
const resetBit = (src, n) =>    src & ~(1 << n >>> 0) >>> 0;
const checkBit = (src, n) => !((src &  (1 << n >>> 0) >>> 0) == 0);

module.exports = { setBit, resetBit, checkBit }
