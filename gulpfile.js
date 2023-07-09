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

function cleanNodeModules() {
  return del('node_modules', { force: true });
}

// # Public tasks

exports.clean = cleanDist;

exports.cleanAll = gulp.series(cleanDist, cleanNodeModules);

exports.build = gulp.series(
  exports.clean,
  copyExamples, // must be done before bundleJS to replace proxy respvis.js in src/examples/libs/respvis/respvis.js
  gulp.parallel(
    gulp.series(bundleJSProduction, bundleDeclaration),
    buildLibSCSS
  ),
  createExampleDependencies,
  copyExampleDependencies
);


exports.serve = gulp.series(exports.build, watcher)

exports.default = exports.serve;
