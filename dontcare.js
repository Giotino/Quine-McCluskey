const Block = require('./block.js');

class DontCare {
  constructor(num) {
    this.num = num;
  }
  
  toBlock(bits) { //trasformo il dontcare in un blocco
    var b = Block.fromNums([this.num], global.bits); //genero blocco dal dontcare
    b.marked = true; //imposto il blocco come marcato(per essere usato al meglio nell'espansione)
    b.dc = true; //imposto il blocco come dontcare

    return b;
  }
}

module.exports = DontCare;