// @flow

import React from 'react';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import { bindActionCreators, compose } from 'redux';
import Container from 'reactstrap/lib/Container';
import Button from 'reactstrap/lib/Button';
import Header from '../components/header/Header';
import * as userAuthActions from '../redux/modules/userAuth';

// #region types
type Props = {
  // userAuth:
  isAuthenticated: boolean,
  disconnectUser: () => any,
};
// #endregion

function Page1({  }: Props) {
  const { push } = useRouter();

  // #region callbacks
  const goBackHome = (event: SyntheticEvent<>): void => {
    event && event.preventDefault();
    push('/');
  };
  // #endregion

  return (
    <div>
      <Header />
      <Container>
        <h2>Page1 here</h2>
        <Button color="primary" onClick={goBackHome}>
          go back home
        </Button>
      </Container>
    </div>
  );
}

// #region statics
Page1.displayName = 'Page1';
// #endregion

// #region redux
const mapStateToProps = (state: any) => ({
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

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(Page1);
