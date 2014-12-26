var should = require('should');
var pingdom = require('../lib/pingdom')({
  user: 'testUser',
  pass: 'testPass',
  appkey: 'testAppKey'
});

describe('Pingdom', function() {

  describe('Legacy', function() {
    it('should contain legacy read-only functions', function() {
      pingdom.should.have.property('analysis');
      pingdom.should.have.property('summary.average');
      pingdom.should.have.property('checks');
    });

    it('should work with callback', function(done) {
      pingdom.analysis(function(err, data) {
        should.exist(err);
        done();
      });
    });

    it('should work with promises', function(done) {
      pingdom.analysis()
        .catch(function(e) {
          should.exist(e);
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
      pingdom.getAnalysis(function(err, data) {
        should.exist(err);
        done();
      });
    });

    it('should work with promises', function(done) {
      pingdom.getAnalysis()
        .catch(function(e) {
          should.exist(e);
          done();
        });
    });

  });

  describe('Set', function() {
    it('should contain set functions', function() {
      pingdom.should.have.property('setChecks');
    });

    it('should work with callback', function(done) {
      pingdom.setChecks(function(err, data) {
        should.exist(err);
        done();
      });
    });

    it('should work with promises', function(done) {
      pingdom.setChecks()
        .catch(function(e) {
          should.exist(e);
          done();
        });
    });

  });
});