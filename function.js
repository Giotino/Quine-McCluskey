class Function {
  constructor(name) {
    this.minterms = [];
    this.dontcares = [];
    this.name = name;
  }

  addMinterms(mts) { //aggiungo i minterm
    var a = this;
    mts.forEach(function(mt) { //per ogni minterm
      a.minterms.push(mt); //aggiungo il minterm
    });
  }

  addDontcares(dcs) { //aggiungo i dontcare
    var a = this;
    dcs.forEach(function(dc) { //per ogni dontcare
      a.dontcares.push(dc); //aggiungo il dontcare
    });
  }

  findMintermByNum(num) { //identifico la natura(inesistente(0), minterm(1), dontcare(2)) del minterm dato
    var out = 0;

    this.minterms.forEach(function(mt) { //per ogni minterm
      if(mt.num == num) //se il minterm e' quello dato
        out = 1; //il minterm e' un minterm
    });

    this.dontcares.forEach(function(dc) { //per ogni dontcare
      if(dc.num == num) //se il dontcare e' il minterm dato
        out = 2; //il minter e' un dontcare
    });

    return out;//0 se non esiste, 1 se e' un minterm, 2 se e' un dontcare
  }
}

module.exports = Function;