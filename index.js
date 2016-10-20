const qm = require('./qm.js');
const Block = require('./block.js');
const MinTerm = require('./minterm.js');
const DontCare = require('./dontcare.js');
const Function = require('./function.js');
const VHDL = require('./vhdl.js');
//non modificare prima di questo

global.bits = 3; //configurare il numero di bits
var bits_names = ['A', 'B', 'C']; //configurare i nomi dei bits

var p = new qm(global.bits, bits_names);

var f1 = new Function('F0'); //crea quante funzioni vuoi
f1.addMinterms([ //inserisci i minterms della funzione
  new MinTerm(0),
  new MinTerm(1),
  new MinTerm(3),
  new MinTerm(5),
  new MinTerm(7)
]);
p.functions.push(f1); //aggiungi la funzione al programma

//un'altra funzione
//che termina qui

//non modificare oltre questo
p.parseFunctions();
p.expansion();
p.coverage();
console.log(p.expression());

var v = new VHDL(global.bits, 1, p.picks, ['A', 'B', 'C'], ['F1', 'F2', 'F3']);

console.log();

var fs = require('fs');
fs.writeFile("prova.vhd", v.run(), function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
}); 