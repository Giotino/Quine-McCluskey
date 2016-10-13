const Block = require('./block.js');

class MinTerm {
  constructor(num) {
    this.num = num;
  }
  
  toBlock(bits) { //trasformo il minterm in un blocco
    var b = Block.fromNums([this.num], global.bits); //genero blocco dal minterm
    b.marked = false; //imposto il blocco come non marcato

    return b;
  }
}

module.exports = MinTerm;