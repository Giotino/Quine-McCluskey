const React = require('react');
const ReactDOM = require('react-dom');

const QM = require('./qm.jsx');

const GoogleAnalytics = require('ga');


ga('send', 'pageview', '/software/QuineMcCluskey');

ReactDOM.render(
  <QM />,
  document.getElementById('container')
);