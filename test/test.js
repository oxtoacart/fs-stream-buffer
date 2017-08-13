const fsb           = require('../index.js'),
      fs            = require('fs'),
      tmp           = require('tmp'),
      hasha         = require('hasha'),
      child_process = require('child_process');

describe('#wrap()', function() {
  it('should wrap without error', function(done) {
    this.timeout(60000);
    tmp.tmpName(function(err, randomFile) {
      if (err) {
        done(err);
        return;
      }

      // Generate a 20 MB random file
      child_process.execSync('dd if=/dev/urandom of="' + randomFile + '" bs=65536 count=320');
      var input = fs.createReadStream(randomFile);
      tmp.tmpName(function (err, path) {
        if (err) {
          done(err);
          fs.unlink(randomFile, function() {});
          return;
        }

        var output = fs.createWriteStream(path);
        fsb(input, function(wrapped) {
          wrapped.pipe(output).on('finish', function() {
            hasha.fromFile(randomFile, {algorithm: 'sha256'}).then(expectedHash => {
              hasha.fromFile(path, {algorithm: 'sha256'}).then(actualHash => {
                var err = null;
                if (actualHash !== expectedHash) {
                  err = "Hash mismatch!";
                }
                console.log(path);
                done(err);
              });
            });
          }).on('error', function(err) {
            fs.unlink(path, function() {});
            fs.unlink(randomFile, function() {});
            done(err);
          });
        });
      });
    });
  });
});
