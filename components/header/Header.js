// @flow

// #region imports
import React, { useState } from 'react';
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
import * as userAuthActions from '../../redux/modules/userAuth';
// #endregion

// #region flow types
type Props = {
  // userAuth:
  isAuthenticated: boolean,
  disconnectUser: (...any) => any,
  ...any,
};
// #endregion

function Header({ isAuthenticated, disconnectUser }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const navigateTo = (to: string = '/') => () => Router.push(to);
  const handlesDisconnectUser = (event?: SyntheticEvent<>) => {
    event && event.preventDefault();
    disconnectUser();
    Router.replace('/login');
  };

  return (
    <>
      <Navbar color="light" light expand="md">
        <NavbarBrand href="/">react-redux-next-bootstrap starter</NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <NavLink href="#" onClick={navigateTo('/page1')}>
                Page1
              </NavLink>
            </NavItem>

            <NavItem>
              <NavLink href="#" onClick={navigateTo('/private1')}>
                Private1
              </NavLink>
            </NavItem>

            {isAuthenticated ? (
              <NavItem>
                <NavLink href="#" onClick={handlesDisconnectUser}>
                  <i className="fa fa-sign-out" aria-hidden="true" />
                </NavLink>
              </NavItem>
            ) : (
              <NavItem>
                <NavLink href="#" onClick={navigateTo('/login')}>
                  <i className="fa fa-sign-in" aria-hidden="true" />
                </NavLink>
              </NavItem>
            )}
          </Nav>
        </Collapse>
      </Navbar>
    </>
  );
}

Header.defaultProps = {
  isAuthenticated: false,
  disconnectUser: () => {},
};

Header.displayName = 'Header';

// #region redux state and dispatch map to props
const mapStateToProps = (state: any) => ({
  // userAuth:
  isAuthenticated: state.userAuth.isAuthenticated,
});

const mapDispatchToProps = (dispatch: (...any) => any) => {
  return {
    ...bindActionCreators(
      {
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
