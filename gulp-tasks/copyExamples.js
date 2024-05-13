const gulp = require("gulp");
const {rootDir} = require('./paths')
const ts = require('gulp-typescript');
const replace = require('gulp-replace');
const {stripHtml} = require("./gulp-plugin/codeStripPlugin");
const {logger} = require("browser-sync/dist/logger");

const tsProject = ts.createProject('tsconfig.json', {
  "target": "ES6",
  paths: {}
})

function compileTs() {
  return gulp.src('src/examples/**/*.ts')
    .pipe(tsProject())
    .on("error", () => { /* Ignore compiler errors */})
    .js.pipe(gulp.dest('dist'))
}

function copyExamples() { //do not copy ts files to dist
  const exludedGlobs = process.env.MODE === 'prod' ? [
    `!${rootDir}/src/examples/experimental/**`
  ] : []
  return gulp.src([`${rootDir}/src/examples/**/*`,
    `!${rootDir}/src/examples/**/types`,
    `!${rootDir}/src/examples/**/*.ts`,
    ...exludedGlobs])
    .pipe(gulp.dest(`${rootDir}/dist`));
}

function replaceTsImports() {
  //exclude libraries and data files as they have no ts imports and contain very large files (slow down)
  const exludedGlobs = [`!${rootDir}/dist/**/data/**/*`, `!${rootDir}/dist/**/libs/**/*`]
  return gulp.src([`${rootDir}/dist/**/*`, ...exludedGlobs])
    .pipe(replace(/import {(.+)} from ["'].\/(.+)\.ts["']/g, 'import {$1} from "./$2.js"'))
    .pipe(gulp.dest(`${rootDir}/dist`));
}

function stripHTMLDevOnly(cb) {
  if (process.env.MODE === 'prod') {
    return gulp.src('dist/**/*.html')
      .pipe(stripHtml({
        startComment: '<!-- START_DEV_ONLY -->',
        endComment: '<!-- END_DEV_ONLY -->'
      }))
      .pipe(gulp.dest('dist'))
  }
  cb()
}

module.exports = {
  copyExamples: gulp.series(compileTs, copyExamples, replaceTsImports, stripHTMLDevOnly)
}
