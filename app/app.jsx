import React from 'react';
import ReactDOM from 'react-dom';
import Routes from 'Routes';

// React-Select
require('style!css!react-select/dist/react-select.css');

// React-Dropzone-Component
require('style!css!react-dropzone-component/styles/filepicker.css'); require('style!css!dropzone/dist/min/dropzone.min.css');

// Bootstrap
require('style!css!bootstrap/dist/css/bootstrap.min.css');

// Font Awesome
require('style!css!font-awesome/css/font-awesome.css');

// React-Toast
require('style!css!react-toastify/dist/ReactToastify.min.css');

// App SCSS
require('style!css!sass!applicationStyles');


ReactDOM.render(
  <Routes />,
  document.getElementById('app')
);
