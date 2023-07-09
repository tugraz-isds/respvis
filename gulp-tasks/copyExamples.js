const gulp = require("gulp");
const {rootDir} = require('./paths')

function copyExamples() {
  return gulp.src(`${rootDir}/src/examples/**/*`).pipe(gulp.dest(`${rootDir}/dist`));
}

module.exports = {
  copyExamples
}
