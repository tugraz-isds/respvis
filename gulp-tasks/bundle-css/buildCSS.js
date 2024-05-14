const gulp = require("gulp");
const cssimport = require("gulp-cssimport");
const rename = require("gulp-rename");
const {singleModuleConfigsCSS, respvisModuleConfigCSS} = require("./css-configs");
const {writeStreamToPromise} = require("../util/stream-to-promise");

async function buildLibCSS() {
  const configs = [respvisModuleConfigCSS,
    ...(process.env.LIVE_SERVER === 'true' ? [] : singleModuleConfigsCSS)]

  const cssBuildProms = configs.map(config => {
    const writeStream = gulp.dest(config.target)
    gulp.src(config.src)
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
