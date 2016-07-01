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
  return gulp.src(['docs/*', '!docs/angular2.adoc'])
    .pipe(gulp.dest(docPath));
});

gulp.task('cdn:docsite:core-elements-ng2-integration', function() {
  return gulp.src('docs/angular2.adoc')
    .pipe(gulp.dest(docPath + '/integrations'));
});

gulp.task('cdn:docsite:core-elements-integrations', function() {
  return getDocModifyTask('demo/**', docPath + '/integrations');
});

gulp.task('cdn:docsite:core-elements-elements', ['cdn:docsite:bower_components'], function() {
  var docsPaths = config.coreElements.map(function(c) {
      return stagingPath + '/' + c + '/docs/**';
    });

  return gulp.src(docsPaths, {base: stagingPath})
      .pipe(rename(function (path) {
        path.dirname = path.dirname.replace('/docs', '/'); //leaves docs folders empty.
      }))
      .pipe(gulp.dest(docPath + '/'));
});

function getDocModifyTask(sourceFiles, targetFolder, n) {
  fs.mkdirsSync(targetFolder);
  gutil.log('Generating site documentation from '  + sourceFiles + ' into ' + targetFolder);

  return gulp.src([sourceFiles, '!**/*-embed.html'])
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
    // Remove webcomponents polyfill since it's added at top of the site
    .pipe(replace(/^.*<script.*?\/webcomponents.*\.js[\"'].*?<\/script>\s*?\n?/img, ''))
    // embed files are displayed as iframe, we don't remove above fragments like body or polyfill
    .pipe(addsrc(sourceFiles + '/*-embed.html'))
    // Remove Analytics
    .pipe(replace(/^.*<script.*?ga\.js[\"'].*?<\/script>\s*?\n?/img, ''))
    // Adjust bowerComponents variable in common.html
    .pipe(replace(/(bowerComponents *= *)'..\/..\/'/, "$1'../bower_components/'"))
    // Adjust location of the current component in bower_components (..)
    .pipe(replace(/(src|href)=("|')\.\.(\/\w)/mg, '$1=$2../bower_components/' + n + '$3'))
    // Adjust location of dependencies in bower_components (../..)
    .pipe(replace(/(src|href)=("|')(.*?)\.\.\/\.\.\//mg, '$1=$2../bower_components/'))
    // Remove references to demo.css file
    .pipe(replace(/^.*<link.*demo.css.*\n/im, ''))
    // Remove table of contents
    .pipe(replace(/^.*table-of-contents.html.*\n/im, ''))
    .pipe(gulp.dest(targetFolder));
}

gulp.task('cdn:docsite:stage', ['cdn:docsite:core-elements',
                                'cdn:docsite:core-elements-elements',
                                'cdn:docsite:core-elements-integrations',
                                'cdn:docsite:core-elements-ng2-integration']);

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
