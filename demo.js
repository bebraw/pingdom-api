#!/usr/bin/env node
require('date-utils');

var pingdom = require('./lib/pingdom');
var config = require('./config');

main();

function main() {
    var api = pingdom(config);

    api.checks(function(err, checks) {
        if(err) return console.error(err);

        getPerformanceSummary(api, checks[0].id);
    });
}

function getPerformanceSummary(api, check) {
    var now = Date.today();
    var weekAgo = now.clone().addWeeks(-1);

    api['summary.performance'](function(err, data, res) {
        if(err) return console.error(err);

        console.log(data, res.headers);
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
