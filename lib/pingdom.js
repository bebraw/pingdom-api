var BB = require('bluebird');
var request = BB.promisifyAll(require('request'));

var annozip = require('annozip');
var resourcesToKey = {
  'checks': function(obj) {
    return obj.checks || obj.check;
  },
  'analysis': function(obj) {
    return obj.analysis || obj;
  },
  'reference': function(obj) {
    return obj;
  },
  'reports.email': function(obj) {
    return obj.subscriptions;
  },
  'reports.shared': function(obj) {
    return obj.shared.banners;
  },
  'single': function(obj) {
    return obj.result;
  }
};


function init(config) {

  config.request = config.request || request;

  // https://www.pingdom.com/services/api-documentation-rest/
  var baseUrl = 'https://api.pingdom.com/api/2.0/';

  var getResources = ['actions', 'analysis', 'checks', 'contacts', 'credits', 'probes',
    'reference', 'reports.email', 'reports.public', 'reports.shared',
    'results', 'servertime', 'settings', 'summary.average', 'summary.hoursofday',
    'summary.outage', 'summary.performance', 'summary.probes', 'single', 'traceroute'
  ];

  var setResources = ['checks', 'contacts', 'reports.email', 'reports.shared'];
  var types = ['get', 'set'];

  var legacyApi = [];

  var getApi = getResources.map(function(getResource) {
    legacyApi.push([getResource, template.bind(undefined, config, baseUrl, getResource, 'get')]);
    return ['get' + capitalizeFirstLetterAndRemovePeriod(getResource), template.bind(undefined, config, baseUrl, getResource, 'get')];
  });

  var setApi = setResources.map(function(setResource) {
    return ['set' + capitalizeFirstLetterAndRemovePeriod(setResource), template.bind(undefined, config, baseUrl, setResource, 'post')];
  });

  return annozip.toObject(legacyApi.concat(getApi).concat(setApi));

}
module.exports = init;

function capitalizeFirstLetterAndRemovePeriod(string) {
  var temp = string.charAt(0).toUpperCase() + string.slice(1);
  var loc = temp.indexOf('.');
  if (loc !== -1) {
    temp = temp.slice(0, loc) + temp.charAt(loc + 1).toUpperCase() + temp.slice(loc + 2);
  }
  return temp;
}

function template(config, baseUrl, property, method, options, cb) {

  if (typeof options === 'function') {
    cb = options;
    options = {};
  }

  options = options || {};
  method = (method || 'get').toString() + 'Async';
  var target = options.target || '';
  var qs = options.qs || {};

  // accept Date objects and convert them to Unix format here
  if (qs.to) qs.to = dateToUnix(qs.to);
  if (qs.from) qs.from = dateToUnix(qs.from);

  options.url = baseUrl + property + '/' + target;
  options.auth = config;
  options.headers = {
    'App-Key': config.appkey
  };

  return config.request[method](options)
    .spread(function(res, body) {
      obj = JSON.parse(body);

      if (obj.error) {
        return BB.reject(obj.error);
      }

      if (typeof resourcesToKey[property] !== 'undefined') {
        data = resourcesToKey[property](obj);
      } else {
        data = JSON.parse(res.body)[property.split('.')[1]] || JSON.parse(res.body)[property.split('.')[0]];
      }
      return [data, res];
    })
    .nodeify(cb, {
      spread: true
    });
}

function dateToUnix(date) {
  return parseInt(date.getTime() / 1000, 10);
}