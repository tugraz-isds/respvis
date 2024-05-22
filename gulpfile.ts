import gulp from 'gulp';
import del from "del";
import {copyExampleDependencies} from "./gulp-tasks/copy-example-dependencies/copyExampleDependencies";
import {bundleJS} from "./gulp-tasks/bundle-js/bundleJS";
import {buildLibCSS} from "./gulp-tasks/bundle-css/buildCSS";
import {copyExamples} from "./gulp-tasks/copyExamples";
import {watcher} from "./gulp-tasks/watcher";
import {cleanExampleDependencies} from "./gulp-tasks/cleanExampleDependencies";
import {genSVGDataURIs} from "./gulp-tasks/genSVGDataURIs";
import {absolutePaths} from "./gulp-tasks/paths/absolute-paths";

const {iconsDir, gulpUtilGenerated} = absolutePaths

const mode = process.argv.includes('--dev') ? 'dev' : 'prod'
const envFile = '.env.' + mode
require('dotenv').config({path: envFile})

function cleanDist() {
  return del('dist', { force: true });
}

function cleanPackages() {
  const singlePackagePaths = Object.values(absolutePaths.respVisModulesPaths)
    .map(path => `${path}/package`)
  const extensivePackagePath = 'package'
  return del([...singlePackagePaths, extensivePackagePath], { force: true });
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

exports.clean = gulp.parallel(cleanDist, cleanPackages, exports.cleanExampleDeps)
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
