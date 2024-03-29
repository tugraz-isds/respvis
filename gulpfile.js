const gulp = require('gulp');
const del = require('del');

const {copyExampleDependencies} = require("./gulp-tasks/copyExampleDependencies");
const {createExampleDependencies} = require("./gulp-tasks/createExampleDependencies");
const {bundleJSProduction} = require("./gulp-tasks/bundleJS");
const {bundleDeclaration} = require("./gulp-tasks/bundleDeclaration");
const {buildLibSCSS} = require("./gulp-tasks/buildSCSS");
const {copyExamples} = require("./gulp-tasks/copyExamples");
const {watcher} = require("./gulp-tasks/watcher");

function cleanDist() {
  return del('dist', { force: true });
}

function cleanPackage() {
  return del('package', { force: true });
}

// # Public tasks

exports.clean = gulp.parallel(cleanDist, cleanPackage);

// TODO: add proxy respvis.js for typescript support in all concerned directories
exports.build = gulp.series(
  exports.clean,
  gulp.parallel(
    gulp.series(bundleJSProduction, bundleDeclaration),
    buildLibSCSS
  ),
  createExampleDependencies,
  copyExampleDependencies,
  copyExamples
);


exports.serve = gulp.series(exports.build, watcher)

exports.default = exports.serve;
