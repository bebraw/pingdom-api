#!/usr/bin/env node
var pingdom = require('./lib/pingdom');
var config = require('./config');

main();

function main() {
    var api = pingdom(config);

    api.checks(function(err, checks, res) {
        if(err) return console.error(err);

        console.log(checks, res.headers);
    });
}
