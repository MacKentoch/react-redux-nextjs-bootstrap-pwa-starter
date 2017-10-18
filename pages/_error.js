// @flow

// #region imports
import React, {
  PureComponent
}                 from 'react';
import Jumbotron  from 'react-bootstrap/lib/Jumbotron';
// #endregion

// #region flow types
type Props = {
  errorCode?: number
};

type State = any;

type NextInitialProps = {
  res?: {
    statusCode: number
  },
  xhr: {
    status: number
  }
}
// #endregion

class Error extends PureComponent<Props, State> {
  // #region props initialization
  static getInitialProps = (
    {res, xhr}: NextInitialProps
  ) => {
    const errorCode = res ? res.statusCode : xhr.status;
    return { errorCode };
  };
  // #endregion

  // #region component default props
  static defaultProps = {
    errorCode: null
  };
  // #endregion

  // #region component lifecycle methods
  render() {
    const {
      errorCode
    } = this.props;

    return (
      <Jumbotron>
        <h1>
          Sorry but this time... It threw an error...
        </h1>
        <code>
          Error code: { errorCode ? errorCode : '--' }
        </code>
      </Jumbotron>
    );
  }
  // #endregion
}

export default Error;
