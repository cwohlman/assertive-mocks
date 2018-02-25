// From: https://github.com/request/request/blob/master/tests/test-api.js


var http = require('http')
var request = require('../index')
var { describe, fn, obj, callback } = require('assertive-mock');

// create a mock by describing the request module
const mock = describe('request');

function setupServer({ responseCode }) {
  server = http.createServer()
  server.on('request', function (req, res) {
    res.writeHead(202)
    req.pipe(res)
  })
  server.listen(0, function () {
    server.url = 'http://localhost:' + this.address().port
    t.end()
  })
}

mock.addCase(
  fn(obj, callback).thenCallback(null, obj)
)
.addExample((subject) => {
  let promise;
  it('should return the expected response code', function () {
    const responseCode = 202;
    const server = this.server = setupServer({ responseCode: 202 });
    return promise = new Promise((resolve, reject) => {
      subject({
        url: server.url,
      }, (error, result) => {
        if (error) {
          reject(error);
        } else if (result.statusCode !== responseCode) {
          reject(new Error('Expected status code of ' + statusCode))
        } else {
          resolve();
        }
      });
    });
  });

  return promise;
});

describe('require', function () {
  mock.testAllExamples(() => request);

  afterEach(function () {
    this.server.cleanup();
  });
});

export { mock };

// Original: 

// 'use strict'

// var http = require('http')
// var request = require('../index')
// var tape = require('tape')
// var server

// tape('setup', function (t) {
//   server = http.createServer()
//   server.on('request', function (req, res) {
//     res.writeHead(202)
//     req.pipe(res)
//   })
//   server.listen(0, function () {
//     server.url = 'http://localhost:' + this.address().port
//     t.end()
//   })
// })

// tape('callback option', function (t) {
//   request({
//     url: server.url,
//     callback: function (err, res, body) {
//       t.error(err)
//       t.equal(res.statusCode, 202)
//       t.end()
//     }
//   })
// })

// tape('cleanup', function (t) {
//   server.close(t.end)
// })