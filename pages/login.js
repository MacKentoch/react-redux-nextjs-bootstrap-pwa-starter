// @flow
/* eslint-disable quotes */

// #region imports
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import compose from 'recompose/compose';
import * as userAuthActions from '../redux/modules/userAuth';
import Router from 'next/router';
import Container from 'reactstrap/lib/Container';
import Button from 'reactstrap/lib/Button';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import Alert from 'reactstrap/lib/Alert';
import auth from '../services/auth';
// #endregion

// #region flow types
type Props = {
  // withRouter HOC:
  router: {
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
  browserStorageSupported?: boolean,
};
// #endregion

class Login extends PureComponent<Props, State> {
  static async getInitialProps({ pathname, query }) {
    return { pathname, query };
  }

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
      <div>
        <Container fluid>
          <Row>
            <Col md={{ size: 4, offset: 4 }} xs={{ size: 10, offset: 1 }}>
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
                      <Col lg={{ size: 10, offset: 0 }}>
                        <input
                          type="text"
                          className="form-control"
                          id="inputEmail"
                          placeholder="Email"
                          value={email}
                          onChange={this.handlesOnEmailChange}
                          // onInput={this.handlesOnEmailChange} // browser autofill would not fire onChange
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
                          onChange={this.handlesOnPasswordChange}
                          // onInput={this.handlesOnPasswordChange} // browser autofill would not fire onChange
                        />
                      </Col>
                    </div>

                    <div className="form-group">
                      <Col lg={{ size: 10, offset: 0 }}>
                        <Button
                          className="login-button btn-block"
                          color="primary"
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

                    {browserStorageSupported && (
                      <div className="form-group">
                        <Col lg={{ size: 10, offset: 0 }}>
                          <div className="pull-right">
                            <Button color="warning" onClick={this.goHome}>
                              back to home
                            </Button>
                          </div>
                        </Col>
                      </div>
                    )}
                  </fieldset>
                </form>
              ) : (
                <Alert color="danger" toggle={this.handleAlertDismiss}>
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
                    <Button color="primary" onClick={this.handleAlertDismiss}>
                      Back to Home
                    </Button>
                  </p>
                </Alert>
              )}
            </Col>
          </Row>
        </Container>
        <Styles />
      </div>
    );
  }
  // #endregion

  // #region storage not supported methods
  setBrowserStorageSupportedState = browserStorageSupported =>
    this.setState({ browserStorageSupported });

  handleAlertDismiss = (event: SyntheticEvent<>) => {
    event && event.preventDefault();
    Router.replace('/');
  };
  // #endregion

  // #region input change methods
  handlesOnEmailChange = (event: SyntheticEvent<>) => {
    if (event) {
      event.preventDefault();
      // should add some validator before setState in real use cases
      // $FlowIgnore
      const email = event.target.value.trim();
      this.setState({ email });
    }
  };

  handlesOnPasswordChange = (event: SyntheticEvent<>) => {
    if (event) {
      event.preventDefault();
      // should add some validator before setState in real use cases
      // $FlowIgnore
      const password = event.target.value.trim();
      this.setState({ password });
    }
  };
  // #endregion

  // #region on login click
  handlesOnLogin = async (event: SyntheticEvent<>) => {
    event && event.preventDefault();

    const { logUserIfNeeded, query } = this.props;
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
      if (query && query.from) {
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
    event && event.preventDefault();
    Router.push({ pathname: '/' });
  };
  // #endregion
}

// #region styles
function Styles() {
  return (
    <div>
      <style jsx={true}>
        {`
          .content {
            margin-top: 70px;
            padding-top: 40px;
          }
        `}
      </style>
    </div>
  );
}
// #endregion

// #region redux state and dispatch map to props
const mapStateToProps = (state: any) => ({
  isAuthenticated: state.userAuth.isAuthenticated,
  isFetching: state.userAuth.isFetching,
  isLogging: state.userAuth.isLogging,
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
)(Login);
