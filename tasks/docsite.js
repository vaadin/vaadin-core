var bower =  require('gulp-bower');
var config = require('./config');
var common = require('./common');
var gulp = require('gulp');
var fs = require('fs-extra');
var replace = require('gulp-replace');
var gutil = require('gulp-util');
var zip = require('gulp-zip');
var args = require('yargs').argv;
var addsrc = require('gulp-add-src');
var rename = require('gulp-rename');

var stagingBasePath = config.paths.staging.cdn;
var docPath = config.paths.staging.doc;
var version = config.version;
var host = config.toolsHost;
var permalink = config.permalink;
var stagingPath = stagingBasePath + '/' + version;
var modify = require('gulp-modify');
var rootZip = 'target/';
var fileZip = 'docsite.zip';

gulp.task('cdn:docsite:clean', function() {
  fs.removeSync(docPath);
  fs.removeSync(rootZip + fileZip);
});

gulp.task('cdn:docsite:bower_components', ['cdn:stage-bower_components'], function() {
  gutil.log('Copying bower components from ' + stagingPath + ' to ' + docPath + '/bower_components');
  return gulp.src([stagingPath + '/**'])
    // Temporary patch until #180 is fixed:
    // https://github.com/webcomponents/webcomponentsjs/issues/180
    .pipe(modify({
      fileModifier: function(file, contents) {
        if (/webcomponents-lite.*js/.test(file.path)) {
          contents = contents.replace(/(if ?\()(\w+\.log)(\))/mg, '$1$2 && $2.split$3');
        }
        return contents;
      }
    }))
    .pipe(gulp.dest(docPath + '/bower_components'));
});

gulp.task('cdn:docsite:core-elements', function() {
  return gulp.src(['docs/**']).pipe(gulp.dest(docPath));
});


gulp.task('cdn:docsite:core-elements-elements', ['cdn:docsite:bower_components'], function() {
  var bowerJson = require('../' + stagingPath + '/bower.json');
  var docsPaths = Object.keys(bowerJson.dependencies).map(function(c) {
    return stagingPath + '/' + c + '/docs/**';
  });

  return gulp.src(docsPaths, {base: stagingPath})
      .pipe(rename(function (path) {
        path.dirname = path.dirname.replace('/docs', '/'); //leaves docs folders empty.
      }))
      .pipe(gulp.dest(docPath + '/'));
});

gulp.task('cdn:docsite:stage', ['cdn:docsite:core-elements',
                                'cdn:docsite:core-elements-elements']);

gulp.task('cdn:docsite:zip', ['cdn:docsite:stage'], function() {
  var src = docPath + '/**/*';
  gutil.log("Creating docsite zip " + docPath + " -> " + rootZip +  fileZip);
  return gulp.src(src)
    .pipe(zip(fileZip))
    .pipe(gulp.dest(rootZip));
});

gulp.task('cdn:docsite:upload', ['cdn:docsite:clean', 'cdn:docsite:zip'], function(done) {
  common.checkArguments(['cdnUsername', 'cdnDestination']);

  gutil.log('Uploading docsite (scp): ' + rootZip + fileZip + ' -> ' + args.cdnUsername + '@' + host + ':' + args.cdnDestination + version);

  require('scp2').scp(rootZip + fileZip, {
    host: host,
    username: args.cdnUsername,
    privateKey: config.paths.privateKey(),
    path: args.cdnDestination + version
  }, function(err) {
    done(err);
  });
});

gulp.task('cdn:docsite', ['cdn:docsite:upload']);
