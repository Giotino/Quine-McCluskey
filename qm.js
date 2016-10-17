/*
Autore: Giovanni Minotti
E-Mail: giovanni@minotti.net

Definizioni:
  Tabella: ogni tabella rappresenta un passaggio dell'espansione
  Gruppo: i gruppi compongono le tabelle e contengono i blocchi divisi per quantita' di 1
  Blocco: un blocco corrisponde a una riga delle tabelle
  Matrice delle funzioni: e' un array associato a un blocco che contiene 1 e 0, 
    negli indici corrispondenti alle funzioni, in base alla copertura

Per la copertura e' stata impostata una tabella che ha come nome delle colonne 
  <minterm>.<funzione> (es 2.1 -> minterm 2 della seconda funzione)
*/
const Block = require('./block.js');
const Utility = require('./utility.js');
const Miniterm = require('./minterm.js');

class QuineMcCluskey {
  constructor(bsize, names) {
    this.bsize = bsize;
    this.names = names;
    this.tables = []; //creo lista delle tabelle
    this.first_blocks = []; //creo lista dei primi blocchi
    this.functions = []; //creo lista delle funzioni
  }

  parseFunctions() {
    for(let i=0; i<Math.pow(2, this.bsize); i++) { //considero ogni minterm possibile
      var m = this.mintermFunctionMatrix(i); //genero la matrice delle funzioni(considerando anche i dontcare)
      
      if(m != null) { //se la matrice non e' nulla(vuota)
        var mt = new Miniterm(i); //creo un minterm a partire dal numero
        var b = mt.toBlock(this.bsize); //trasformo il minterm in un blocco
        b.functions = m; //assegno al blocco la matrice delle funzioni
        this.first_blocks.push(b); //aggiungo il blocco generato ai blocchi
      }

    }
  }

  expansion() {
    var table = []; //creo la prima tabella
    for(let i=0; i<this.bsize+1; i++)
      table.push([]); //riempo la prima tabella con gruppi vuoti

    this.first_blocks.forEach(function(mt) {
      table[mt.ones].push(mt); //inserisco i primi blocchi nei gruppi corrispondenti in base al numero di 1
    });

    this.tables.push(table); //inserisco la prima tabella alla lista delle tabelle
  
    var end = false; //flag per terminare l'espansione
    var nums = []; //lista di combinazioni gia' esistenti

    while(!end){
      end = true; //l'espansione deve terminare se l'algoritmo non dice il contrario
      
      var ntable = []; //nuova tabella
      for(let i=0; i<this.bsize+1; i++)
        ntable.push([]); //riempo la tabella con gruppi vuoti

      for(let i=0; i<this.bsize; i++) { //esamina ogni gruppo della tabella corrente
        
        var g = table[i]; //gruppo corrente
        var ng = table[i+1]; //gruppo successivo

        for(let j=0; j<g.length; j++) { //ogni blocco del gruppo
          for(let k=0; k<ng.length; k++) { //viene comparato con tutti quelli del successivo

            switch(this.compareBlocks(g[j], ng[k])) { //calcola le differenza tra i due blocchi
              case 0: //uguali(impossibile)
                break;
              case 1: //1 differenza(quindi raggruppabili)
                var m = this.mergeBlockMatrix(g[j].functions, ng[k].functions); //unisce le matrici delle funzioni dei due blocchi
                if(m === null) //se non hanno corrispondenze
                  continue; //salta l'elaborazione
                
                var c = this.compareBlockMatrix(g[j].functions, ng[k].functions); //compara le matrici delle funzioni dei due blocchi
                if(c == -1)
                  g[j].marked = true; //marca blocco 1 come utilizzato
                if(c == 1)
                  ng[k].marked = true; //marca blocco 2 come utilizzato
                if(g[j] == ng[k] || c == 0) { 
                  g[j].marked = true; //marca blocco 1 come utilizzato
                  ng[k].marked = true; //marca blocco 2 come utilizzato
                }

                var b = this.mergeBlocks(g[j], ng[k]); //unisce i due blocchi in un nuovo blocco

                if(!Utility.arrayInArray(nums, b.nums)){ //se la combinazione non e' ancora stata utilizzata
                  ntable[b.ones].push(b); //aggiungi il nuovo blocco al gruppo corrispondente
                  nums.push(b.nums); //ricorda di non utilizzare di nuovo la combinazione
                }

                end = false; //impedisce all'espansione di terminare
                break;
              default: //piu' di una differenza, non raggruppabili
                break;
            }

          }
        }

      }

      table = Utility.clone(ntable); //niente di utile

      if(!end) //se non deve terminare
        this.tables.push(table); //aggiungi tabella alla lista delle tabelle
    }
  }

