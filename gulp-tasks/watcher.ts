import gulp from "gulp";
import {bundleJS} from "./bundle-js/bundleJS";
import {copyExampleDependencies} from "./copy-example-dependencies/copyExampleDependencies";
import {buildLibCSS} from "./bundle-css/buildCSS";
import {copyExamples} from "./copyExamples";
import {absolutePaths} from "./paths/absolute-paths";

const browserSync = require('browser-sync').create();
const {rootDir, srcDir, exampleDir} = absolutePaths

function reloadBrowser(cb) {
  browserSync.reload();
  cb();
}

export function watcher(cb) {
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
