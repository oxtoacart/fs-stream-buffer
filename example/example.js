// This example program pipes stdin to stdout via a buffered stream.
// Example Usage: cat "infile.txt" | node example.js > "outfile.txt"
const fsb = require('./index.js');

fsb.wrap(process.stdin, function(wrapped) {
  wrapped.pipe(process.stdout);
});
