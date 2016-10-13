class Block {
  static fromBits(bits) {
    var nums = [Block.bitsToInt(bits)];
    return new Block(nums, bits);
  }

  static fromNums(nums, bsize) {
    var bits = Block.intToBits(nums[0], bsize);
    return new Block(nums, bits);
  }

  constructor(nums, bits) {
    this.nums = nums;
    this.bits = bits;
    this.ones = this.countOnes(); //conta gli 1
    this.marked = false; //non acnora utilizzato
    this.dc = false;
  }

  countOnes() { //conta gli 1 di un array di bit
    var i = 0; //numero di 1

    this.bits.forEach(function(bit) { //per ogni bit
      if(bit) //se il bit e' 1
        i++; //incrementa il numero di 1
    });

    return i;
  }

  static intToBits(num, bsize) { //conversione intero -> array di bit
    var a = num;
    var b = [];

    for(var i=0; i<bsize; i++)
      b[i] = (a >> i) & 1;

    return b;
  }

  static bitsToInt(bits) { //conversione array di bit -> intero
    var value = 0;
    for(var i=bits-1; i>=0; i--)
      value = (value * 256) + bits[i];
        
    return value;
  }
}

module.exports = Block;