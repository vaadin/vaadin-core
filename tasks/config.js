var args = require('yargs').argv;
var fs = require('fs');

var userhome = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;

module.exports = {
  components: ['vaadin-grid'],
  snapshotVersion: 'master',
  version: args.version || this.snapshotVersion,
  paths: {
    staging: {
      bower: 'target/bower',
      cdn: 'target/cdn',
      zip: 'target/zip'
    },
    userhome: userhome,
    privateKey: function() {
      try {
        return fs.readFileSync(userhome + '/.ssh/id_rsa');
      } catch(error) {
        return fs.readFileSync(userhome + '/.ssh/id_dsa');
      }
    }
  }
};
