const { dataPaths} = require('./copyPathData')
const { libsPaths} = require('./copyPathLibs')
const gulp = require("gulp");
function copyExampleDependencies() {
  // const appDirPosix = rootDir.split(path.sep).join(path.posix.sep)
  return [...copyExampleDataDependencies(), ...copyExampleLibDependencies()]
}

function copyExampleDataDependencies() {
  return dataPaths.map((dataPath => {
    return dataPath.target.map((target) => gulp.src(dataPath.src).pipe(gulp.dest(target)))
  })).flat()
}

function copyExampleLibDependencies() {
  return libsPaths.target.map((target) => gulp.src(libsPaths.src).pipe(gulp.dest(target)))
}

module.exports = {
  copyExampleDependencies
}
