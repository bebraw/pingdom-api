var BB = require('bluebird');

function Request() {
  this.getAsync = function(options, callback) {
    if (options.errorTest) {
      return BB.reject({
        statuscode: 403,
        statusdesc: 'Test',
        errormessage: 'Test Message'
      });
    }

    if (options.successTest) {
      return BB.resolve([
        JSON.stringify({
          "sample": "response"
        }),
        JSON.stringify({
          "sample": "body"
        })
      ])
    }
  };

  this.postAsync = function(options, callback) {
    if (options.errorTest) {
      return BB.reject({
        statuscode: 403,
        statusdesc: 'Forbidden',
        errormessage: 'No free checks available'
      });
    }

    if (options.successTest) {
      return BB.resolve([
        JSON.stringify({
          "body": {
            "check": {
              "id": 138631,
              "name": "My new HTTP check"
            }
          }
        }),
        JSON.stringify({
          "check": {
            "id": 138631,
            "name": "My new HTTP check"
          }
        })
      ]);
    }
  }
}

module.exports = exports = function MockRequestFactory() {
  return new Request();
}