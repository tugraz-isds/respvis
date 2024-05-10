const gulp = require("gulp");
const mergeStream = require('merge-stream')
const { dataPaths} = require('./copyPathData')
const { libsPaths} = require('./copyPathLibs')

function copyExampleDependencies() {
  return mergeStream([
    ...copyExampleDataDependencies(),
    ...copyExampleLibDependencies()
  ])
}

function copyExampleDataDependencies() {
  return dataPaths.map(dataPath => {
    return dataPath.target.map((target) => gulp.src(dataPath.src).pipe(gulp.dest(target)))
  }).flat()
}

function copyExampleLibDependencies() {
  return libsPaths.map(libPath => {
    return libPath.target.map((target) => gulp.src(libsPaths.src).pipe(gulp.dest(target)))
  }).flat()
}

module.exports = {
  copyExampleDependencies
}
