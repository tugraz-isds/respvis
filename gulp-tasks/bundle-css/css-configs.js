const {libsDepsDir, exampleDirList, srcDir, rootDir} = require("../paths");
const {modules} = require("../bundle-js/bundle-configs");

const singleModuleConfigs = modules.map(module => {
  return {
    module,
    src: `${srcDir}/css/${module}`,
    target: [`${rootDir}/package/${module}/${module}.css`],
  }
})

const srcLibsPaths = {
  src: `${libsDepsDir}/**/*`,
  target: exampleDirList.map((dir) => `${dir}/libs`)
}


module.exports = {
  singleModuleConfigs
}
