# pingdom-api - Pingdom API for Node.js

`pingdom-api` provides a simple, programmatic access to [Pingdom](https://www.pingdom.com/)'s API and simplifies its usage somewhat. Consider the example below:

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

## License

`pingdom-api` is available under MIT. See LICENSE for more details.
