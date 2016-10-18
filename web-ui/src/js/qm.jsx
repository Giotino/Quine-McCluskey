const React = require('react');
const ReactDOM = require('react-dom');

const Function = require('./function.jsx');
const qms = {
  Function: require('../../../function.js'),
  DontCare: require('../../../dontcare.js'),
  MinTerm: require('../../../minterm.js'),
  QM: require('../../../qm.js')
};

var QM = React.createClass({
  getInitialState: function(){
    return {
      terms: {},
      flength: 0,
      func: [<Function key={0} id={0} remove={this.removeFunction} submit={this.submitTerm} />],
      res: [""]
    };
  },

  removeFunction: function(id) {
    var nfunc = this.state.func;

    nfunc.forEach(function(f, i) {
      if(f.props.id == id)
        nfunc.splice(i, 1);
    }, this);

    this.setState({func: nfunc});
  },

  submitTerm: function(id, type, tms) {
    var terms = this.state.terms;
    if(typeof terms[id] == 'undefined')
      terms[id] = {minterms: "", dontcares: ""};

    terms[id][type ? 'minterms' : 'dontcares'] = tms;
  },

  addFunction: function() {
    var nfunc = this.state.func;
    var len = this.state.flength;
    if(typeof nfunc == 'undefined')
      nfunc = [];
    if(typeof len == 'undefined')
      len = 0;

    if(typeof this.state.terms == 'undefined')
      this.setState({terms: {}});

    len++;

    nfunc.push(<Function key={len} id={len} remove={this.removeFunction} submit={this.submitTerm} />);

    this.setState({func: nfunc, flength: len});
  },

  render: function() {
    return (
      <div>
        Bits: <input type="text" ref="bits" placeholder="A,B,C" className="form-control" />
        <br />
        <button type="button" className="btn btn-default btn-xs" onClick={this.addFunction}>Aggiungi Funzione</button>
        <div>
          {this.state.func}
        </div>
        <br />
        <button onClick={this.run} type="button" className="btn btn-primary btn-block">Calcola</button>
        <br />
        <div>
          Risultato:
          {this.state.res.map((r) => (
            <div>{r}</div>
          ))}
        </div>
      </div>
    );
  },

  run: function() {
    var bits = this.refs.bits.value.split(',');
    var nbits = bits.length;
    var max = Math.pow(2, nbits)-1;
    var error = 1;

    if(nbits < 3) {
      this.setState({res: ["Devi inserire almeno 3 bit"]});
      return;
    }
    global.bits = nbits;

    var functions = [];
    var a = this;
    var mts = 0;
    var dcs = 0;

    this.state.func.forEach(function(fun) {
      var f = new qms.Function("F" + fun.props.id);

      a.state.terms[fun.props.id]['minterms'].split(',').forEach(function(mt) {
        if(mt>max)
          error *= 2;

        if(mt<0)
          error *= 5;
          
        if(isNaN(mt))
          error *= 11;

        f.addMinterms([new qms.MinTerm(mt)]);
        mts++;
      });

      if(typeof a.state.terms[fun.props.id]['dontcares'] != undefined)
        a.state.terms[fun.props.id]['dontcares'].split(',').forEach(function(dc) {
          if(dc === "")
            return;
            
          if(dc>max)
            error *= 3;

          if(dc<0)
            error *= 7;

          if(isNaN(dc))
            error *= 13;
          
          f.addDontcares([new qms.DontCare(dc)]);
          dcs++;
        });

      functions.push(f);
    });

    var err_string = [];
    if(error%2 == 0)
      err_string.push("Minterm in overflow");
    if(error%3 == 0)
      err_string.push("Dontcare in overflow");
    if(error%5 == 0)
      err_string.push("Minterm in underflow");
    if(error%7 == 0)
      err_string.push("Dontcare in underflow");
    if(error%11 == 0)
      err_string.push("Minterms not valid");
    if(error%13 == 0)
      err_string.push("Dontcares not valid");

    if(err_string.length > 0) {
      this.setState({res: err_string});
      return;
    }

    var start = new Date();
    var program = new qms.QM(nbits, bits);

    program.functions = functions;

    program.parseFunctions();
    program.expansion();
    program.coverage();
    var exp = program.expression();

    var end = new Date();

    global.ga.trackEvent({
        category: 'software/QuineMcCluskey',
        action: 'Runned',
        label: 'B: '+nbits+' - F: '+this.state.func.length+' - MTS: '+mts+' - DCS: '+dcs,
        value: new Date()-start
    });

    this.setState({res: exp.split("\n")});
  }
});

module.exports = QM;