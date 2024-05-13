const gulp = require("gulp");
const cssimport = require("gulp-cssimport");
const rename = require("gulp-rename");
const {srcDir, rootDir} = require("../paths");
const {singleModuleConfigs} = require("./css-configs");
const {writeStreamToPromise} = require("../util/stream-to-promise");

async function buildLibCSS() {
  const cssBuildProms = singleModuleConfigs.map(config => {
    const cssPath = `${srcDir}/respvis.css`
    const writeStream = gulp.dest(`${rootDir}/package/${config.module}`)
    gulp.src(cssPath)
      .pipe(cssimport())
      .pipe(rename(`${config.module}.css`))
      .pipe(writeStream)
    return writeStreamToPromise(writeStream)
  })
  return await Promise.all(cssBuildProms)
}

module.exports = {
  buildLibCSS
}
