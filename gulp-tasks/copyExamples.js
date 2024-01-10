const gulp = require("gulp");
const {rootDir} = require('./paths')
const ts = require('gulp-typescript');
const replace = require('gulp-replace');

const tsProject = ts.createProject('tsconfig.json', {"target": "ES6"})


function compileTs() {
  return gulp.src('src/examples/**/*.ts')
    .pipe(tsProject())
    .on("error", () => { /* Ignore compiler errors */})
    .js.pipe(gulp.dest('dist'))
}

function copyExamples() { //do not copy ts files to dist
  return gulp.src([`${rootDir}/src/examples/**/*`, `!${rootDir}/src/examples/**/*.ts`])
    .pipe(replace(/import {(.+)} from ["'].\/(.+)\.ts["']/g, 'import {$1} from "./$2.js"'))
    .pipe(gulp.dest(`${rootDir}/dist`));
}

module.exports = {
  copyExamples: gulp.series(compileTs, copyExamples)
}
