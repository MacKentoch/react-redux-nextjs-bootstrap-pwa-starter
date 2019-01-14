// @flow

// #region imports
import React from 'react';
import Router from 'next/router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as userAuthActions from '../../redux/modules/userAuth';
import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import { PureComponent } from 'react';
// #endregion

// #region flow types
type Props = {
  // userAuth:
  isAuthenticated: boolean,
  disconnectUser: (...any) => any,

  ...any,
};

type State = any;
// #endregion

class Header extends PureComponent<Props, State> {
  // #region default props
  static defaultProps = {
    isAuthenticated: false,
  };

  // #region component lifecycle methods
  render() {
    const { isAuthenticated } = this.props;

    return (
      <Navbar inverse collapseOnSelect fluid>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="#">react-redux-next-bootstrap starter</a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav pullRight>
            <NavItem eventKey={1} href="#" onClick={this.navigateTo('/page1')}>
              Page1
            </NavItem>

            <NavItem
              eventKey={2}
              href="#"
              onClick={this.navigateTo('/private1')}
            >
              Private1
            </NavItem>
            {isAuthenticated ? (
              <NavItem
                eventKey={3}
                href="#"
                onClick={this.HandlesDisconnectUser}
              >
                <i className="fa fa-sign-out" aria-hidden="true" />
              </NavItem>
            ) : (
              <NavItem
                eventKey={3}
                href="#"
                onClick={this.navigateTo('/login')}
              >
                <i className="fa fa-sign-in" aria-hidden="true" />
              </NavItem>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
  // #endregion

  // #region navigate
  navigateTo = (to: string = '/') => () => {
    Router.push(to);
  };
  // #endregion

  // #region on disconnect click
  HandlesDisconnectUser = (event: SyntheticEvent<>) => {
    if (event) {
      event.preventDefault();
    }

    const { disconnectUser } = this.props;

    disconnectUser();
    Router.replace('/login');
  };
  // #endregion
}

// #region redux state and dispatch map to props
const mapStateToProps = (state: any) => ({
  // userAuth:
  isAuthenticated: state.userAuth.isAuthenticated,
});

const mapDispatchToProps = (dispatch: (...any) => any) => {
  return {
    ...bindActionCreators(
      {
        // userAuth:
        ...userAuthActions,
      },
      dispatch,
    ),
  };
};
// #endregion

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Header);
