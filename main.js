// npm install --save crypto-js

const SHA256 = require('crypto-js/sha256');

class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock() {
        return new Block(0, "01/01/2021", "Genesis block", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }

    isChainValid() {
        for(let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if(currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if(currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }
}


let bitcoin = new Blockchain();
bitcoin.addBlock(new Block(1, "01/05/2021", { amount: 4 }))
bitcoin.addBlock(new Block(2, "10/05/2021", { amount: 10 }))

console.log(JSON.stringify(bitcoin, null, 4));
console.log("Is blockchain valid? " + bitcoin.isChainValid());


// Hacking the data value
bitcoin.chain[1].data = { amount: 100 };
console.log(JSON.stringify(bitcoin, null, 4));
console.log("Is blockchain valid? " + bitcoin.isChainValid());


// Hacking the data value and recalculating the hash value
bitcoin.chain[1].data = { amount: 100 };
bitcoin.chain[1].hash = bitcoin.chain[1].calculateHash();
console.log(JSON.stringify(bitcoin, null, 4));
console.log("Is blockchain valid? " + bitcoin.isChainValid());



// node main.js