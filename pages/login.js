// @flow
/* eslint-disable quotes */

// #region imports
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import compose from 'recompose/compose';
import * as userAuthActions from '../redux/modules/userAuth';
import Router from 'next/router';
import Layout from '../components/layout/Layout';
import Button from 'react-bootstrap/lib/Button';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Alert from 'react-bootstrap/lib/Alert';
import auth from '../services/auth';
// #endregion

// #region flow types
type Props = {
  // next/route:
  url: {
    // query.from sent by Private component when user auth failed
    query?: {
      from?: string,
    },
  },

  // userAuth:
  isAuthenticated: boolean,
  isFetching: boolean,
  isLogging: boolean,
  disconnectUser: () => string,
  logUserIfNeeded: (user: string) => any,

  ...any,
};

type State = {
  email: string,
  password: string,
};
// #endregion

class Login extends PureComponent<Props, State> {
  // #region default PropTypes
  static defaultProps = {
    isFetching: false,
    isLogging: false,
  };
  // #endregion

  // #region state initialization
  state = {
    email: '',
    password: '',
    browserStorageSupported: false,
  };
  // #endregion

  // #region component lifecycle methods
  componentDidMount() {
    const { disconnectUser } = this.props;
    const browserStorageSupported =
      auth.supportsLocalStorage() && auth.supportsSessionStorage();

    this.setBrowserStorageSupportedState(browserStorageSupported);

    if (browserStorageSupported) {
      disconnectUser(); // diconnect user: remove token and user info
    }
  }

  render() {
    const { email, password, browserStorageSupported } = this.state;

    const { isLogging } = this.props;

    return (
      <Layout>
        <style jsx>
          {`
            .content {
              margin-top: 70px;
              padding-top: 40px;
            }
          `}
        </style>
        <div className="content">
          <Row>
            <Col md={4} mdOffset={4} xs={10} xsOffset={1}>
              {browserStorageSupported ? (
                <form className="form-horizontal" noValidate>
                  <fieldset>
                    <legend>Login</legend>

                    <div className="form-group">
                      <label
                        htmlFor="inputEmail"
                        className="col-lg-2 control-label"
                      >
                        Email
                      </label>
                      <div className="col-lg-10">
                        <input
                          type="text"
                          className="form-control"
                          id="inputEmail"
                          placeholder="Email"
                          value={email}
                          // onChange={this.handlesOnEmailChange}
                          onInput={this.handlesOnEmailChange} // browser autofill would not fire onChange
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label
                        htmlFor="inputPassword"
                        className="col-lg-2 control-label"
                      >
                        Password
                      </label>
                      <div className="col-lg-10">
                        <input
                          type="password"
                          className="form-control"
                          id="inputPassword"
                          placeholder="Password"
                          // onChange={this.handlesOnPasswordChange}
                          onInput={this.handlesOnPasswordChange} // browser autofill would not fire onChange
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <Col lg={10} lgOffset={2}>
                        <Button
                          className="login-button btn-block"
                          bsStyle="primary"
                          disabled={isLogging}
                          onClick={this.handlesOnLogin}
                        >
                          {isLogging ? (
                            <span>
                              login in... &nbsp;
                              <i className="fa fa-spinner fa-pulse fa-fw" />
                            </span>
                          ) : (
                            <span>Login</span>
                          )}
                        </Button>
                      </Col>
                    </div>
                  </fieldset>
                </form>
              ) : (
                <Alert bsStyle="danger" onDismiss={this.handleAlertDismiss}>
                  <h4>
                    <i
                      className="fa fa-exclamation-triangle"
                      aria-hidden="true"
                    />{' '}
                    &nbsp; Cookies are disabled on your browser!
                  </h4>
                  <br />
                  <p>
                    Cookies are necessary to ensure application delivers the
                    best experience and security.
                  </p>
                  <p>
                    {`You can't signin or signout this application until you enable cookie in your navigator.`}
                  </p>
                  <br />
                  <p>
                    <Button bsStyle="primary" onClick={this.handleAlertDismiss}>
                      Back to Home
                    </Button>
                  </p>
                </Alert>
              )}
            </Col>
          </Row>
          {browserStorageSupported && (
            <Row>
              <Col md={4} mdOffset={4} xs={10} xsOffset={1}>
                <div className="pull-right">
                  <Button bsStyle="warning" onClick={this.goHome}>
                    back to home
                  </Button>
                </div>
              </Col>
            </Row>
          )}
        </div>
      </Layout>
    );
  }
  // #endregion

  // #region storage not supported methods
  setBrowserStorageSupportedState = browserStorageSupported =>
    this.setState({ browserStorageSupported });

  handleAlertDismiss = (event: SyntheticEvent<>) => {
    if (event) {
      event.preventDefault();
    }

    Router.replace('/');
  };
  // #endregion

  // #region input change methods
  handlesOnEmailChange = (event: SyntheticEvent<>) => {
    if (event) {
      event.preventDefault();
      // should add some validator before setState in real use cases
      this.setState({ email: event.target.value.trim() });
    }
  };

  handlesOnPasswordChange = (event: SyntheticEvent<>) => {
    if (event) {
      event.preventDefault();
      // should add some validator before setState in real use cases
      this.setState({ password: event.target.value.trim() });
    }
  };
  // #endregion

  // #region on login click
  handlesOnLogin = async (event: SyntheticEvent<>) => {
    if (event) {
      event.preventDefault();
    }

    const {
      logUserIfNeeded,
      url: { query },
    } = this.props;

    const { email, password } = this.state;

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
      if (query.from) {
        return Router.push({ pathname: query.from }); // back to Home
      }

      // redirect to home otherwise:
      Router.push({ pathname: '/' }); // back to Home
    } catch (error) {
      /* eslint-disable no-console */
      console.error('login went wrong..., error: ', error);
      /* eslint-enable no-console */
    }
  };
  // #endregion

  // #region on go back home click
  goHome = (event: SyntheticEvent<>) => {
    if (event) {
      event.preventDefault();
    }

    Router.push({ pathname: '/' });
  };
  // #endregion
}

// #region redux state and dispatch map to props
const mapStateToProps = (state: any) => ({
  // userAuth:
  isAuthenticated: state.userAuth.isAuthenticated,
  isFetching: state.userAuth.isFetching,
  isLogging: state.userAuth.isLogging,
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

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(Login);
