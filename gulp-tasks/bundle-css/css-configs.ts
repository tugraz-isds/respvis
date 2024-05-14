import {absolutePaths} from "../paths/absolute-paths";

const {modules} = require("../bundle-js/bundle-configs");

const {srcDir, rootDir} = absolutePaths

export const singleModuleConfigsCSS = modules.map(module => {
  return {
    module,
    src: `${srcDir}/css/${module}/index.css`,
    target: `${rootDir}/package/${module}`,
  }
})

export const respvisModuleConfigCSS = {
  module: 'respvis',
  src: `${srcDir}/css/index.css`,
  target: `${rootDir}/package/respvis`,
}
