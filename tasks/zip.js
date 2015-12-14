var args = require('yargs').argv;
var common = require('./common');
var config = require('./config');
var fs = require('fs-extra');
var gulp = require('gulp');
var gutil = require('gulp-util');
var zip = require('gulp-zip');

var stagingPath = config.paths.staging.zip;
var version = config.version;
var host = config.zipHost;
var user = args.zipUsername;
var filename = 'vaadin-core-elements-' + version + '.zip';
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
  if (args.release) {
    common.ssh(user, host, "sed -i '1i core-elements/" + majorMinorVersion + '/' + version + "' " + args.zipDestination + 'VERSIONS', done);
  } else if (args.preRelease) {
    common.ssh(user, host, "sed -i '1i core-elements/" + majorMinorVersion + '/' + version + "' " + args.zipDestination + 'PRERELEASES', done);
  } else {
    common.ssh(user, host, 'echo core-elements/' + majorMinorVersion + '/' + version + ' > ' + args.zipDestination + 'SNAPSHOT', done);
  }
});

gulp.task('deploy:zip', ['zip:upload', 'zip:update-references']);
