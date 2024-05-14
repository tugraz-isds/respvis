import gulp from "gulp";
import {respvisModuleConfigCSS, singleModuleConfigsCSS} from "./css-configs";
import {writeStreamToPromise} from "../util/stream-to-promise";

const cssimport = require("gulp-cssimport");
const rename = require("gulp-rename");

export async function buildLibCSS() {
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
