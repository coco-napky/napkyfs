"use strict";

const setBit   = (src, n) =>  src |  (1 << n);
const resetBit = (src, n) =>  src & ~(1 << n);
const checkBit = (src, n) => (src &  (1 << n)) > 0;

module.exports = { setBit, resetBit, checkBit }
