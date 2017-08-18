import React from 'react';
import { browserHistory } from 'react-router';
import axios from 'axios';
import $ from 'jQuery';
import { Link, IndexLink } from 'react-router';
import { Button } from 'react-bootstrap';

// Show and hide menu bar
// $(document).ready(function() {
//   'use strict';
//
//   var lastScroll = 0;
//   $(window).scroll(function(event){
//       //Sets the current scroll position
//       var st = $(this).scrollTop();
//       //Determines up-or-down scrolling
//       if (st > lastScroll){
//         $('.navbar').css({
//           'margin-top': '-100px',
//           'opacity': '0',
//           'transition': 'all 1s',
//           '-webkit-transition': 'all 1s',
//           '-o-transition': 'all 1s',
//           '-moz-transition': 'all 1s'
//         });
//
//         $('.navbar-default').css({
//           'background-color': 'rgba(59, 59, 59, 0)',
//           'transition': 'all 1s',
//           '-webkit-transition': 'all 1s',
//           '-o-transition': 'all 1s',
//           '-moz-transition': 'all 1s'
//         });
//       }
//       else {
//         $('.navbar').css({
//           'margin-top': '0px',
//           'opacity': '1',
//           'transition': 'all 1s',
//           '-webkit-transition': 'all 1s',
//           '-o-transition': 'all 1s',
//           '-moz-transition': 'all 1s'
//         });
//
//         $('.navbar-default').css({
//           'background-color': 'rgba(59, 59, 59, 0.7)',
//           'border-color': '#444',
//           'transition': 'all 1s',
//           '-webkit-transition': 'all 1s',
//           '-o-transition': 'all 1s',
//           '-moz-transition': 'all 1s'
//         });
//       }
//       //Updates scroll position
//       lastScroll = st;
//   });
// });


export default class Navigation extends React.Component {
  constructor(props) {
    super(props)

    this.handleLogOut = this.handleLogOut.bind(this);
  }

  handleLogOut() {
    axios.delete('api/token')
      .then(() => {
        browserHistory.push('/');
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    const loggedIn = () => {
      if (document.cookie === 'loggedIn=true') {
        return <li>
            <a href="#" onClick={() => {this.handleLogOut()}}>Log Out</a>
        </li>;
      }
    }

    return (
      <div className="top-nav">
        <nav className="navbar navbar-default navbar-fixed-top">
          <div className="container">
            <div className="navbar-header">
              <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar-collapse-1" aria-expanded="false">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
            </div>

            <div className="collapse navbar-collapse" id="navbar-collapse-1">
              <ul className="nav navbar-nav">
                <li>
                  <IndexLink to="/" activeClassName="active-link">HOME</IndexLink>
                </li>
              </ul>

              <ul className="nav navbar-nav navbar-right">

                {loggedIn()}

                <li>
                  <Link to="/" activeClassName="active-link"><span className="glyphicon glyphicon-cog" aria-hidden="true"></span></Link>
                </li>
              </ul>

            </div>
          </div>
        </nav>
      </div>
    );
  }
}
