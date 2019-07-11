// @flow

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/router';
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

// #region types
type Props = {
  // userAuth:
  isAuthenticated: boolean,
  disconnectUser: (...any) => any,
};
// #endregion

function Header({ isAuthenticated, disconnectUser }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const { push, replace } = useRouter();

  // #region callbacks
  const toggle = useCallback(() => setIsOpen(!isOpen), [isOpen]);

  const navigateTo = useCallback((to: string = '/') => () => push(to), []);

  const handlesDisconnectUser = useCallback((event?: SyntheticEvent<>) => {
    event && event.preventDefault();
    disconnectUser();
    replace('/login');
  }, []);
  // #endregion

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

// #region statics
Header.defaultProps = {
  isAuthenticated: false,
  disconnectUser: () => {},
};

Header.displayName = 'Header';
// #endregion

// #region redux
const mapStateToProps = state => ({
  isAuthenticated: state.userAuth.isAuthenticated,
});

const mapDispatchToProps = dispatch => {
  return {
    ...bindActionCreators({ ...userAuthActions }, dispatch),
  };
};
// #endregion

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Header);
