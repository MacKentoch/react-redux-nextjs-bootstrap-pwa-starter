// @flow
import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  html, body {
    margin: 0;
    height: 100%;
    -webkit-font-smoothing: antialiased;
  }

  .navbar {
    border-radius: 0;
  }
`;

export default GlobalStyle;
