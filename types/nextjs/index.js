// @flow

export type GetInitialPropsParams = {
  pathname?: string, //  path section of URL
  query?: Object, // query string section of URL parsed as an object
  asPath?: string, // the actual url path
  req?: Object, // HTTP request object (server only)
  res?: Object, // HTTP response object (server only)
  jsonPageRes?: Object, // Fetch Response object (client only)
  err?: Object, // Error object if any error is encountered during the rendering
  isServer?: boolean, // Is rendering server side flag
  store?: Object, // redux store passed
};

// //NOTE:  useRouter hook = (alternative to withRouter HOC):
// const {
//   // `String` of the actual path (including the query) shows in the browser
//   asPath,
//   // `String` Current route
//   route
//   // `Function` navigate back
//   back,
//   // `Function` prefetch a specific page
//   prefetch,
//   // `Function` navigate to a specific page (adds entry to history)
//   push,
//   // `Function` navigate to a specific page
//   replace,
//   // `Object` current query
//   query,
//   // `Function` Reload current page
//   reload
// } = useRouter()
