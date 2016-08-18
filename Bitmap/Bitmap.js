"use strict";

const { setBit, resetBit, checkBit } = require('./bitwise');

class Bitmap {
    constructor(blocks){
        this.size = Math.floor((blocks - 1)/32) + 1;
        this.bits = [];
        this.blocks = blocks;
        for (let i = 0; i < this.size; ++i)
            this.bits[i] = 0;
    }

    init(bitmap) {
        this.size   = bitmap.size;
        this.bits   = bitmap.bits;
        this.blocks = bitmap.blocks;
    }

    getAbsolutePosition(blockIndex){
        let index  = Math.floor(blockIndex/32),
            offset = blockIndex % 32,
            valid  = index  < this.size;
        return {index, offset, valid};
    }

    toggleBlock(blockIndex, turnOn){
        let { index, offset, valid } = this.getAbsolutePosition(blockIndex);

        if(!valid)
            return;

        let value   = this.bits[index];
        this.bits[index] = turnOn ? setBit(value, offset) >>> 0 : resetBit(value, offset) >>> 0;
    }

    setBlock(blockIndex){
        this.toggleBlock(blockIndex, true);
    }

    resetBlock(blockIndex){
        this.toggleBlock(blockIndex, false);
    }

    checkBlock(blockIndex){
        let { index, offset, valid } = this.getAbsolutePosition(blockIndex),
            value = this.bits[index];

        return valid && checkBit( value, offset);
    }

    getFreeBlocks(){
        let freeBlocks = 0;
        let blockIndex = 0;
        for (let i = 0; i < this.size; ++i){
            let index = this.bits[i];

            for (let j = 0; j < 32; ++j){
                ++blockIndex;
                if(!checkBit(index, j))
                    ++freeBlocks;
                if(blockIndex >= this.blocks)
                    return freeBlocks;
            }

        }
        return freeBlocks;
    }

    getNext(){
        let blockIndex = 0;
        for (let i = 0; i < this.size; ++i){
            let index = this.bits[i] >>> 0;

            for (let j = 0; j < 32; ++j){
                if(checkBit(index, j))
                    ++blockIndex;
                else
                    return blockIndex;

                if(blockIndex >= this.blocks)
                    return -1;
            }
        }
        return -1;
    }

    getAndSetNext() {
        let next = this.getNext();
        this.setBlock(next);
        return next;
    }
}

module.exports = Bitmap;
