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

$(document).ready(function() {
  'use strict';

  $(document).on('click.nav','.navbar-collapse.in',function(e) {
    'use strict';
    e.preventDefault();

    if( $(e.target).is('a') && $(e.target).attr('class') != 'dropdown-toggle' ) {
      $(this).removeClass('in').addClass('collapse');
    } else if ( $(e.target).is('i.fa-users')) {
      $(this).removeClass('in').addClass('collapse');
    }
  });
});


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

  // **************************  RENDER  *******************************
  render() {

    const loggedIn = () => {
      let navLinks;
      let profile;

      if (localStorage) {
        const user = JSON.parse( localStorage.getItem( 'user' ) );
        const userAccess = user.access;

        if (userAccess === 'admin') {
          profile = '/adminContainer';
          navLinks = (
            <div className="collapse navbar-collapse" id="navbar-collapse-1">
              <ul className="nav navbar-nav navbar-right">
                <li>
                  <Link to="/adminOrders" activeClassName="active-link"><i className="fa fa-id-card-o fa-2x" aria-hidden="true"></i></Link>
                </li>
                <li>
                  <Link to="/adminUsers" activeClassName="active-link"><i className="fa fa-users fa-2x" aria-hidden="true"></i></Link>
                </li>
                <li className="dropdown">
                  <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><i className="fa fa-cog fa-2x" aria-hidden="true"></i></a>
                  <ul className="dropdown-menu">
                    <li>
                      <a href="#" onClick={() => {this.handleLogOut()}}>LOG OUT</a>
                    </li>
                    <li>
                      <IndexLink to="/faq" activeClassName="active-link">FAQ</IndexLink>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          );
        } else if (userAccess === 'employee') {
          profile = '/employeeProfile';
          navLinks = (
            <div className="collapse navbar-collapse" id="navbar-collapse-1">
              <ul className="nav navbar-nav navbar-right">
                <li>
                  <Link to="/employeeProfile" activeClassName="active-link"><i className="fa fa-user-circle-o fa-2x" aria-hidden="true"></i></Link>
                </li>
                <li className="dropdown">
                  <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><i className="fa fa-cog fa-2x" aria-hidden="true"></i></a>
                  <ul className="dropdown-menu">
                    <li>
                      <a href="#" onClick={() => {this.handleLogOut()}}>LOG OUT</a>
                    </li>
                    <li>
                      <IndexLink to="/faq" activeClassName="active-link">FAQ</IndexLink>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          );
        } else if (userAccess === 'customer') {
          profile = '/customerProfile';
          navLinks = (
            <div className="collapse navbar-collapse" id="navbar-collapse-1">
              <ul className="nav navbar-nav navbar-right">
                <li>
                  <Link to="/customerProfile" activeClassName="active-link"><i className="fa fa-user-o fa-2x" aria-hidden="true"></i></Link>
                </li>
                <li className="dropdown">
                  <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><i className="fa fa-cog fa-2x" aria-hidden="true"></i></a>
                  <ul className="dropdown-menu">
                    <li>
                      <a href="#" onClick={() => {this.handleLogOut()}}>LOG OUT</a>
                    </li>
                    <li>
                      <IndexLink to="/faq" activeClassName="active-link">FAQ</IndexLink>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          );
        } else {
          profile = '/';
          navLinks = (
            <div className="collapse navbar-collapse" id="navbar-collapse-1">
              <ul className="nav navbar-nav navbar-right">
                <li>
                  <IndexLink to="/faq" activeClassName="active-link">FAQ</IndexLink>
                </li>
              </ul>
            </div>
          );

          return (
            <div>
              <div className="navbar-header">
                <div className="navbar-brand" href="#">
                  <span className="logo-img">
                    <Link to={profile}>
                      <img alt="Laundry" src="images/logo.svg"/>
                    </Link>
                  </span>
                  <span className="company-img">
                    <Link to={profile}>
                      <img alt="Laundry" src="images/company.svg"/>
                    </Link>
                  </span>
                </div>
                <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar-collapse-1" aria-expanded="false">
                  <span className="sr-only">Toggle navigation</span>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                </button>
              </div>

              {navLinks}
            </div>
          );
        }

      } else {
        profile = '/';

        return (
          <div>
            <div className="navbar-header">
              <div className="navbar-brand" href="#">
                <span className="logo-img">
                  <Link to={profile}>
                    <img alt="Laundry" src="images/logo.svg"/>
                  </Link>
                </span>
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
