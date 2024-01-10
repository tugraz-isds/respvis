const gulp = require("gulp");
const mergeStream = require('merge-stream')
const {libsDepsDir, stylesDepsDir} = require('./paths')

function createExampleDependencies() {
  return mergeStream([createGlobalStyleDependency(), ...createRespvisDependencies()])
}

function createRespvisDependencies() {
  return [
    gulp.src('./package/esm/respvis.js').pipe(gulp.dest(`${libsDepsDir}/respvis`)),
    gulp.src('./package/respvis.d.ts').pipe(gulp.dest(`${libsDepsDir}/respvis`))
  ];
}

function createGlobalStyleDependency() {
  return gulp.src('./package/respvis.css').pipe(gulp.dest(`${stylesDepsDir}`));
}

module.exports = {
  createExampleDependencies
}
