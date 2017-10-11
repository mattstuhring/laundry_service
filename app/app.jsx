import React from 'react';
import ReactDOM from 'react-dom';
import Routes from 'Routes';

// React-Select
require('style!css!react-select/dist/react-select.css');

// Bootstrap
require('style!css!bootstrap/dist/css/bootstrap.min.css');

// Font Awesome
require('style!css!font-awesome/css/font-awesome.min.css');

// React-Toast
require('style!css!react-toastify/dist/ReactToastify.min.css');

// React Bootstrap Table
require('style!css!react-bootstrap-table/dist/react-bootstrap-table-all.min.css');

// App SCSS
require('style!css!sass!applicationStyles');


ReactDOM.render(
  <Routes />,
  document.getElementById('app')
);
