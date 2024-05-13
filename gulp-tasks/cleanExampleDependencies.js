const {libsPaths} = require("./copy-example-dependencies/copyPathLibs");
const del = require('del');
const {dataPaths} = require("./copy-example-dependencies/copyPathData");
const {gulpUtilGenerated} = require("./paths");


function cleanExampleDependencies() {
  const delDataTargetDirs = del(dataPaths.map(dataPath => dataPath.target).flat(), { force: true })
  const delLibsTargetDirs = del(libsPaths.map(libPath => libPath.target).flat(), { force: true })
  const delSourceDirs = del([gulpUtilGenerated], { force: true })
  return Promise.all([delDataTargetDirs, delLibsTargetDirs, delSourceDirs])
}

module.exports = {
  cleanExampleDependencies
}
