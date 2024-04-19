const {libsPaths} = require("./copyPathLibs");
const del = require('del');
const {dataPaths} = require("./copyPathData");
const {respvisDepsDir, utilDepsDir} = require("./paths");


function cleanExampleDependencies() {
  const delDataTargetDirs = del(dataPaths.map(dataPath => dataPath.target).flat(), { force: true })
  const delLibsTargetDirs = del(libsPaths.target, { force: true })
  const delSourceDirs = del([respvisDepsDir, utilDepsDir], { force: true })
  return Promise.all([delDataTargetDirs, delLibsTargetDirs, delSourceDirs])
}

module.exports = {
  cleanExampleDependencies
}
