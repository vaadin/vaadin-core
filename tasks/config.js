var args = require('yargs').argv;
var fs = require('fs');

var userhome = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;

module.exports = {
  version: args.version || 'master',
  permalink: args.version ? 'latest' : '',
  toolsHost: args.toolsHostname || 'tools.vaadin.com',
  paths: {
    staging: {
      bower: 'target/bower',
      cdn: 'target/cdn',
      zip: 'target/zip',
      doc: 'target/docsite'
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
