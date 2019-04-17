
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const server = require('./server.js');
const options = JSON.parse(process.argv[2]);

// Make sure that the node process is killed when the import process is over.
try {
  server.models.Invoice.import(options.container, options.file, options, err => process.exit(err ? 1 : 0));
} catch (error) {
  const err = error;
  process.exit(err ? 1 : 0);
}
