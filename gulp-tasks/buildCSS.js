const gulp = require("gulp");
const cssimport = require("gulp-cssimport");
const {srcDir, rootDir} = require("./paths");

async function buildLibCSS() {
  return new Promise((resolve, reject) => {
    const cssPath = `${srcDir}/respvis.css`
    return gulp.src(cssPath)
      .pipe(cssimport())
      .pipe(gulp.dest(`${rootDir}/package`))
      .on('end', resolve)
  })

}

module.exports = {
  buildLibCSS
}