  coverage() {
    var pbs = this.formatNumsOfBlocks(this.getUnMarked()); //ottengo i blocchi non utilizzati(primi)
    var dcs = this.formatNumsOfDontcares(); //trasformo gli oggetti DontCare in formato per copertura
    var mts = this.formatNumsOfMinterms(); //trasformo gli oggetti MinTerm in formato per copertura

    var cos = this.coveredOnce(pbs); //ottengo i blocchi che coprono da soli almeno 1 miniterm
    var cnums = []; //minterm coperti
    this.picks = []; //blocchi utilizzati

    var a = this;

    dcs.forEach(function(dc) { //considero tutti i dontcare
      pbs = a.massRemove(pbs, dc); //rimuovo i dontcare dai blocchi
    });

    cos.forEach(function(co) { //considero tutti blocchi che corpono da soli almeno 1 minterm
      a.picks.push(co); //aggiungo il blocco alla lista delle scelte

      co.nums.forEach(function(num) { //considero ogni minterm coperto dal blocco
        if(Utility.inArray(cnums, num)) //se e' gia' stato coperto
          return; //salta la sua elaborazione

        cnums.push(num); //aggiungi il minterm alla lista dei coperti
        pbs.remove(co); //rimuovi il blocco da quelli non usati
        pbs = a.massRemove(pbs, num); //rimuovo il minterm coperto, da i blocchi rimanenti 
      });
    });

    pbs.sort(function(b, c) { //ordino i blocchi non utilizati dal piu' coprente a quello meno
      var coverage = c.nums.length - b.nums.length; //coefficiente di copertura
      var saving = a.countNulls(c) - a.countNulls(b); //coefficiente di risparmio
      var coeff = coverage + saving/Math.pow(10, a.bsize); //coefficiente totale
      return coeff;
    });

    while(cnums.length < mts.length) { //elaboro finche' non ho coperto tutti i minterm
      var sel = pbs[0]; //selezione il primo blocco primo(quello con maggior copertura)
      if(sel.nums.length == 0) continue; // ignora blocchi che non coprono alcun minterm
      this.picks.push(sel); //aggiungo il blocco a quelli scelti

      sel.nums.forEach(function(num) { //elaboro ogni minterm coperto dal blocco
        if(!Utility.inArray(cnums, num) && Utility.inArray(mts, num)) //se il minterm non e' ancora presente nella lista dei coperti
          cnums.push(num);  //allora lo aggiungo alla lista dei coperti
        
        pbs.forEach(function(pb, i) { //elaboro ogni blocco primo
          if(i == 0) return; //se e' il primo(quello che ho selezionato) non fare niente
          pbs[i].nums.remove(num); //altrimenti rimuovi il minterm che sto elaborando alla sua copertura
        });
      });

      pbs.splice(0, 1); //rimuovo il blocco scelto dalla lista dei blocchi primi
      pbs.sort(function(b, c) { //ordino i blocchi non utilizati dal piu' coprente a quello meno
        var coverage = c.nums.length - b.nums.length; //coefficiente di copertura
        var saving = a.countNulls(c) - a.countNulls(b); //coefficiente di risparmio
        var coeff = coverage + saving/Math.pow(10, a.bsize); //coefficiente totale
        return coeff;
      });

    }

  }

  expression() { //genera l'espressione
    var final = ''; //stringa finale
    var a = this;

    var fs = []; //lista delle liste dei blocchi che coprono le singole funzioni
    this.functions.forEach(function() { //per ogni funzione
      fs.push([]); //aggiungo una lista dei blocchi vuota
    });

    this.picks.forEach(function(b) { //considero ogni blocco utilizzato
      b.nums.forEach(function(n) { //considero ogni minterm coperto dal blocco
        var fi = a.getFunctionFromNum(n); //prendo la funzione coperta dal minterm
        if(Utility.inArray(fs[fi], b)) //se la funzione coperta possiede gia' quel blocco
          return; //allora ignoralo

        fs[fi].push(b); //altrimenti aggiungilo ai blocchi coprenti quella funzione
      })
    });

    fs.forEach(function(f, fi) { //considero ogni funzione
      // final += 'f' + fi + ' = ';
      final += a.functions[fi].name + ' = '; //aggiungo all'inizio della riga "<nome funzione> = "
      f.forEach(function(block, j) { //considero ogni blocco utilizzato per la funzione
        var b = Utility.clone(block); //niente di utile
        let out = ''; //stringa del blocco

        let bits = b.bits.reverse(); //giro tutti i bit perche' sono al contrario
        for(let i=0; i<a.bsize; i++) { //considero ogni bit
          if(bits[i] === null){} //se il bit non esiste lo ignoro
          else if(bits[i]) //se il bit e' 1
            out += a.names[i]; //aggiungo "<nome bit>" alla stringa del blocco
          else if(!bits[i]) //se il bit e' 0
            out += '!' + a.names[i]; //aggiungo "!<nome bit>" alla stringa del blocco
        }
        final += out; //aggiungo la stringa del blocco alla stringa finale
        if(j != f.length-1) //se non e' l'ultimo blocco
          final += '+'; //aggiungo un +
      });
      if(fi != fs.length-1) //se non e' l'ultima funzione
        final += '\n'; //aggiungo un a capo(/n)
    });

    return final; //restituisco la stringa finale
  }
  

