import gulp from "gulp";
import {bundleJs} from "./bundle-js/bundle-js";
import {copyExampleDependencies} from "./copy-example-dependencies/copy-example-dependencies";
import {buildLibCSS} from "./bundle-css/build-css";
import {copyExamples} from "./copy-examples";
import {absolutePaths} from "./paths/absolute-paths";
import {create} from "browser-sync";

const browserSync = create();
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
    gulp.series(bundleJs, copyExampleDependencies, reloadBrowser));

  gulp.watch(`${exampleDir}/**/*`, watchOptions, gulp.series(copyExamples, reloadBrowser));

  const cssLibWatcher = gulp.watch([`${srcDir}/css/**/*.css`, `${srcDir}/*.css`], watchOptions);
  cssLibWatcher.on('change', async (fileName) => {
    await buildLibCSS()
    copyExampleDependencies()
  })
  cb()
}
