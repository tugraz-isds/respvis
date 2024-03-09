function stripCode(options = {}) {
  const startComment = options.startComment || '/* START_REMOVE_CODE */';
  const endComment = options.endComment || '/* END_REMOVE_CODE */';

  return {
    name: 'stripCode',

    transform(code, id) {
      if (!id.endsWith('.ts')) {
        return null; // Skip non-Typescript files
      }

      const lines = code.split('\n');
      let inRemoveSection = false;

      const modifiedCode = lines
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

      return {
        code: modifiedCode,
        map: null, // You can add source maps if needed
      };
    },
  };
}

module.exports = {
  stripCode
};
