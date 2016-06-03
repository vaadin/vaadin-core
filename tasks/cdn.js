var bower = require('gulp-bower');
var config = require('./config');
var common = require('./common');
var gulp = require('gulp');
var fs = require('fs-extra');
var modify = require('gulp-modify');
var rsync = require('gulp-rsync');
var gutil = require('gulp-util');
var args = require('yargs').argv;

var stagingBasePath = config.paths.staging.cdn;
var version = config.version;
var host = config.toolsHost;
var permalink = config.permalink;
var stagingPath = stagingBasePath + '/' + version;
var testPath = process.cwd() + '/' + stagingPath + '/test';

gulp.task('clean:cdn', function() {
  fs.removeSync(stagingBasePath);
});

gulp.task('cdn:stage-bower_components', function() {
  return bower({
    directory: stagingPath,
    forceLatest: true,
    cmd: 'install'
  });
});

gulp.task('cdn:stage-vaadin-core-elements', function() {
  return gulp.src(['LICENSE.html', 'README.md', 'index.html', 'vaadin-core-elements.html', 'demo/*', 'apidoc/*'], {
      base: "."
    })
    .pipe(modify({
      fileModifier: function(file, contents) {
        if (/README.md/.test(file.path)) {
          contents = contents.replace(/\/latest\//mg, '/' + version + '/');
        } else {
          contents.replace('https://cdn.vaadin.com/vaadin-core-elements/latest/', '../../');
        }
        return contents;
      }
    }))
    .pipe(gulp.dest(stagingPath + "/vaadin-core-elements"));
});

gulp.task('stage:cdn', ['clean:cdn', 'cdn:stage-bower_components', 'cdn:stage-vaadin-core-elements']);

gulp.task('upload:cdn', ['stage:cdn'], function() {
  common.checkArguments(['cdnUsername', 'cdnDestination']);
  gutil.log('Uploading to cdn (rsync): ' + stagingPath + ' -> ' + args.cdnUsername + '@' + host + ':' + args.cdnDestination + version);
  return gulp.src(stagingPath)
    .pipe(rsync({
      username: args.cdnUsername,
      hostname: host,
      root: stagingPath,
      emptyDirectories: false,
      recursive: true,
      clean: true,
      silent: true,
      destination: args.cdnDestination + version
    }));
});

gulp.task('deploy:cdn', ['upload:cdn'], function(done) {
  if (permalink) {
    var cmd = 'rm -f ' + args.cdnDestination + permalink + '; ln -s ' + version + ' ' + args.cdnDestination + permalink + '; ls -l ' + args.cdnDestination;
    gutil.log('Deploying CDN : ssh ' + args.cdnUsername + '@' + host + ' ' + cmd);
    common.ssh(args.cdnUsername, host, cmd, done);
  } else {
    done();
  }
});
