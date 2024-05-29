import gulp from "gulp";
import {stripHtml} from "./gulp-plugin/code-strip-plugin";
import ts from "gulp-typescript";
import replace from "gulp-replace";
import {absolutePaths} from "./paths/absolute-paths";

const {rootDir} = absolutePaths

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

function copyExampleFiles() { //do not copy ts files to dist
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


export const copyExamples = gulp.series(compileTs, copyExampleFiles, replaceTsImports, stripHTMLDevOnly)
