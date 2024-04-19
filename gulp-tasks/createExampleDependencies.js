const gulp = require("gulp");
const mergeStream = require('merge-stream')
const {respvisDepsDir} = require('./paths')

function createExampleDependencies() {
  return mergeStream([createGlobalStyleDependency(), ...createRespvisDependencies()])
}

function createRespvisDependencies() {
  return [
    gulp.src('./package/standalone/esm/respvis.js').pipe(gulp.dest(`${respvisDepsDir}`)),
    gulp.src('./package/standalone/respvis.d.ts').pipe(gulp.dest(`${respvisDepsDir}`))
  ];
}

function createGlobalStyleDependency() {
  return gulp.src('./package/respvis.css').pipe(gulp.dest(`${respvisDepsDir}`));
}

module.exports = {
  createExampleDependencies
}
