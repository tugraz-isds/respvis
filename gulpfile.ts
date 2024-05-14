import gulp from 'gulp';
import del from "del";

const {copyExampleDependencies} = require("./gulp-tasks/copy-example-dependencies/copyExampleDependencies");
const {bundleJS} = require("./gulp-tasks/bundle-js/bundleJS");
const {buildLibCSS} = require("./gulp-tasks/bundle-css/buildCSS");
const {copyExamples} = require("./gulp-tasks/copyExamples");
const {watcher} = require("./gulp-tasks/watcher");
const {cleanExampleDependencies} = require("./gulp-tasks/cleanExampleDependencies")
const {genSVGDataURIs} = require("./gulp-tasks/genSVGDataURIs");
const {iconsDir, gulpUtilGenerated} = require("./gulp-tasks/paths");

const mode = process.argv.includes('--dev') ? 'dev' : 'prod'
const envFile = '.env.' + mode
require('dotenv').config({path: envFile})

function cleanDist() {
  return del('dist', { force: true });
}

function cleanPackage() {
  return del('package', { force: true });
}

function cleanPackageLive() {
  return del('package/respvis', { force: true });
}

function cleanPackageLock() {
  return del('package-lock.json', { force: true });
}

function cleanNodeModules() {
  return del('node_modules', { force: true });
}

function setEnvLive(cb) {
  process.env.LIVE_SERVER = 'true'
  cb()
}

// # Public tasks

exports.genSVGDataURI = gulp.series(() => genSVGDataURIs(`${iconsDir}/**/*.svg`, gulpUtilGenerated))

exports.cleanExampleDeps = gulp.series(cleanExampleDependencies)

exports.clean = gulp.parallel(cleanDist, cleanPackage, exports.cleanExampleDeps)
const cleanLive = gulp.parallel(cleanDist, cleanPackageLive, exports.cleanExampleDeps )

exports.cleanAll = gulp.parallel(exports.clean, cleanPackageLock, cleanNodeModules)

const buildOnly = gulp.series(
  gulp.parallel(
    bundleJS,
    buildLibCSS
  ),
  copyExampleDependencies,
  copyExamples
)

const buildLive = gulp.series(setEnvLive, cleanLive, buildOnly)

exports.build = gulp.series(exports.clean, buildOnly)

exports.serve = gulp.series(buildLive, watcher)

exports.default = exports.serve;
