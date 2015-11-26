var args = require('yargs').argv;
var _ = require('lodash');
var gutil = require('gulp-util');
var config = require('./config');

function checkArguments(arguments) {
  _.forEach(arguments, function(a) {
    if(!args.hasOwnProperty(a)) {
      throw Error('Required argument \'--'+ a +'\' is missing.');
    }
  });
}

function ssh(user, host, command, done) {
  gutil.log('SSH: ' + host + ' -> ' + command);
  require('node-ssh-exec')({
      host: host,
      username: user,
      privateKey: config.paths.privateKey()
    }, command, done);
}

module.exports = {
  ssh: ssh,
  checkArguments: checkArguments
};
