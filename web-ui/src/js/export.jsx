const React = require('react');
const VHDL = require('../../../vhdl.js');
const downloadjs = require('downloadjs');

class Export extends React.Component {
  constructor(props) {
    super(props);
    this.download= this.download.bind(this);
  }

  download() {
    var v = new VHDL(this.props.bits.length, this.props.nfunc, this.props.blocks, this.props.bits);
    downloadjs(v.run(), "Project.vhd", "text/plain");
  }

  render() {
    return (
      <button onClick={this.download} type="button" className="btn btn-primary btn-block">Esporta in VHDL</button>
    );
  }
}

module.exports = Export;