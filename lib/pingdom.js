var request = require('request');
var ziptoo = require('funkit').functional.ziptoo;


function init(config) {
    // https://www.pingdom.com/services/api-documentation-rest/
    var baseUrl = 'https://api.pingdom.com/api/2.0/';
    var resources = ['actions', 'analysis', 'checks', 'contacts', 'credits', 'probes',
        'reference', 'reports.email', 'reports.public', 'reports.shared',
        'results', 'servertime', 'settings', 'summary.average', 'summary.hoursofday',
        'summary.outage', 'summary.performance', 'summary.probes', 'single', 'traceroute'
    ];

    return ziptoo(resources.map(function(resource) {
        return [resource, template.bind(undefined, config, baseUrl, resource)];
    }));
}
module.exports = init;

function template(config, baseUrl, property, cb, o) {
    o = o || {};
    var target = o.target || '';
    var qs = o.qs || {};

    // accept Date objects and convert them to Unix format here
    if(qs.to) qs.to = dateToUnix(qs.to);
    if(qs.from) qs.from = dateToUnix(qs.from);

    request.get(baseUrl + property + '/' + target, {
        auth: config,
        headers: {
            'App-Key': config.appkey
        },
        qs: qs
    }, function(err, res) {
        try {
            cb(err, JSON.parse(res.body)[property.split('.')[0]], res);
        }
        catch(e) {
            cb(e, null, res);
        }
    });
}

function dateToUnix(date) {
    return parseInt(date.getTime() / 1000, 10);
}
