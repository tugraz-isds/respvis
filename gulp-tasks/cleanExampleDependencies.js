const {libsPaths} = require("./copyPathLibs");
const del = require('del');
const {dataPaths} = require("./copyPathData");


function cleanExampleDependencies() {
  const delDataDirs = del(dataPaths.map(dataPath => dataPath.target).flat(), { force: true })
  const delLibsDirs = del(libsPaths.target, { force: true })
  return Promise.all([delDataDirs, delLibsDirs])
}

module.exports = {
  cleanExampleDependencies
}
