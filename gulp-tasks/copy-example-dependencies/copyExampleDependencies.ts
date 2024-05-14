const gulp = require("gulp");
const mergeStream = require('merge-stream')
const { dataPaths} = require('./copyPathData')
const { libsPaths, dependencyBasedLibPaths} = require('./copyPathLibs')

function copyExampleDependencies() {
  return mergeStream([...copyFiles(dataPaths), ...copyFiles(libsPaths),
    ...copyFiles(dependencyBasedLibPaths)
  ])
}

function copyFiles(srcTargetsMapping) {
  return srcTargetsMapping.map(mapping => {
    return mapping.target.map((target) => gulp.src(mapping.src).pipe(gulp.dest(target)))
  }).flat()
}

module.exports = {
  copyExampleDependencies
}
