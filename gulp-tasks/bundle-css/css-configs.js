const {srcDir, rootDir} = require("../paths");
const {modules} = require("../bundle-js/bundle-configs");

const singleModuleConfigsCSS = modules.map(module => {
  return {
    module,
    src: `${srcDir}/css/${module}/index.css`,
    target: `${rootDir}/package/${module}`,
  }
})

const respvisModuleConfigCSS = {
  module: 'respvis',
  src: `${srcDir}/css/index.css`,
  target: `${rootDir}/package/respvis`,
}

module.exports = {
  singleModuleConfigsCSS,
  respvisModuleConfigCSS
}
