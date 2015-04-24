'use strict';

describe('ng-http-cancel', function() {
  var $httpBackend;

  beforeEach(module('ng-http-cancel'));
  //beforeEach(module('ng-http-cancel'));

  beforeEach(inject(function(_$httpBackend_) {
    $httpBackend = _$httpBackend_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('wraps requests for $http', function(done) {
    inject(function(ngHttpCancel) {
      $httpBackend.expectGET('/api/v1/foo').respond({foo: 'bar'});

      var promise = ngHttpCancel({url: '/api/v1/foo', method: 'GET'});

      promise.then(function(result) {
        expect(result.data).toEqual({foo: 'bar'});
        done();
      }, function(error) {
        done.fail('Expected success but got error instead:', error);
      });

      $httpBackend.flush();
    });
  });

  it('wraps the $http.get shortcut', function(done) {
    inject(function(ngHttpCancel) {
      $httpBackend.expectGET('/api/v1/foo').respond({foo: 'bar'});

      var promise = ngHttpCancel.get('/api/v1/foo');

      promise.then(function(result) {
        expect(result.data).toEqual({foo: 'bar'});
        done();
      }, function(error) {
        done.fail('Expected success but got error instead:', error);
      });

      $httpBackend.flush();
    });
  });

  it('can be canceled', function(done) {
    inject(function(ngHttpCancel, $timeout) {
      $httpBackend.expectGET('/api/v1/foo').respond({foo: 'bar'});
      var promise = ngHttpCancel.get('/api/v1/foo');

      promise.then(function(result) {
        done.fail('Expected promise to reject but got success instead');
      }, function(error) {
        expect(error).toEqual('canceled');
        done();
      });

      ngHttpCancel.cancelAllRequests();
      $timeout.flush();
    });
  });

  it('times out normally when provided a timeout value', function(done) {
    inject(function(ngHttpCancel, $timeout) {
      $httpBackend.expectGET('/api/v1/foo').respond({foo: 'bar'});
      var promise = ngHttpCancel.get('/api/v1/foo', {timeout: 1000});

      promise.then(function(result) {
        done.fail('Expected promise to reject but got success instead');
      }, function(error) {
        expect(error).toEqual('timeout');
        done();
      });

      $timeout(function() {
        $httpBackend.flush();
      }, 1500);
      $timeout.flush();
    });
  });

  it('rejects the promise when an $http reject occurs', function(done) {
    inject(function(ngHttpCancel, $timeout) {
      $httpBackend.expectGET('/api/v1/foo').respond(500);
      var promise = ngHttpCancel.get('/api/v1/foo');
      promise.then(function(result) {
        done.fail('Expected promise to reject but got success instead');
      }, function(error) {
        expect(error).not.toEqual('timeout');
        expect(error).not.toEqual('canceled');
        done();
      });

      $httpBackend.flush();
    });
  });
});