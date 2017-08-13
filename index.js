const ts  = require('tailstream'),
      fs  = require('fs'),
      tmp = require('tmp');

module.exports = wrap
module.exports.wrap = wrap

function wrap(stream, cb) {
  // create a temp file for the buffer
  tmp.tmpName(function (err, path) {
    if (err) {
      throw err;
    }
    // tail the temp file
    var wrapped = ts.createReadStream(path);
    wrapped.on('close', function() {
      // when finished with the buffered stream, delete the temp file
      fs.unlink(path, function() {});
    });
    stream.pipe(fs.createWriteStream(path)).on('finish', function() {
      // when finished reading from the original stream, stop tailing
      wrapped.done();
    }).on('error', function(err) {
      // when errored reading from the original stream, stop tailing
      wrapped.done();
    });
    cb(wrapped);
  });
}
