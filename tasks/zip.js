var config = require('./config');
var fs = require('fs-extra');
var gulp = require('gulp');
var zip = require('gulp-zip');

var stagingPath = config.paths.staging.zip;
var version = config.version;
var filename = 'vaadin-core-elements-' + version + '.zip';
var majorMinorVersion = version.replace(/(\d+\.\d+)(\.|-)(.*)/, '$1');

gulp.task('clean:zip', function() {
  fs.removeSync(stagingPath);
});

gulp.task('zip', ['clean:zip', 'stage:cdn'], function() {
  return gulp.src(config.paths.staging.cdn + '/' + version + '/**/*')
    .pipe(zip(filename))
    .pipe(gulp.dest(stagingPath));
});
