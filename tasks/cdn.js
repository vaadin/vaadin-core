var bower =  require('gulp-bower');
var config = require('./config');
var common = require('./common');
var gulp = require('gulp');
var fs = require('fs-extra');
var markdown = require('gulp-markdown');
var replace = require('gulp-replace');
var rsync = require('gulp-rsync');
var gutil = require('gulp-util');
var _ = require('lodash');
var args = require('yargs').argv;
var git = require('gulp-git');

var stagingBasePath = config.paths.staging.cdn;
var version = args.release || args.preRelease || args.autoRevert ? config.version : config.snapshotVersion;
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

gulp.task('cdn:stage-vaadin-components', ['clean:cdn'], function() {
  return gulp.src(['README.md', 'LICENSE.md', 'vaadin-components.html'])
    .pipe(markdown())
    .pipe(gulp.dest(stagingPath + "/vaadin-components"));
});

gulp.task('stage:cdn',
  ['cdn:stage-bower_components',
    'cdn:stage-vaadin-components']);

gulp.task('deploy:cdn', ['stage:cdn'], function() {
  common.checkArguments(['cdnUsername', 'cdnDestination']);
  var hostName = args.cdnHostname || 'cdn.vaadin.com';

  gutil.log('Uploading to cdn (rsync): ' + stagingPath + ' -> '+ args.cdnUsername + '@' + hostName + ':' + args.cdnDestination + version);

  return gulp.src(stagingPath)
    .pipe(rsync({
      username: args.cdnUsername,
      hostname: hostName,
      root: stagingPath,
      emptyDirectories: false,
      recursive: true,
      clean: true,
      silent: true,
      destination: args.cdnDestination + version
    }));
});

gulp.task('cdn-test:clean', function() {
  fs.removeSync(stagingPath + '/test');
});

gulp.task('cdn-test:install-dependencies', function() {
  return bower({
    directory: stagingPath,
    cmd: 'install'
  }, [['web-component-tester#2.2.6']]);
});

config.components.forEach(function (n) {
  gulp.task('cdn-test:stage:' + n, ['cdn-test:clean', 'cdn-test:install-dependencies'], function(done) {
    fs.mkdirsSync(testPath);
    return git.clone('https://github.com/vaadin/' + n, {cwd: testPath}, function (err) {
      gulp.src(testPath + '/' + n + '/test/**')
        .pipe(replace(/(src|href)=("|')(.*?)\.\.\/\.\.\/(bower_components|node_modules)\/(.*?)\//mg, '$1=$2https://cdn.vaadin.com/vaadin-components/'+ version + '/$5/'))
        .pipe(replace(/(src|href)=("|')(.*?)\.\.\//mg, '$1=$2https://cdn.vaadin.com/vaadin-components/'+ version +'/' + n + '/'))
        .pipe(replace(/(src|href)=("|')(.*?)(web-component-tester)\//mg, '$1=$2../../web-component-tester/'))
        .pipe(gulp.dest(testPath + '/' + n + '/test/'));
      done();
    });
  });
});

gulp.task('cdn-test:stage', _.map(config.components, function (n) {
    return 'cdn-test:stage:' + n;
}));

gulp.task('verify:cdn', ['cdn-test:stage'], function(done) {
  if(args.autoRevert) {
    common.checkArguments(['cdnUsername', 'cdnDestination']);
  }

  // use unique browser combination because bower,cdn,zip verifications are run
  // at the same time and TeamCity test results will get mixed up if same browsers are used.
  common.testSauce(
    ['target/cdn/' + version + '/test/**/index.html'],
    ['Windows 7/firefox@36'],
    'vaadin-components / cdn.vaadin.com / ' + version,
    function(err) {
      common.autoRevert(err, function() {
        gutil.log('Deleting folder ' + args.cdnDestination + version);

        require('node-ssh-exec')({
          host: 'cdn.vaadin.com',
          username: args.cdnUsername,
          privateKey: config.paths.privateKey()
        }, 'rm -rf ' + args.cdnDestination + version, function (error, response) {
          if (error) {
            throw error;
          }

          gutil.log(response);

          done(err);
        });

      }, done)});
});
