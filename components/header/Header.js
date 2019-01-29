// @flow

// #region imports
import React from 'react';
import Router from 'next/router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap';
// import Navbar from 'react-bootstrap/lib/Navbar';
// import Nav from 'react-bootstrap/lib/Nav';
// import NavItem from 'react-bootstrap/lib/NavItem';
import * as userAuthActions from '../../redux/modules/userAuth';
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

  state = {
    isOpen: false,
  };

  // #region component lifecycle methods
  render() {
    const { isAuthenticated } = this.props;
    const { isOpen } = this.state;

    return (
      <Navbar color="light" light expand="md">
        <NavbarBrand href="/">react-redux-next-bootstrap starter</NavbarBrand>
        <NavbarToggler onClick={this.toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <NavLink href="#" onClick={this.navigateTo('/page1')}>
                Page1
              </NavLink>
            </NavItem>

            <NavItem>
              <NavLink href="#" onClick={this.navigateTo('/private1')}>
                Private1
              </NavLink>
            </NavItem>

            {isAuthenticated ? (
              <NavItem>
                <NavLink href="#" onClick={this.HandlesDisconnectUser}>
                  <i className="fa fa-sign-out" aria-hidden="true" />
                </NavLink>
              </NavItem>
            ) : (
              <NavItem>
                <NavLink href="#" onClick={this.navigateTo('/login')}>
                  <i className="fa fa-sign-in" aria-hidden="true" />
                </NavLink>
              </NavItem>
            )}
          </Nav>
        </Collapse>
      </Navbar>
    );
  }
  // #endregion

  // #region navigation bar toggle
  toggle = (evt: SyntheticEvent<>) => {
    if (evt) {
      evt.preventDefault();
    }
    this.setState(({ isOpen: prevIsOpened }) => ({ isOpen: !prevIsOpened }));
  };
  // #endregion

  // #region handlesNavItemClick event
  handlesNavItemClick = (link: string = '/') => (evt: SyntheticEvent<>) => {
    if (evt) {
      evt.preventDefault();
    }
    const { history } = this.props;
    history.push(link);
  };
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