  countNulls(block) { //conta i bit eliminati di un blocco
    var nulls = 0; //numero dei bit eliminati

    block.bits.forEach(function(b) { //considero ogni bit del blocco
      if(b === null) //se il bit e' stato eliminato
        nulls++; //incrementa i bit eliminati
    });

    return nulls; //restituisco i bit eliminati
  }

  formatNumsOfBlocks(blocks) { //formatto i minterm dei blocchi nel formato <minterm>.<funzione>
    blocks.forEach(function(block, i) { //considero ogni blocco
      var nums = []; //elenco dei minterm

      block.functions.forEach(function(f, j) { //considero ogni funzione del blocco
        block.nums.forEach(function(num) { //considero ogni minterm del blocco
          if(f) //se il blocco copre la funzione
            nums.push(parseFloat(num + "." + j)); //aggiungo il minterm formattato ai minterm
        });
      });

      blocks[i].nums = nums; //sostituisco i minterm del blocco con quelli nuovi
    });

    return blocks; //restituisco i blocchi modificati
  }

  formatNumsOfDontcares() { //formatto i dontcare dei blocchi nel formato <dontcare>.<funzione>
    var dcs = []; //elenco dei dontcare

    this.functions.forEach(function(f, i) { //considero tutte le funzioni
      f.dontcares.forEach(function(dc) { //considero ogni dontcare della funzione
        dcs.push(parseFloat(dc.num + "." + i)); //aggiungo il dontcare formattato ai dontcare
      });
    });

    return dcs; //restituisco i dontcare formattati
  }

  formatNumsOfMinterms() { //formatto i minterm dei blocchi nel formato <minterm>.<funzione>
    var mts = []; //elenco dei minterm

    this.functions.forEach(function(f, i) { //considero tutte le funzioni
      f.minterms.forEach(function(mt) { //considero ogni minterm della funzione
        mts.push(parseFloat(mt.num + "." + i)); //aggiungo il minterm formattato ai minterm
      });
    });

    return mts; //restituisco i minterm formattati
  }

  massRemove(blocks, term) { //rimuovo il minterm da tutti i blocchi
    var a = this;
    blocks.forEach(function(b, i) { //considero ogni blocco
      blocks[i].nums.remove(term); //rimuovo il minterm dal blocco
    });

    return blocks; //restituisco i blocchi modificati
  }

  mintermFunctionMatrix(num) { //crea la matrice di funzioni per un numero
    var matrix = []; //matrice delle funzioni
    var cont = 0; //numero di funzioni coperte

    this.functions.forEach(function(f) { //considero ogni funzione
      if(f.findMintermByNum(num) != 0) { //se il minterm copre la funzione(come minterm o come dontcare)
        matrix.push(1); //inserisco un 1(funzione coperta)
        cont++; //incremento il numero delle funzioni coperte
      }
      else //altrimenti
        matrix.push(0);  //inserisco uno 0(funzione non coperta)
    });

    if(cont == 0) //se non copre funzioni
      return null; //ritorno vuoto
    return matrix; //altrimenti ritorno la matrice delle funzioni
  }

  mergeBlockMatrix(m1, m2) { //unisce due matrici di funzioni, restituisce null se non compatibili
    var m = []; //matrice risultante
    var comp = false; //compatibili?

    for(let i=0; i<m1.length; i++) { //considero ogni bit delle due matrici
      m.push(m1[i] && m2[i]); //inserisco della matrice risultante l'AND dei bit delle due matrici
      if(m1[i] && m2[i]) //se almeno un and vale 1
        comp = true; //allora sono compatibili
    }

    if(comp) //se compatibili
      return m; //restituisce la matrice risultante
    return null; //altrimenti restituisce null
  }

