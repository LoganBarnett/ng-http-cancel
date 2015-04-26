'use strict';

var gulp = require('gulp');
var karma = require('karma').server;
var coveralls = require('gulp-coveralls');

gulp.task('coveralls', function() {
  return gulp.src('coverage/**/lcov.info')
    .pipe(coveralls());
})

gulp.task('test', function(done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js'
    , singleRun: true
  }, done);
});
