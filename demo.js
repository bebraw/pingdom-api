#!/usr/bin/env node
require('date-utils');

var pingdom = require('./lib/pingdom');
var config = require('./config');

main();

function main() {
    var api = pingdom(config);

    api.checks(function(err, checks) {
        var id;

        if(err) return console.error(err);

        id = checks[0].id;

        getResults(api, id)
        getPerformanceSummary(api, id);
    });
}

function getResults(api, check) {
    api.results(function(err, data, res) {
        if(err) return console.error(err);

        console.log('results', data, res.headers);
    }, {
        target: check,
        qs: {
            limit: 10
        }
    })
}

function getPerformanceSummary(api, check) {
    var now = Date.today();
    var weekAgo = now.clone().addWeeks(-1);

    api['summary.performance'](function(err, data, res) {
        if(err) return console.error(err);

        console.log('performance summary', data, res.headers);
    }, {
        target: check,
        qs: {
            from: weekAgo,
            to: now,
            resolution: 'day',
            includeuptime: true
        }
    });
}
