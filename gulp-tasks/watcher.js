const gulp = require("gulp");
const browserSync = require('browser-sync').create();
const {bundleJS} = require("./bundleJS");
const {createExampleDependencies} = require("./createExampleDependencies");
const {copyExampleDependencies} = require("./copyExampleDependencies");
const {buildExamplesSCSS, buildLibSCSS} = require("./buildSCSS");
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

  gulp.watch(`${rootDir}/src/examples/**/*!(.scss)`, watchOptions, gulp.series(copyExamples, reloadBrowser));


  const scssExamplesWatcher = gulp.watch(`${rootDir}/src/examples/**/*.scss`, watchOptions);
  scssExamplesWatcher.on('change', buildExamplesSCSS)

  const scssLibWatcher = gulp.watch([`${rootDir}/src/scss/**/*.scss`, `${rootDir}/src/*.scss`], watchOptions);
  scssLibWatcher.on('change', async (fileName) => {
    await buildLibSCSS(fileName)
    createExampleDependencies().on('finish', () => {
      copyExampleDependencies()
    })
  })

  cb()
}

module.exports = {
  watcher
}
