const gulp = require("gulp");
const mergeStream = require('merge-stream')
const {libsDepsDir} = require('./paths')

function createExampleDependencies() {
  return mergeStream([createGlobalStyleDependency(), ...createRespvisDependencies()])
}

function createRespvisDependencies() {
  return [
    gulp.src('./package/standalone/esm/respvis.js').pipe(gulp.dest(`${libsDepsDir}/respvis`)),
    gulp.src('./package/standalone/respvis.d.ts').pipe(gulp.dest(`${libsDepsDir}/respvis`))
  ];
}

function createGlobalStyleDependency() {
  return gulp.src('./package/respvis.css').pipe(gulp.dest(`${libsDepsDir}/respvis`));
}

module.exports = {
  createExampleDependencies
}
