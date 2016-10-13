const qm = require('./qm.js');
const Block = require('./block.js');
const MinTerm = require('./minterm.js');
const DontCare = require('./dontcare.js');
const Function = require('./function.js');

global.bits = 4;

var a = new qm(4, ['A', 'B', 'C', 'D']);

var f1 = new Function('F1');
f1.addMinterms([
  new MinTerm(0),
  new MinTerm(2),
  new MinTerm(7),
  new MinTerm(10)
]);

f1.addDontcares([
  new DontCare(12),
  new DontCare(15)
]);

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

a.functions = [f1, f2, f3];

a.parseFunctions();
a.expansion();
a.coverage();
console.log(a.expression());