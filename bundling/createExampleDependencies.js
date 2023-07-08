const gulp = require("gulp");
const {libsDepsDir} = require('./paths')

function createExampleDependencies() {
  return gulp.src('./package/esm/respvis.js').pipe(gulp.dest(`${libsDepsDir}/respvis`));
}

module.exports = {
  createExampleDependencies
}
