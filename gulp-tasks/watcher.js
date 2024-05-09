const gulp = require("gulp");
const browserSync = require('browser-sync').create();
const {bundleJS} = require("./bundle-js/bundleJS");
const {createExampleDependencies} = require("./createExampleDependencies");
const {copyExampleDependencies} = require("./copyExampleDependencies");
const {buildLibCSS} = require("./buildCSS");
const {copyExamples} = require("./copyExamples");
const {rootDir} = require('./paths')


function reloadBrowser(cb) {
  browserSync.reload();
  cb();
}
function watcher(cb) {
  browserSync.init({
    server: `${rootDir}/dist`,
    startPath: '/',
  });

  const watchOptions = { ignoreInitial: true };
  gulp.watch(`${rootDir}/src/lib/**/*`, watchOptions,
    gulp.series(bundleJS, createExampleDependencies, copyExampleDependencies, reloadBrowser));

  gulp.watch(`${rootDir}/src/examples/**/*`, watchOptions, gulp.series(copyExamples, reloadBrowser));

  const cssLibWatcher = gulp.watch([`${rootDir}/src/css/**/*.css`, `${rootDir}/src/*.css`], watchOptions);
  cssLibWatcher.on('change', async (fileName) => {
    await buildLibCSS()
    gulp.series(buildLibCSS)
    createExampleDependencies().on('finish', () => {
      copyExampleDependencies()
    })
  })

  cb()
}

module.exports = {
  watcher
}
