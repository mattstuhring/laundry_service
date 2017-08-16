import React from 'react';
import ReactDOM from 'react-dom';
import Routes from 'Routes';

// Be sure to include styles at some point, probably during your bootstrapping
require('style!css!react-select/dist/react-select.css');

// react-dropzone-component CSS
require('style!css!react-dropzone-component/styles/filepicker.css'); require('style!css!dropzone/dist/min/dropzone.min.css');

// Load Bootstrap
require('style!css!bootstrap/dist/css/bootstrap.min.css');

// Load Font Awesome
require('style!css!font-awesome/css/font-awesome.css');

// App scss
require('style!css!sass!applicationStyles');


ReactDOM.render(
  <Routes />,
  document.getElementById('app')
);
