# pingdom-api - Pingdom API for Node.js

`pingdom-api` provides a simple, programmatic access to [Pingdom](https://www.pingdom.com/)'s API and simplifies its usage somewhat.

[![Circle CI](https://circleci.com/gh/ecorkevin/pingdom-api.png?circle-token=45146bc20f87d2e62296655f92cffa8b12f556e6)](https://circleci.com/gh/ecorkevin/pingdom-api)

### Authenticate

To authenticate with the module, you must provide your pingdom credentials when initializing.  You can also provide the field "accountEmail," which will allow for [multi-user auth](https://www.pingdom.com/features/api/documentation/#multi-user+authentication).

```js
var pingdomApi = require('pingdom-api')({
    user: 'edit this',  // user account login
    pass: 'edit this',  // user account password
    appkey: 'edit this' // pingdom application key
    //accountEmail: 'optional' // the account on which to perform the request (optional)
});
```

### get\[resourceName\]\(options, \[callback\]\);

All of the GET endpoints can be accessed using methods which have the following camelCase syntax:

getChecks (where Checks is the name of the endpoint reference).  If there is a "." in the original reference name, it becomes camelCase.  For example, getSummaryPerformance();

> All endpoint methods are callback/promise compatible.  To pass querystring options (per the pingdom API), simply add an object called "qs" with the necessary options.  If the endpoint calls for a parameter, pass this in using the "target" field in options.

Example:

```js
pingdomApi.getChecks({
  target: 'someCheckId',
  qs: {
    limit: 10
  }
}, function (err, checks, response){
  console.log(err, checks);
});
```
or
```js
pingdomApi.getChecks()
.spread(function(checks, response){
  console.log(checks, response);
})
.catch(function(e){
  console.log(e);
});
```

### set\[resourceName\]\(options, \[callback\]\);

All of the POST endpoints can be accessed using methods which follow the same syntax as the aforementioned GET methods.

### update\[resourceName\]\(options, \[callback\]\);

All of the PUT endpoints can be accessed using methods which follow the same syntax as the aforementioned GET methods.

### remove\[resourceName\]\(options, \[callback\]\);

All of the DELETE endpoints can be accessed using methods which follow the same syntax as the aforementioned GET methods.

---
### LEGACY DOCS (STILL WORK)
Consider the example below:

```js
var pingdom = require('pingdom-api');

var credentials = {
    user: 'updatethis', // based on your user account
    pass: 'updatethis', // based on your user account
    appkey: 'updatethis' // generated per app via web interface
}
var api = pingdom(credentials);

api.checks(function(err, checks) {
    if(err) return console.error(err);

    console.log('received checks', checks);

    // get some results
    api.results(function(err, results) {
        if(err) return console.error(err);

        console.log('received results', results);
    }, {
        target: checks[0].id,
        qs: { // based on https://www.pingdom.com/services/api-documentation-rest/#ResourceResults
            limit: 100
        }
    });
});
```

Currently the API provides access just read-only access to Pingdom's API. In case you need something else, either [poke me with an issue](https://github.com/bebraw/pingdom-api/issues) or create a pull request.

## Contributors

* [rwky](https://github.com/rwky) - Handling of irregular parts of the API
* [Kevin Moritz](https://github.com/ecorkevin) - Massive improvements (promise-based API, basic tests, cleanup)
* [Leonhardt Wille](https://github.com/lwille) - PUT for update calls
* [Sean Soper](https://github.com/ssoper) - Fixed `remove` API

## License

`pingdom-api` is available under MIT. See LICENSE for more details.
