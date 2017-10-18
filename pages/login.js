// @flow

// #region imports
import { PureComponent }      from 'react';
import { bindActionCreators } from 'redux';
import withRedux              from 'next-redux-wrapper';
import configureStore         from '../redux/store/configureStore';
import * as userAuthActions   from '../redux/modules/userAuth';
import Router                 from 'next/router';
import Layout                 from '../components/layout/Layout';
import Button                 from 'react-bootstrap/lib/Button';
import Row                    from 'react-bootstrap/lib/Row';
import Col                    from 'react-bootstrap/lib/Col';
import auth                   from '../services/auth';
// #endregion

// #region flow types
type Props = {
  // next/route:
  url: {
    // query.from sent by Private component when user auth failed
    query?: {
      from?: string
    }
  },

  // userAuth:
  isAuthenticated: boolean,
  isFetching: boolean,
  isLogging: boolean,
  disconnectUser: () => string,
  logUserIfNeeded: (user: string) => any,

  ...any
};

type State = {
  email: string,
  password: string
}
// #endregion

class Login extends PureComponent<Props, State> {
  // #region default PropTypes
  static defaultProps = {
    isFetching:      false,
    isLogging:       false
  }
  // #endregion

  // #region state initialization
  state = {
    email:    '',
    password: ''
  };
  // #endregion

  // #region component lifeculcle methods
  componentDidMount() {
    const {
      disconnectUser
    } = this.props;

    disconnectUser(); // diconnect user: remove token and user info
  }

  render() {
    const {
      email,
      password
    } = this.state;

    const {
      isLogging
    } = this.props;

    return (
      <Layout>
        <style
          jsx
        >
          {
            `
              .content {
                margin-top: 70px;
                padding-top: 40px;
              }
            `
          }
        </style>
        <div className="content">
          <Row>
            <Col
              md={4}
              mdOffset={4}
              xs={10}
              xsOffset={1}
            >
              <form
                className="form-horizontal"
                noValidate
              >
                <fieldset>
                  <legend>
                    Login
                  </legend>

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
                        onChange={this.handlesOnEmailChange}
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
                        value={password}
                        onChange={this.handlesOnPasswordChange}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <Col
                      lg={10}
                      lgOffset={2}
                    >
                      <Button
                        className="login-button btn-block"
                        bsStyle="primary"
                        disabled={isLogging}
                        onClick={this.handlesOnLogin}
                      >
                        {
                          isLogging
                            ?
                            <span>
                              login in...
                              &nbsp;
                              <i
                                className="fa fa-spinner fa-pulse fa-fw"
                              />
                            </span>
                            :
                            <span>
                              Login
                            </span>
                        }
                      </Button>
                    </Col>
                  </div>
                </fieldset>
              </form>
            </Col>
          </Row>
          <Row>
            <Col
              md={4}
              mdOffset={4}
              xs={10}
              xsOffset={1}
            >
              <Button
                bsStyle="primary"
                onClick={this.goHome}
              >
                back to home
              </Button>
            </Col>
          </Row>
        </div>
      </Layout>
    );
  }
  // #endregion

  // #region input change methods
  handlesOnEmailChange = (event: SyntheticEvent<>) => {
    if (event) {
      event.preventDefault();
      // should add some validator before setState in real use cases
      this.setState({ email: event.target.value.trim() });
    }
  }

  handlesOnPasswordChange = (event: SyntheticEvent<>) => {
    if (event) {
      event.preventDefault();
      // should add some validator before setState in real use cases
      this.setState({ password: event.target.value.trim() });
    }
  }
  // #endregion

  // #region on login click
  handlesOnLogin = async (event: SyntheticEvent<>) => {
    if (event) {
      event.preventDefault();
    }

    const {
      logUserIfNeeded,
      url: {
        query
      }
    } = this.props;

    const {
      email,
      password
    } = this.state;

    const userLogin = {
      login:    email,
      password: password
    };

    try {
      const response = await logUserIfNeeded(userLogin);
      const {
        data: {
          token,
          user
        }
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
  }
  // #endregion

  // #region on go back home click
  goHome = (event: SyntheticEvent<>) => {
    if (event) {
      event.preventDefault();
    }

    Router.push({ pathname: '/' });
  }
  // #endregion
}


// #region redux state and dispatch map to props
const mapStateToProps = (
  state: any
) => ({
  // userAuth:
  isAuthenticated: state.userAuth.isAuthenticated,
  isFetching:      state.userAuth.isFetching,
  isLogging:       state.userAuth.isLogging
});

const mapDispatchToProps = (
  dispatch: (...any) => any
) => {
  return {
    ...bindActionCreators(
      {
        // userAuth:
        ...userAuthActions
      },
      dispatch)
  };
};
// #endregion

export default withRedux(
  configureStore,
  mapStateToProps,
  mapDispatchToProps
)(Login);

