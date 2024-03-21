const { Transform } = require('stream');

function stripHtml(options = {}) {
  const startComment = options.startComment || '<!-- START_REMOVE_CODE -->';
  const endComment = options.endComment || '<!-- END_REMOVE_CODE -->';
  console.log(startComment)
  console.log(endComment)
  return new Transform({
    objectMode: true,
    transform(file, encoding, callback) {
      console.log(file.dirname)
      if (file.isNull()) {
        // Pass along empty files
        return callback(null, file);
      }

      if (file.isBuffer()) {
        // Process file buffer
        const contents = file.contents.toString('utf8');
        const lines = contents.split('\n');
        let inRemoveSection = false;

        const modifiedContent = lines
          .filter((line) => {
            if (line.includes(startComment)) {
              inRemoveSection = true;
              return false;
            }

            if (line.includes(endComment)) {
              inRemoveSection = false;
              return false;
            }

            return !inRemoveSection;
          })
          .join('\n');

        file.contents = Buffer.from(modifiedContent, 'utf8');
      }

      if (file.isStream()) {
        // Handle streams if needed
        this.emit('error', new Error('Streams are not supported.'));
        return callback();
      }

      callback(null, file);
    },
  });
}

module.exports = {
  stripHtml
};
