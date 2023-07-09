const gulp = require("gulp");
const mergeStream = require('merge-stream')
const {libsDepsDir, stylesDepsDir} = require('./paths')

function createExampleDependencies() {
  return mergeStream([createGlobalStyleDependency(), createRespvisDependency()])
}

function createRespvisDependency() {
  return gulp.src('./package/esm/respvis.js').pipe(gulp.dest(`${libsDepsDir}/respvis`));
}

function createGlobalStyleDependency() {
  return gulp.src('./package/respvis.css').pipe(gulp.dest(`${stylesDepsDir}`));
}

module.exports = {
  createExampleDependencies
}
