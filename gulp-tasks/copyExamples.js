const gulp = require("gulp");
const {rootDir} = require('./paths')
const ts = require('gulp-typescript');
const replace = require('gulp-replace');
const {stripHtml} = require("./gulp-plugin/codeStripPlugin");

const tsProject = ts.createProject('tsconfig.json', {"target": "ES6"})

function compileTs() {
  return gulp.src('src/examples/**/*.ts')
    .pipe(tsProject())
    .on("error", () => { /* Ignore compiler errors */})
    .js.pipe(gulp.dest('dist'))
}

function stripHTMLDevOnly(cb) {
  if (process.env.MODE === 'prod') {
    return gulp.src('dist/examples/**/*.html')
      .pipe(stripHtml({
        startComment: '<!-- START_REMOVE_CODE -->',
        endComment: '<!-- END_REMOVE_CODE -->'
      }))
      .pipe(gulp.dest('dist'))
  }
  cb()
}

function copyExamples() { //do not copy ts files to dist
  const exludedGlobs = process.env.MODE === 'prod' ? [
    `!${rootDir}/src/examples/experimental`
  ] : []
  return gulp.src([`${rootDir}/src/examples/**/*`, `!${rootDir}/src/examples/**/*.ts`, ...exludedGlobs])
    .pipe(replace(/import {(.+)} from ["'].\/(.+)\.ts["']/g, 'import {$1} from "./$2.js"'))
    .pipe(gulp.dest(`${rootDir}/dist`));
}

module.exports = {
  copyExamples: gulp.series(compileTs, copyExamples, stripHTMLDevOnly)
}
