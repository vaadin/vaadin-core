var bower = require('gulp-bower');
var config = require('./config');
var common = require('./common');
var gulp = require('gulp');
var fs = require('fs-extra');
var path = require('path');
var modify = require('gulp-modify');
var rsync = require('gulp-rsync');
var gutil = require('gulp-util');
var args = require('yargs').argv;
var git = require('gulp-git');

var stagingBasePath = config.paths.staging.cdn;
var version = config.version;
var host = config.toolsHost;
var permalink = config.permalink;
var stagingPath = path.join(process.cwd(), stagingBasePath, version);

gulp.task('clean:cdn', function() {
  fs.removeSync(stagingBasePath);
});

gulp.task('cdn:stage-bower.json', ['clean:cdn'], function() {
  // Load the bower.json, assign overrides and write back to disk.
  var bowerJson = JSON.parse(fs.readFileSync('./bower.json', 'utf-8'));

  if (version === 'master') {
    gutil.log('Applying overrides to ' + stagingPath + '/bower.json');

    // Assign the override properties.
    Object.keys(bowerJson.masterOverrides).forEach(function(override) {
      bowerJson[override] = bowerJson.masterOverrides[override];
    });
    delete bowerJson.masterOverrides;
  }

  fs.mkdirsSync(stagingBasePath);
  fs.mkdirsSync(stagingPath);
  fs.writeFileSync(stagingPath + '/bower.json', JSON.stringify(bowerJson, null, '  '));
});

gulp.task('cdn:stage-bower_components', ['cdn:stage-bower.json'], function() {
  return bower({
    directory: '.',
    cwd: stagingPath,
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
    .pipe(gulp.dest(stagingPath + '/vaadin-core-elements'));
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

/* Above are the old tasks to publish the vaadin-core-elements package, below the tasks to publish a single element from a specific tag/branch. Sorry about the poor naming :-) */

gulp.task('cdn:arguments', function(done) {
  common.checkArguments(['element', 'tag']);
  args.folder = args.tag.replace(/^v/g, '');
  stagingPath = path.join(process.cwd(), stagingBasePath, args.element, args.folder);
  done();
});

gulp.task('cdn:clone', ['clean:cdn', 'cdn:arguments'], function(done) {
  git.clone('https://github.com/vaadin/' + args.element, {args: '-b ' + args.tag + ' ./target/cdn/' + args.element + '/' + args.folder }, function (err) {
    if (err) throw err;
    done();
  });
});

gulp.task('cdn:install', ['cdn:arguments', 'cdn:clone'], function() {
  return bower({
    cwd: stagingPath,
    forceLatest: true,
    cmd: 'install'
  });
});

gulp.task('cdn:stage', ['cdn:arguments', 'cdn:install'], function() {
  return gulp.src([stagingPath + '/**/*.html',  '!**/bower_components/**'])
    .pipe(modify({
      fileModifier: function(file, contents) {
        // magic regex trying to change import paths from:
        // ../foo/foo.html to bower_components/foo/foo.html
        // ../../foo/foo.html to ../bower_components/foo/foo.html
        // ../my-element.html stays as it is.
        contents = contents.replace(new RegExp(/([href|src].+)((\.\.\/)((?!bower_components|\.\.).+\/.+))/g), '$1bower_components/$4');
        return contents;
      }
    }))
    .pipe(gulp.dest(stagingPath));
});

gulp.task('cdn:upload', ['cdn:stage'], function() {
  common.checkArguments(['cdnUsername', 'cdnDestination']);
  var destination = path.join(args.cdnDestination, args.element, args.folder);
  gutil.log('Uploading to cdn (rsync): ' + stagingPath + ' -> ' + args.cdnUsername + '@' + host + ':' + destination);
  return gulp.src(stagingPath)
    .pipe(rsync({
      username: args.cdnUsername,
      hostname: host,
      root: stagingPath,
      emptyDirectories: false,
      recursive: true,
      clean: true,
      silent: true,
      destination: destination
    }));
});
