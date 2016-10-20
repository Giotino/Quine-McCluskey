class VHDL {
  constructor(nbit, nfunc, blocks, bnames = null, fnames = null) {
    this.bnames = bnames;
    if(bnames == null) {
      this.bnames = [];
      for(let i=0; i<nbit; i++)
        this.bnames.push("B"+i);
    }
   
    this.fnames = fnames;
    if(fnames == null) {
      this.fnames = [];
      for(let i=0; i<nfunc; i++)
        this.fnames.push("F"+i);
    }

    this.nbit = nbit;
    this.nfunc = nfunc;
    this.blocks = blocks;
    this.out = '';
  }

  addHeader() {
    this.out +=
      'LIBRARY ieee;\n' +
      'USE ieee.std_logic_1164.ALL;\n'+
      'USE ieee.numeric_std.all;\n'
  }

  addIO() {
    this.out += 
      '\nENTITY Project IS\n' +
      '  PORT(\n'
    for(let i=0; i<this.nbit; i++)
      this.out += '    '+this.bnames[i]+': IN std_logic;\n';
    
    for(let i=0; i<this.nfunc; i++)
      if(i != this.nfunc-1)
        this.out += '    '+this.fnames[i]+': OUT std_logic;\n';
      else
        this.out += '    '+this.fnames[i]+': OUT std_logic\n';
      
    this.out +=
      '  );\n' +
      'END Project;\n'
  }

  addSignals() {
    this.out += '\nARCHITECTURE structural OF Project IS\n';

    for(let i=0; i<this.blocks.length; i++) //segnali degli AND
      this.out += '  SIGNAL T'+i+': std_logic;\n';
    for(let i=0; i<this.nbit; i++) //segnali dei BIT
      this.out += '  SIGNAL I'+i+': std_logic;\n';
    for(let i=0; i<this.nbit; i++) //segnali dei !BIT
      this.out += '  SIGNAL NI'+i+': std_logic;\n';
    for(let i=0; i<this.nfunc; i++) //segnali degli OR (non necessari)
      this.out += '  SIGNAL O'+i+': std_logic;\n';
  
    this.out += '\nBEGIN\n';
  }

  addInput() {
    for(let i=0; i<this.nbit; i++) {
      this.out += '  I'+i+' <= '+this.bnames[i]+';\n';
      this.out += '  NI'+i+' <= not '+this.bnames[i]+';\n';
    }

    this.out += '\n';
  }

  addAND() {
    var a = this;
    this.blocks.forEach((block, i) => {
      a.out += '  T'+i+' <= ';
      block.bits.reverse().forEach((b, j) => {
        if(j != 0 && (b == 0 || b == 1))
          a.out += ' and ';

        if(b === 1)
          a.out += 'I'+j;
        else if(b === 0)
          a.out += 'NI'+j;
      });
      a.out += ';\n';
    });
    a.out += '\n';
  }

  addOR() {
    var bof = []; //blocchi delle funzioni
    var a = this;

    for(let i=0; i<this.nfunc; i++)
      bof.push([]);

    this.blocks.forEach((b, i) => {
      b.functions.forEach((f, j) => {
        if(f === 1)
          bof[j].push(i);
      });
    });

    bof.forEach((f, i) => {
      a.out += '  O'+i+' <= ';
      f.forEach((b, j) => {
        if(j != 0)
          a.out += ' or ';

        a.out += 'T'+b;
      });
      a.out += ';\n';
    });
    this.out += '\n';
  }

  addOutput() {
    for(let i=0; i<this.nfunc; i++)
      this.out += '  '+this.fnames[i]+' <= O'+i+';\n';

    this.out += '\n';

    this.out += 'END structural;\n';
  }

  run() {
    this.addHeader();
    this.addIO();
    this.addSignals();
    this.addInput();
    this.addAND();
    this.addOR();
    this.addOutput();
    return this.out;
  }
}

module.exports = VHDL;