var _ = require('lodash');
var args = require('yargs').argv;
var bower = require('gulp-bower');
var common = require('./common');
var config = require('./config');
var download = require('gulp-download');
var fs = require('fs-extra');
var gulp = require('gulp');
var gutil = require('gulp-util');
var replace = require('gulp-replace');
var unzip = require('gulp-unzip');
var zip = require('gulp-zip');

var stagingPath = config.paths.staging.zip;
var version = config.version;
var host = config.zipHost;
var user = args.zipUsername;
var filename = 'vaadin-elements-' + version + '.zip';
var majorMinorVersion = version.replace(/(\d+\.\d+)(\.|-)(.*)/, '$1');

gulp.task('clean:zip', function() {
  fs.removeSync(stagingPath);
});

gulp.task('stage:zip', ['clean:zip', 'stage:cdn'], function() {
  return gulp.src(config.paths.staging.cdn + '/' + version + '/**/*')
    .pipe(zip(filename))
    .pipe(gulp.dest(stagingPath));
});

function computeDestination() {
  common.checkArguments(['zipUsername', 'zipDestination']);
  var path = majorMinorVersion != version ? majorMinorVersion + '/' + version : version;
  path = args.zipDestination + path + '/' + filename;
  return path;
}

gulp.task('zip:upload', ['stage:zip'], function(done) {
  var src = stagingPath + '/' + filename;
  var dst = computeDestination();
  gutil.log('Uploading zip package (scp): ' + src + ' -> ' + user + '@' + host + ':' + dst);
  require('scp2').scp(src, {
    host: host,
    username: user,
    privateKey: config.paths.privateKey(),
    path: dst
  }, function(err) {
    done(err);
  })
});

gulp.task('zip:update-references', ['zip:upload'], function(done) {
  var dst = computeDestination();
  var latest = '/var/www/vaadin/download/elements/latest/vaadin-elements-latest.zip';
  var cmd = 'rm -f ' + latest + '; ln -s ' + dst + ' ' + latest;
  common.ssh(user, host, cmd);
  if(args.release) {
    common.ssh(user, host, "sed -i '1i elements/" + majorMinorVersion + '/' + version + "' " + args.zipDestination + 'VERSIONS', done);
  } else if(args.preRelease) {
    common.ssh(user, host, "sed -i '1i elements/" + majorMinorVersion + '/' + version + "' " + args.zipDestination + 'PRERELEASES', done);
  } else {
    common.ssh(user, host, 'echo elements/' + majorMinorVersion + '/' + version + ' > ' + args.zipDestination + 'SNAPSHOT', done);
  }
});

gulp.task('deploy:zip', ['zip:upload', 'zip:update-references']);

gulp.task('zip-test:clean', function() {
  fs.removeSync(stagingPath + '/test');
});

gulp.task('zip-test:download', ['zip-test:clean'],  function() {
  var url = args.zipUrl || 'https://vaadin.com/download/elements';
  return download(url + '/' + majorMinorVersion +'/' + version + '/' + filename)
    .pipe(gulp.dest(stagingPath + '/test'));
});

gulp.task('zip-test:unzip', ['zip-test:download'], function() {
  return gulp.src(stagingPath + '/test/' + filename)
    .pipe(unzip())
    .pipe(gulp.dest(stagingPath + '/test'));
});

gulp.task('zip-test:install-wct', ['zip-test:download'], function() {
  return bower({
    cwd: stagingPath + '/test',
    directory: '.',
    cmd: 'install'
  }, [['web-component-tester#2.2.6']]);
});

// TODO: Haven't been fixed for the new project structure. Once the tests are in use,
// apply similar changes as in cdn.js
config.elements.forEach(function (n) {
  gulp.task('zip-test:stage:' + n, ['zip-test:download'], function() {
    return gulp.src('vaadin-elements/' + n + '/test/**/*')
      .pipe(replace(/(src|href)=("|')(.*?)\.\.\/\.\.\/\.\.\/\.\.\/(bower_components|node_modules)\//mg, '$1=$2../../$3'))
      .pipe(replace(/(src|href)=("|')(.*?)\.\.\/\.\.\/\.\.\/(bower_components|node_modules)\//mg, '$1=$2../../$3'))
      .pipe(replace(/(src|href)=("|')(.*?)\.\.\/(vaadin-)/mg, '$1=$2../../' + n + '/$3$4'))
      .pipe(gulp.dest(stagingPath + '/test/test/' + n + '/'));
  });
});

gulp.task('zip-test:stage', _.map(config.elements, function(n) {
    return 'zip-test:stage:'+n;
}));

gulp.task('verify:zip', ['zip-test:unzip', 'zip-test:install-wct', 'zip-test:stage'], function(done) {
  if(args.autoRevert) {
    common.checkArguments(['zipUsername', 'zipDestination']);
  }

  common.testSauce(
    ['target/zip/test/test/**/index.html'],
    ['Windows 7/internet explorer@11'],
    'vaadin-elements / vaadin.com / ' + version,
    function(err) {
      common.autoRevert(err, function() {
        var path = args.zipDestination + majorMinorVersion + '/' + version;

        gutil.log('Deleting package ' + path);

        // remove the version from VERSIONS
        common.ssh(user, host, 'grep -v "elements/' + majorMinorVersion + '/' + version + '" ' +
          args.zipDestination + 'VERSIONS > temp && mv temp ' + args.zipDestination + 'VERSIONS', function(error) {
          if(error) done(error);
          // remove the package
          common.ssh(user, host, 'rm -rf ' + path, done);
        });
        }, done);
      });
});