  compareBlockMatrix(m1, m2) { //calcola quali blocchi devono essere marcati come utilizzati
    var s = 0;//bit 1 in m1 e diversi dal corrispondente in m2
    var d = 0;//bit 1 in m2 e diversi dal corrispondente in m1

    for(let i=0; i<m1.length; i++) { //considero ogni bit delle due matrici
      if(m1[i] == 1 && m2[i] == 0) { //se il bit della prima e' 1 e quello della seconda e' 0
          s++; //aumenta s
      } else if(m1[i] == 0 && m2[i] == 1) { //se il bit della prima e' 0 e quello della seconda e' 1
          d++; //aumenta d
      }
    }

    if(s == 0 && d == 0) //se non ci sono differenze restituisco
      return 0; //restituisco 0
    if(s == 0) //se m1 non ha bit 1 diversi da m2
      return -1; //restituisco -1
    if(d == 0) //se m2 non ha bit 1 diversi da m1
      return 1; //restituisco 1
  }

  compareBlocks(b1, b2) { //calcola le differenze di 2 blocchi
    var bb1 = b1.bits; //bits del blocco 1
    var bb2 = b2.bits; //bits del blocco 2

    var diffs = 0; //differenze

    for(let i=0; i<this.bsize+1; i++) //elaboro i 2 blocchi
      if(bb1[i] !== bb2[i]) //se sono diversi
        diffs++; //una differenza in piu'

    return diffs; //ritorno le differenze
  }

  mergeBlocks(b1, b2) { //unisce 2 blocchi
    var bb1 = b1.bits; //bits del blocco 1
    var bb2 = b2.bits; //bits del blocco 2
    var bb = Utility.clone(b1.bits); //bits del blocco risultante

    var diffs = 0; //differenze

    for(let i=0; i<this.bsize+1; i++) //elaboro i 2 blocchi
      if(bb1[i] !== bb2[i]) //se il valore di un blocco e' diverso dall'altro
        bb[i] = null; //annullo(-) il valore nel nuovo blocco
    
    var nums = b1.nums.concat(b2.nums); //unisco i valori dei minterms coperti
    var b = new Block(nums, bb); //creo blocco risultante dai bits e dai minterm coperti
    b.functions = this.mergeBlockMatrix(b1.functions, b2.functions); //la matrice delle funzioni del blocco 
                                                                     //e' l'unione delle matrici dei due blocchi
    return b; //ritorno il blocco risultante
  }

  getFunctionFromNum(n) { //ottiene la funzione dal minterm formattato <minterm>.<funzione>
    if(n == Math.floor(n)) //se la funzione e' 0
      return 0; //restituisco 0
    return (n + "").split(".")[1]; //altrimenti restituisco la il numero dopo il .
  }

  getUnMarked() { //cerca blocchi non utilizzati
    var marked = []; //contiene i blocchi non utilizzati

    this.tables.forEach(function(t) { //elaboro ogni tabella
      for(let i=0; i<t.length; i++) { //elaboro ogni gruppo

        var g = t[i];//g = gruppo corrente
        for(let j=0; j<g.length; j++) //elaboro ogni blocco
          if(!g[j].marked) //se il blocco non e' marcato come utilizzato
            marked.push(g[j]); //allora lo aggiungo all'elenco dei non utilizzati
      }
    });

    return marked; //ritorno i blocchi non utilizzati
  }

  coveredOnce(blocks) { //trova i blocchi che coprono da soli almeno 1 miniterm
    var coverOnce = []; //blocchi che coprono da soli almeno 1 minterm

    var a = this;

    var fnums = this.formatNumsOfMinterms(); //ottengo i minterms formattati in <minterm>.<funzione>

    fnums.forEach(function(fnum) { //considero ogni minterm
      let ncover = 0; //numero di blocchi che lo coprono
      var coverBlock = null; //il blocco che lo copre
    
      blocks.forEach(function(b) { //considero ogni blocco
        if(Utility.inArray(b.nums, fnum)) { //se il blocco copre il numero
          coverBlock = b; //imposto il blocco che copre il minterm
          ncover++; //aumento il numero di blocchi che lo coprono
        }
      });

      if(ncover == 1 && !Utility.inArray(coverOnce, coverBlock)) { //se il minterm e' coperto da un solo blocco e il blocco non e' ancora stato scelto
        coverOnce.push(coverBlock); //aggiungo blocco ai blocchi scelti
      }
    });

    return coverOnce; //restituisco i blocchi scelti
  }

}

module.exports = QuineMcCluskey;