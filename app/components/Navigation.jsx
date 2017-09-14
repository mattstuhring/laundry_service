import React from 'react';
import { Link, IndexLink, browserHistory } from 'react-router';
import axios from 'axios';
import $ from 'jQuery';
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
        this.props.setToast('You are now logged out!', {type: 'success'});
        browserHistory.push('/');
      })
      .catch((err) => {
        console.log(err);
      });
  }


  render() {
    let profile;
    const loggedIn = () => {
      if (document.cookie) {


        if (document.cookie) {
          const cookie = document.cookie.split(';');
          const status = cookie[0];
          const access = cookie[1].trim();

          if (access === 'access=admin') {
            profile = '/adminProfile';
          } else if (access === 'access=employee') {
            profile = '/employeeProfile';
          } else if (access === 'access=customer') {
            profile = '/customerProfile';
          } else {
            profile = '/';
          }

        }

        return (
          <div>
            <div className="navbar-header">
              <div className="navbar-brand" href="#">
                <Link to={profile}>
                  <img alt="Laundry" src="images/machine.svg"/>
                </Link>
              </div>
              <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar-collapse-1" aria-expanded="false">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
            </div>

            <div className="collapse navbar-collapse" id="navbar-collapse-1">
              <ul className="nav navbar-nav navbar-right">
                <li>
                  <Link to={profile} activeClassName="active-link">PROFILE</Link>
                </li>
                <li>
                  <a href="#" onClick={() => {this.handleLogOut()}}>LOG OUT</a>
                </li>
                <li>
                  <IndexLink to="/faq" activeClassName="active-link">FAQ</IndexLink>
                </li>
                <li>
                  <Link to="/settings" activeClassName="active-link"><span className="glyphicon glyphicon-cog" aria-hidden="true"></span></Link>
                </li>
              </ul>
            </div>
          </div>
        );
      }
      else {
        return (
          <div>
            <div className="navbar-header">
              <div className="navbar-brand" href="#">
                <Link to="/">
                  <img alt="Laundry" src="images/machine.svg"/>
                </Link>
              </div>
              <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar-collapse-1" aria-expanded="false">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
            </div>

            <div className="collapse navbar-collapse" id="navbar-collapse-1">
              <ul className="nav navbar-nav navbar-right">
                <li>
                  <IndexLink to="/faq" activeClassName="active-link">FAQ</IndexLink>
                </li>
              </ul>
            </div>
          </div>
        );
      }
    }

    return (
      <div className="top-nav">
        <nav className="navbar navbar-default navbar-fixed-top">
          <div className="container-fluid">


                {/* NAV ACTION BTNS */}
                {loggedIn()}

          </div>
        </nav>
      </div>
    );
  }
}
