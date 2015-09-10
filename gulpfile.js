"use strict";
var gulp = require('gulp');
require('require-dir')('./tasks');

var version = '0.3.0';

gulp.task('default', function() {
  console.log('\n  Use:\n gulp <stage|deploy[:cdn:zip]>\n');
});

gulp.task('clean', ['clean:cdn', 'clean:zip']);

gulp.task('deploy', ['deploy:cdn', 'deploy:zip']);

// can't run all the verification concurrently until sauce-connect-launcher supports
// multiple tunnels
//gulp.task('verify', ['verify:cdn', 'verify:zip]);
