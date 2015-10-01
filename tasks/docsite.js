var bower =  require('gulp-bower');
var config = require('./config');
var common = require('./common');
var gulp = require('gulp');
var fs = require('fs-extra');
var replace = require('gulp-replace');
var rsync = require('gulp-rsync');
var gutil = require('gulp-util');
var zip = require('gulp-zip');
var args = require('yargs').argv;
var addsrc = require('gulp-add-src');

var stagingBasePath = config.paths.staging.cdn;
var docPath = config.paths.staging.doc;
var version = config.version;
var host = config.cdnHost;
var permalink = config.permalink;
var stagingPath = stagingBasePath + '/' + version;
var modify = require('gulp-modify');

gulp.task('cdn:docsite:bower_components', ['cdn:stage-bower_components'], function() {
  gutil.log('Copying bower components from ' + stagingPath + ' to ' + docPath + '/bower_components');
  return gulp.src([stagingPath + '/**'])
    .pipe(gulp.dest(docPath + '/bower_components'));
});

var doctasks = [];
config.components.forEach(function (n) {
  var task = 'cdn:docsite:' + n;
  doctasks.push(task);
  gulp.task(task, ['cdn:docsite:bower_components'], function(done) {
    var componentDoc = docPath + '/' + n;
    var componentOrg = stagingPath + '/' + n + '/demo/**';
    gutil.log('Generating site documentation from '  + componentOrg + ' into ' + componentDoc);
    fs.mkdirsSync(componentDoc);
    return gulp.src([componentOrg, '!**/*-embed.html'])
      // Remove bad tags
      .pipe(replace(/^.*<(!doctype|\/?html|\/?head|\/?body|meta|title).*>.*\n/img, ''))
      // Uncomment metainfo, and enclose all the example in {% raw %} ... {% endraw %} to avoid liquid conflicts
      // We use gulp-modify instead of replace in order to handle the github url for this file
      .pipe(modify({
        fileModifier: function(file, contents) {
          var re = new RegExp(".*/" + n + "/");
          var gh = 'https://github.com/vaadin/' + n + '/edit/master/' + file.path.replace(re, '');
          return contents.replace(/^.*<!--[ \n]+([\s\S]*?title:[\s\S]*?)[ \n]+-->.*\n([\s\S]*)/img,
              '---\n$1\nsourceurl: ' + gh + '\n---\n{% raw %}\n$2\n{% endraw %}');
        }
      }))
      .pipe(replace(/^.*<section>[\s\S]*?table-of-contents[\s\S]*?<\/section>.*\n/im, ''))
      // Add ids to headers, so as site configures permalinks
      .pipe(replace(/<h(\d+)>(.*)(<\/h\d+>)/img, function($0, $1, $2, $3){
        var id = $2.trim().toLowerCase().replace(/[^\w]+/g,'_');
        return '<h' + $1 + ' id="' + id + '">' + $2 + $3;
      }))
      // embed files are displayed as iframe, we don't remove above fragments like body
      .pipe(addsrc(componentOrg + '/*-embed.html'))
      // Remove Analytics
      .pipe(replace(/^.*<script.*?ga\.js[\"'].*?<\/script>\s*?\n?/img, ''))
      // Adjust location of the current component in bower_components (..)
      .pipe(replace(/(src|href)=("|')\.\.(\/\w)/mg, '$1=$2../bower_components/' + n + '$3'))
      // Adjust location of dependencies in bower_components (../..)
      .pipe(replace(/(src|href)=("|')(.*?)\.\.\/\.\.\//mg, '$1=$2../bower_components/'))

      .pipe(gulp.dest(componentDoc));
  });
});

gulp.task('cdn:docsite:zip', doctasks, function() {
  var src = docPath + '/../**/*';
  var root = 'target';
  var file = 'docsite.zip';
  gutil.log("Creating docsite zip " + docPath + " -> " + root + '/' + file);
  return gulp.src(src)
    .pipe(zip(file))
    .pipe(gulp.dest(root));
});

gulp.task('cdn:docsite:upload', ['cdn:docsite:zip'], function(done) {
  common.checkArguments(['cdnUsername', 'cdnDestination']);
  var root = 'target';
  var file = 'docsite.zip';

  gutil.log('Uploading docsite (scp): ' + root + '/' + file + ' -> ' + args.cdnUsername + '@' + host + ':' + args.cdnDestination + version);

  require('scp2').scp(root + '/' + file, {
    host: host,
    username: args.cdnUsername,
    privateKey: config.paths.privateKey(),
    path: args.cdnDestination + version
  }, function(err) {
    done(err);
  })
});

gulp.task('cdn:docsite', ['cdn:docsite:upload']);


