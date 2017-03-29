"use strict";
var gulp = require('gulp');
require('require-dir')('./tasks');
var args = require('yargs').argv;

gulp.task('default', function() {
  console.log('\n  Use:\n gulp <stage|deploy[:cdn]>|<zip>\n');
});

gulp.task('clean', ['clean:cdn', 'clean:zip']);

gulp.task('deploy', ['deploy:cdn']);