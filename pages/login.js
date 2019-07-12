// @flow

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { connect } from 'react-redux';
import Head from 'next/head';
import { bindActionCreators, compose } from 'redux';
import styled from 'styled-components';
import Container from 'reactstrap/lib/Container';
import Button from 'reactstrap/lib/Button';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import Alert from 'reactstrap/lib/Alert';
import * as userAuthActions from '../redux/modules/userAuth';
import auth from '../utils/auth';
import appConfig from '../config/appConfig';

// #region flow types
type Props = {
  // userAuth:
  isAuthenticated: boolean,
  isFetching: boolean,
  isLogging: boolean,
  disconnectUser: () => string,
  logUserIfNeeded: (user: string) => any,
};
// #endregion

// #region contants
const storageSupported =
  (typeof window !== 'undefined' &&
    auth.supportsLocalStorage() &&
    auth.supportsSessionStorage()) ||
  false;

const {
  og: { description: ogDescription, locale: ogLang },
  seo: { description: seoDescription },
} = appConfig.metas;
// #endregion

// #region styled components
const Page = styled.div`
  margin-top: 70px;
  padding-top: 40px;
`;
// #endregion

export function LoginPage({
  isFetching = false,
  isLogging = false,
  disconnectUser,
  logUserIfNeeded,
}: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [browserStorageSupported] = useState(storageSupported);
  const { replace, push, query } = useRouter();

  // #region on mount
  useEffect(() => {
    if (!browserStorageSupported) {
      disconnectUser();
    }
  }, []);
  // #endregion

  // #region callback
  const handleAlertDismiss = useCallback((event: SyntheticEvent<>) => {
    event && event.preventDefault();
    replace('/');
  }, []);

  const handlesOnEmailChange = useCallback((event: SyntheticEvent<>) => {
    if (event) {
      event.preventDefault();
      // should add some validator before setState in real use cases
      // $FlowIgnore
      setEmail(event.target.value.trim());
    }
  }, []);

  const handlesOnPasswordChange = useCallback((event: SyntheticEvent<>) => {
    if (event) {
      event.preventDefault();
      // should add some validator before setState in real use cases
      // $FlowIgnore
      setPassword(event.target.value.trim());
    }
  }, []);

  const handlesOnLogin = useCallback(
    async (event: SyntheticEvent<>) => {
      event && event.preventDefault();

      const userLogin = {
        login: email,
        password: password,
      };

      try {
        const response = await logUserIfNeeded(userLogin);
        const {
          data: { token, user },
        } = response.payload;

        auth.setToken(token);
        auth.setUserInfo(user);

        // test if we were redirected to login from a private page, redirect back to where we were:
        if (query && query.from) {
          return push({ pathname: query.from }); // back to Home
        }

        // redirect to home otherwise:
        push({ pathname: '/' }); // back to Home
      } catch (error) {
        /* eslint-disable no-console */
        console.error('login went wrong..., error: ', error);
        /* eslint-enable no-console */
      }
    },
    [email, password],
  );

  const goHome = (event: SyntheticEvent<>) => {
    event && event.preventDefault();
    push({ pathname: '/' });
  };
  // #endregion

  return (
    <Page>
      <Head>
        <title>Login page</title>
        <meta name="description" content={seoDescription} />
        <meta property="og:description" content={ogDescription} />
        <meta property="og:locale" content={ogLang} />
      </Head>
      <Container fluid>
        <Row>
          <Col md={{ size: 4, offset: 4 }} xs={{ size: 10, offset: 1 }}>
            {browserStorageSupported ? (
              <form className="form-horizontal" noValidate>
                <fieldset>
                  <legend>Page</legend>

                  <div className="form-group">
                    <label
                      htmlFor="inputEmail"
                      className="col-lg-2 control-label"
                    >
                      Email
                    </label>
                    <Col lg={{ size: 10, offset: 0 }}>
                      <input
                        type="text"
                        className="form-control"
                        id="inputEmail"
                        placeholder="Email"
                        value={email}
                        onChange={handlesOnEmailChange}
                      />
                    </Col>
                  </div>

                  <div className="form-group">
                    <label
                      htmlFor="inputPassword"
                      className="col-lg-2 control-label"
                    >
                      Password
                    </label>
                    <Col lg={{ size: 10, offset: 0 }}>
                      <input
                        type="password"
                        className="form-control"
                        id="inputPassword"
                        placeholder="Password"
                        value={password}
                        onChange={handlesOnPasswordChange}
                      />
                    </Col>
                  </div>

                  <div className="form-group">
                    <Col lg={{ size: 10, offset: 0 }}>
                      <Button
                        className="Page-button btn-block"
                        color="primary"
                        disabled={isLogging}
                        onClick={handlesOnLogin}
                      >
                        {isLogging ? (
                          <span>
                            Page in... &nbsp;
                            <i className="fa fa-spinner fa-pulse fa-fw" />
                          </span>
                        ) : (
                          <span>Login</span>
                        )}
                      </Button>
                    </Col>
                  </div>

                  {browserStorageSupported && (
                    <div className="form-group">
                      <Col lg={{ size: 10, offset: 0 }}>
                        <div className="pull-right">
                          <Button color="warning" onClick={goHome}>
                            back to home
                          </Button>
                        </div>
                      </Col>
                    </div>
                  )}
                </fieldset>
              </form>
            ) : (
              <Alert color="danger" toggle={handleAlertDismiss}>
                <h4>
                  <i
                    className="fa fa-exclamation-triangle"
                    aria-hidden="true"
                  />{' '}
                  &nbsp; Cookies are disabled on your browser!
                </h4>
                <br />
                <p>
                  Cookies are necessary to ensure application delivers the best
                  experience and security.
                </p>
                <p>
                  {
                    "You can't signin or signout this application until you enable cookie in your navigator."
                  }
                </p>
                <br />
                <p>
                  <Button color="primary" onClick={handleAlertDismiss}>
                    Back to Home
                  </Button>
                </p>
              </Alert>
            )}
          </Col>
        </Row>
      </Container>
    </Page>
  );
}

// #region statics
LoginPage.displayName = 'LoginPage';
// #nedregion

// #region redux
const mapStateToProps = state => ({
  isAuthenticated: state.userAuth.isAuthenticated,
  isFetching: state.userAuth.isFetching,
  isLogging: state.userAuth.isLogging,
});

const mapDispatchToProps = dispatch => {
  return {
    ...bindActionCreators({ ...userAuthActions }, dispatch),
  };
};
// #endregion

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(LoginPage);
