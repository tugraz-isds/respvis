const gulp = require('gulp');
const del = require('del');

const {copyExampleDependencies} = require("./gulp-tasks/copyExampleDependencies");
const {createExampleDependencies} = require("./gulp-tasks/createExampleDependencies");
const {bundleJS} = require("./gulp-tasks/bundleJS");
const {bundleDeclaration} = require("./gulp-tasks/bundleDeclaration");
const {buildLibSCSS} = require("./gulp-tasks/buildSCSS");
const {copyExamples} = require("./gulp-tasks/copyExamples");
const {watcher} = require("./gulp-tasks/watcher");
const {cleanExampleDependencies} = require("./gulp-tasks/cleanExampleDependencies")
const {genBase64SVGs} = require("./gulp-tasks/genBase64SVGs");
const {iconsDir, utilDepsDir} = require("./gulp-tasks/paths");

const mode = process.argv.includes('--dev') ? 'dev' : 'prod'
const envFile = '.env.' + mode
require('dotenv').config({path: envFile})

function cleanDist() {
  return del('dist', { force: true });
}

function cleanPackage() {
  return del('package', { force: true });
}

function cleanPackageLock() {
  return del('package-lock.json', { force: true });
}

function cleanNodeModules() {
  return del('node_modules', { force: true });
}

// # Public tasks

exports.genBase64 = gulp.series(() => genBase64SVGs(`${iconsDir}/**/*.svg`, utilDepsDir))

exports.clean = gulp.parallel(cleanDist, cleanPackage)

exports.cleanExampleDeps = gulp.series(cleanExampleDependencies)

exports.cleanAll = gulp.parallel(exports.clean, cleanExampleDependencies, cleanPackageLock, cleanNodeModules)

// TODO: add proxy respvis.js for typescript support in all concerned directories
exports.build = gulp.series(
  exports.clean,
  gulp.parallel(
    gulp.series(bundleJS, bundleDeclaration),
    buildLibSCSS
  ),
  createExampleDependencies,
  copyExampleDependencies,
  copyExamples
);


exports.serve = gulp.series(exports.build, watcher)

exports.default = exports.serve;
