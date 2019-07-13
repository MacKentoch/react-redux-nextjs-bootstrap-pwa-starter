// @flow

// #region imports
const express = require('express');
const path = require('path');
const chalk = require('chalk');
// #endregion

// #region constants
const port = parseInt(process.env.PORT, 10) || 3000;
const ipAdress = 'localhost';
const DOCS_PATH = '../out/';
// #endregion

(async () => {
  try {
    const app = express();

    app.set('port', port);
    app.set('ipAdress', ipAdress);

    app.use(
      '/static',
      express.static(path.join(__dirname, DOCS_PATH, 'static/')),
    );

    app.use(
      '/_next',
      express.static(path.join(__dirname, DOCS_PATH, '_next/')),
    );

    app.get('/*', (req, res) =>
      res.sendFile(path.join(__dirname, DOCS_PATH, 'index.html')),
    );

    app.listen(port, err => {
      if (err) {
        throw err;
      }

      /* eslint-disable no-console */
      console.log(`
        =====================================================
        -> Server (${chalk.bgBlue('NextJS PWA')}) 🏃 (running) on ${chalk.green(
        ipAdress,
      )}:${chalk.green(`${port}`)}
        =====================================================
      `);
      /* eslint-enable no-console */
    });

    return app;
  } catch (error) {
    console.log('server error: ', error);
  }
})();
