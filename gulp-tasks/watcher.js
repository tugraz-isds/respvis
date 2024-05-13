const gulp = require("gulp");
const browserSync = require('browser-sync').create();
const {bundleJS} = require("./bundle-js/bundleJS");
const {copyExampleDependencies} = require("./copy-example-dependencies/copyExampleDependencies");
const {buildLibCSS} = require("./buildCSS");
const {copyExamples} = require("./copyExamples");
const {rootDir, srcDir, exampleDir} = require('./paths')


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
  gulp.watch([`${srcDir}/ts/**/*`, `${srcDir}/assets/**/*`], watchOptions,
    gulp.series(bundleJS, copyExampleDependencies, reloadBrowser));

  gulp.watch(`${exampleDir}/**/*`, watchOptions, gulp.series(copyExamples, reloadBrowser));

  const cssLibWatcher = gulp.watch([`${srcDir}/css/**/*.css`, `${srcDir}/*.css`], watchOptions);
  cssLibWatcher.on('change', async (fileName) => {
    await buildLibCSS()
    copyExampleDependencies()
  })
  cb()
}

module.exports = {
  watcher
}
