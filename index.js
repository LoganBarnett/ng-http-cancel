'use strict';

angular.module('ng-http-cancel', [])
  .factory('ngHttpCancel', ['$q', '$timeout', '$http', function($q, $timeout, $http) {
    var inFlightRequestDeferrals = [];

    var service = function(config) {
      var deferred = $q.defer();

      var cancelableDeferred = $q.defer();

      $timeout(function() {
        if(!cancelableDeferred.canceled) {
          cancelableDeferred.timedOut = true;
          cancelableDeferred.resolve('timeout');
        }
      }, config.timeout || 30 * 1000);

      config.timeout = cancelableDeferred.promise;

      inFlightRequestDeferrals.push(cancelableDeferred);
      var requestIndex = inFlightRequestDeferrals.length - 1;

      $http(config).then(function(data) {
        inFlightRequestDeferrals.splice(requestIndex, 1);
        deferred.resolve(data);
      }, function(error) {
        if(cancelableDeferred.canceled) {
          deferred.reject('canceled');
        }
        else if(cancelableDeferred.timedOut) {
          deferred.reject('timeout');
        }
        else {
          deferred.reject(error);
        }
      });

      return deferred.promise;
    };

    service.get = function(url, config) {
      config = angular.copy(config) || {};
      config.url = url;
      config.method = 'GET';
      return service(config);
    };

    service.cancelAllRequests = function() {
      inFlightRequestDeferrals.forEach(function(deferred) {
        deferred.resolve('canceled');
        deferred.canceled = true;
      });
      inFlightRequestDeferrals = [];
    };

    return service;
  }])
;