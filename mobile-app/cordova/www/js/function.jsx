const React = require('react');
const ReactDOM = require('react-dom');

var Function = React.createClass({
  getInitialState: function(){
    return {};
  },

  onChange: function (name, e) {
    this.props.submit(this.props.id, name == "mts", e.target.value);
  },

  remove: function() {
    this.props.remove(this.props.id);
  },

  render: function() {
    var name = 'F' + this.props.id;
    return (
      <div className="panel panel-default" id="function" style={{padding: '0.5em', margin: '0.5em', display: 'table'}}>
        <div id="name" dangerouslySetInnerHTML={{__html: name}}  style={{display: 'inline-block', marginLeft: '1em', marginRight: '1em'}}></div><a href="#" onClick={this.remove}>Rimuovi</a><br />
        <div style={{display: 'inline-block'}}>MinTerm:<input type="text" className="form-control"  value={this.mts} onChange={this.onChange.bind(this, "mts")} placeholder="1,2,3" /></div>&nbsp;&nbsp;
        <div style={{display: 'inline-block'}}>DontCare:<input type="text" className="form-control" value={this.dcs} onChange={this.onChange.bind(this, "dcs")} placeholder="4,5,6" /></div>
      </div>
    );
  }
});

module.exports = Function;