"use strict";

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/* eslint-disable no-process-env */
// #region imports
var express = require('express');

var chalk = require('chalk');

var next = require('next'); // #endregion
// #region variables/constants initialization


var port = parseInt(process.env.PORT, 10) || 3000;
var ipAdress = 'localhost';
var dev = process.env.NODE_ENV !== 'production';
var app = next({
  dev: dev
});
var handle = app.getRequestHandler(); // #endregion
// #region start next application

prepareNextApplication(); // #endregion

function prepareNextApplication() {
  return _prepareNextApplication.apply(this, arguments);
}

function _prepareNextApplication() {
  _prepareNextApplication = _asyncToGenerator(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee() {
    var server;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return app.prepare();

          case 3:
            server = express(); // example of custom request handlers:
            // server.get('/a', (req, res) => app.render(req, res, '/b', req.query));
            // server.get('/b', (req, res) => app.render(req, res, '/a', req.query));
            // handles service worker file request:

            server.get('/sw.js', function (req, res) {
              return res.sendFile('./offline/serviceWorker.js', {
                root: '.'
              });
            }); // default request handler by next handler:

            server.get('*', function (req, res) {
              return handle(req, res);
            });
            server.listen(port, function (err) {
              if (err) {
                throw err;
              }
              /* eslint-disable no-console */


              console.log("\n          =====================================================\n          -> Server (".concat(chalk.bgBlue('NextJS PWA'), ") \uD83C\uDFC3 (running) on ").concat(chalk.green(ipAdress), ":").concat(chalk.green("".concat(port)), "\n          =====================================================\n        "));
              /* eslint-enable no-console */
            });
            _context.next = 12;
            break;

          case 9:
            _context.prev = 9;
            _context.t0 = _context["catch"](0);
            console.error(_context.t0);

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 9]]);
  }));
  return _prepareNextApplication.apply(this, arguments);
}