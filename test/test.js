var should = require('should');
var pingdom = require('../lib/pingdom')({
  user: 'testUser',
  pass: 'testPass',
  appkey: 'testAppKey',
  request: require('./mocks/request')()
});

describe('Pingdom', function() {

  describe('Legacy', function() {
    it('should contain legacy read-only functions', function() {
      pingdom.should.have.property('analysis');
      pingdom.should.have.property('summary.average');
      pingdom.should.have.property('checks');
    });

    it('should return an error (callback)', function(done) {
      pingdom.analysis(function(err, data) {
        should.exist(err);
        err.statuscode.should.equal(403);
        err.errormessage.should.equal('Test Message');
        done();
      }, {
        errorTest: true
      });
    });

    it('should return an error (promise)', function(done) {
      pingdom.analysis({
          errorTest: true
        })
        .catch(function(err) {
          should.exist(err);
          err.statuscode.should.equal(403);
          err.errormessage.should.equal('Test Message');
          done();
        });
    });

    it('should return successfully', function(done) {
      pingdom.analysis({
          successTest: true
        })
        .spread(function(body, response) {
          should.exist(body);
          body.sample.should.equal('body');
          JSON.parse(response).sample.should.equal('response');
          done();
        });
    });

  });

  describe('Get', function() {
    it('should contain get functions', function() {
      pingdom.should.have.property('getAnalysis');
      pingdom.should.have.property('getSummaryAverage');
      pingdom.should.have.property('getChecks');
    });

    it('should work with callback', function(done) {
      pingdom.getAnalysis({
        errorTest: true
      }, function(err, data) {
        should.exist(err);
        err.statuscode.should.equal(403);
        err.errormessage.should.equal('Test Message');
        done();
      });
    });

    it('should work with promises', function(done) {
      pingdom.getAnalysis({
          successTest: true
        })
        .spread(function(body, response) {
          should.exist(body);
          body.sample.should.equal('body');
          JSON.parse(response).sample.should.equal('response');
          done();
        });
    });

  });

  describe('Set', function() {
    it('should contain set functions', function() {
      pingdom.should.have.property('setChecks');
      pingdom.should.have.property('setContacts');
      pingdom.should.have.property('setReportsEmail');
      pingdom.should.have.property('setReportsShared');
    });

    it('should work with callback', function(done) {
      pingdom.setChecks({
        errorTest: true
      }, function(err, data) {
        should.exist(err);
        err.statuscode.should.equal(403);
        err.errormessage.should.equal('No free checks available');
        done();
      });
    });

    it('should work with promises', function(done) {
      pingdom.setChecks({
          successTest: true
        })
        .spread(function(body, response) {
          should.exist(body);
          body.id.should.equal(138631);
          body.name.should.equal('My new HTTP check');
          done();
        });
    });

  });
});