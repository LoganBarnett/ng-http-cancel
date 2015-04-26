# ng-http-cancel
Cancelable $http wrapper.

[![Build Status](https://travis-ci.org/LoganBarnett/ng-http-cancel.svg?branch=master)](https://travis-ci.org/LoganBarnett/ng-http-cancel) [![Coverage Status](https://coveralls.io/repos/LoganBarnett/ng-http-cancel/badge.svg)](https://coveralls.io/r/LoganBarnett/ng-http-cancel)

## Installation

`bower install ng-http-cancel --save`

## Usage
```javascript
var deferred = $q.defer();
var promise = ngHttpCancel.get('/api/v1/foo');

promise.then(function(result) {
  // do things
}, function(reason) {
  if(reason == 'canceled') {
    deferred.reject('A timeout occurred trying to GET /api/v1/foo!');
  }
  else {
    deferred.reject(reason);
  }
});

return deferred.promise;
```
Afterwards:
```javascript
  ngHttpCancel.cancelAllRequests();
```
