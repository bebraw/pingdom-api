var request = require('request');
var ziptoo = require('funkit').functional.ziptoo;
var resourcesToKey = {
    'checks' : function(obj){
        return obj.checks || obj.check;
    },
    'analysis' : function(obj) {
        return obj.analysis || obj;
    },
    'reference': function(obj){
        return obj;
    },
    'reports.email': function(obj){
        return obj.subscriptions;
    },
    'reports.shared': function(obj){
        return obj.shared.banners;
    },
    'single': function(obj){
        return obj.result;
    }
};


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
            obj = JSON.parse(res.body);

            if(obj.error) return cb(obj.error);

            if(typeof resourcesToKey[property] !== 'undefined'){
                data = resourcesToKey[property](obj);
            } else {
                data = JSON.parse(res.body)[property.split('.')[1]] || JSON.parse(res.body)[property.split('.')[0]];
            }
            cb(err, data, res);
        }
        catch(e) {
            cb(e, null, res);
        }
    });
}

function dateToUnix(date) {
    return parseInt(date.getTime() / 1000, 10);
}
