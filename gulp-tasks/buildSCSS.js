const del = require("del");
const gulp = require("gulp");
const sass = require('gulp-sass')(require('sass'));
const rename = require('gulp-rename');
const path = require('path');


//source is the filename of the scss file to be compiled. targetDir is the targetDirectory for the css file
async function compileSCSSToCSS(source, targetDir) {
  const srcPosix = source.split(path.sep).join(path.posix.sep)
  const srcDirNamePosix = path.dirname(srcPosix)
  const fileNameScss = source.split(path.sep)[source.split(path.sep).length - 1]
  const fileNameCss = fileNameScss.substring(0, fileNameScss.length - 4) + 'css';


  const targetDirNamePosix = targetDir ? targetDir.split(path.sep).join(path.posix.sep) : srcDirNamePosix
  const targetPosix = [targetDirNamePosix, fileNameScss].join(path.posix.sep)
  const targetCSSFilePosix = targetPosix.substring(0, targetPosix.length - 4) + 'css';

  await del(targetCSSFilePosix, { force: true })

  return {
    pipe: gulp.src(srcPosix)
      .pipe(sass().on('error', sass.logError))
      .pipe(rename(fileNameCss))
      .pipe(gulp.dest(targetDirNamePosix)),
    cssFilePosix: targetCSSFilePosix, dirNamePosix: srcDirNamePosix, fileNamePosix: srcPosix
  }
}

async function buildExamplesSCSS(filename) {
  const { pipe } = await compileSCSSToCSS(filename)
  await new Promise((resolve) => {
    pipe.on('end', () => {
      resolve()
    })
  })
}

async function buildLibSCSS() {
  const { pipe } = await compileSCSSToCSS('./src/respvis.scss', './package')
  await new Promise((resolve) => {
    pipe.on('end', () => {
      resolve()
    })
  })
}

module.exports = {
  buildLibSCSS,
  buildExamplesSCSS
}
