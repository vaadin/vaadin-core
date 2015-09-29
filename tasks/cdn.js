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
var addsrc = require('gulp-add-src');

var stagingBasePath = config.paths.staging.cdn;
var version = config.version;
var host = config.cdnHost;
var permalink = config.permalink;
var stagingPath = stagingBasePath + '/' + version;
var testPath = process.cwd() + '/' + stagingPath + '/test';
var docPath = stagingPath + '/docsite';

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

gulp.task('cdn:stage-vaadin-components', function() {
  return gulp.src(['LICENSE.html', 'ga.js', 'vaadin-components.html', 'demo/*', 'apidoc/*'], {base:"."})
    .pipe(replace('https://cdn.vaadin.com/vaadin-components/latest/', '../../'))
    .pipe(addsrc('README.md'))
    .pipe(gulp.dest(stagingPath + "/vaadin-components"));
});

gulp.task('stage:cdn', [ 'clean:cdn', 'cdn:stage-bower_components', 'cdn:stage-vaadin-components' ]);

gulp.task('upload:cdn', ['stage:cdn'], function() {
  common.checkArguments(['cdnUsername', 'cdnDestination']);
  gutil.log('Uploading to cdn (rsync): ' + stagingPath + ' -> '+ args.cdnUsername + '@' + host + ':' + args.cdnDestination + version);
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
    var cmd = 'rm -f ' + args.cdnDestination + permalink + '; ln -s ' + version + ' ' +  args.cdnDestination + permalink + '; ls -l ' + args.cdnDestination;
    gutil.log('Deploying CDN : ssh ' + args.cdnUsername + '@' + host + ' ' +  cmd);
    require('node-ssh-exec')({
      host: host,
      username: args.cdnUsername,
      privateKey: config.paths.privateKey()
    }, cmd, function (error, response) {
      if (error) {
        throw error;
      }
      gutil.log(response);
      done();
    });
  } else {
    done();
  }
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

gulp.task('cdn:docsite:bower_components', ['cdn:stage-bower_components'], function() {
  gutil.log('Copying bower components from ' + stagingPath + ' to ' + docPath + '/bower_components');
  return gulp.src([stagingPath + '/**'])
    .pipe(gulp.dest(docPath + '/bower_components'));
});

config.components.forEach(function (n) {
  gulp.task('cdn:docsite:' + n,  ['cdn:docsite:bower_components'], function(done) {
    var componentDoc = docPath + '/' + n;
    var componentOrg = stagingPath + '/' + n + '/demo/**';
    gutil.log('Generating site documentation from '  + componentOrg + ' into ' + componentDoc);
    fs.mkdirsSync(componentDoc);
    return gulp.src(componentOrg)
      // Remove bad tags
      .pipe(replace(/^.*<(!doctype|\/?html|\/?head|\/?body|meta|title).*>.*\n/img, ''))
      // Uncomment metainfo
      .pipe(replace(/^.*<!--[ \n]+([\s\S]*?title:[\s\S]*?)[ \n]+-->.*\n/img, '---\n$1\n---\n'))
      // Remove Analytics
      .pipe(replace(/^.*<script.*?ga\.js[\"'].*?<\/script>\s*?\n?/img, ''))
      // Adjust location of the current component in bower_components (..)
      .pipe(replace(/(src|href)=("|')\.\.(\/\w)/mg, '$1=$2../bower_components/' + n + '$3'))
      // Adjust location of dependencies in bower_components (../..)
      .pipe(replace(/(src|href)=("|')(.*?)\.\.\/\.\.\//mg, '$1=$2../bower_components/'))
      // Remove the section with table-of-contents
      .pipe(replace(/^.*<section>[\s\S]*?table-of-contents[\s\S]*?<\/section>.*\n/im, ''))
      // Add ids to headers, so as site configures permalinks
      .pipe(replace(/<h(\d+)>(.*)(<\/h\d+>)/img, function($0, $1, $2, $3){
        var id = $2.trim().toLowerCase().replace(/[^\w]+/g,'_');
        return '<h' + $1 + ' id="' + id + '">' + $2 + $3;
      }))

      .pipe(gulp.dest(componentDoc));
  });
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
          host: host,
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
