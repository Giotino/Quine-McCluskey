const React = require('react');
const ReactDOM = require('react-dom');

const QM = require('./qm.jsx');

const GoogleAnalytics = require('ga');

var ua = "UA-85784798-2";
var host = 'uni.giotino.com';

global.ga = new GoogleAnalytics(ua, host);
document.addEventListener("deviceready", function() {
  global.ga.trackPage('software/QuineMcCluskey/' + device.platform);
}, false);


ReactDOM.render(
  <QM />,
  document.getElementById('container')
);