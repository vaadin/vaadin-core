"use strict";
var gulp = require('gulp');
require('require-dir')('./tasks');
var args = require('yargs').argv;
var git = require('gulp-git');

var version = '0.3.0';

gulp.task('default', function() {
  console.log('\n  Use:\n gulp <stage|deploy[:cdn:zip]>\n');
});

gulp.task('clean', ['clean:cdn', 'clean:zip']);

gulp.task('tag', ['deploy:cdn', 'deploy:zip'], function() {
  if(args.release) {
    version = args.version || version;
    return git.tag(version, 'Release version ' + version, {cwd: '.'}, function (err) {
      if (err) throw err;
      return git.push('origin', version, {cwd: '.', args: '--tags'});
    });
  }
});

gulp.task('deploy', ['tag']);

// can't run all the verification concurrently until sauce-connect-launcher supports
// multiple tunnels
//gulp.task('verify', ['verify:cdn', 'verify:zip]);
