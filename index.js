const qm = require('./qm.js');
const Block = require('./block.js');
const MinTerm = require('./minterm.js');
const DontCare = require('./dontcare.js');
const Function = require('./function.js');
//non modificare prima di questo

global.bits = 4; //configurare il numero di bits
var bits_names = ['A', 'B', 'C', 'D']; //configurare i nomi dei bits

var p = new qm(global.bits, bits_names);

var f1 = new Function('F1'); //crea quante funzioni vuoi
f1.addMinterms([ //inserisci i minterms della funzione
  new MinTerm(0),
  new MinTerm(2),
  new MinTerm(7),
  new MinTerm(10)
]);
f1.addDontcares([ //inserisci i dontcares della funzione
  new DontCare(12),
  new DontCare(15)
]);
p.functions.push(f1); //aggiungi la funzione al programma

//un'altra funzione
var f2 = new Function('F2');
f2.addMinterms([
  new MinTerm(2),
  new MinTerm(4),
  new MinTerm(5)
]);

f2.addDontcares([
  new DontCare(6),
  new DontCare(7),
  new DontCare(8),
  new DontCare(10)
]);
p.functions.push(f2);
//che termina qui

//ancora una funzione
var f3 = new Function('F3');
f3.addMinterms([
  new MinTerm(2),
  new MinTerm(7),
  new MinTerm(8)
]);

f3.addDontcares([
  new DontCare(0),
  new DontCare(5),
  new DontCare(13)
]);
p.functions.push(f3);
//che termina qui

//non modificare oltre questo
p.parseFunctions();
p.expansion();
p.coverage();
console.log(p.expression());