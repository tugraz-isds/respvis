import {absolutePaths} from "../paths/absolute-paths";
import {respvisModules} from "../constants/modules";

const {srcDir, rootDir} = absolutePaths

export const singleModuleConfigsCSS = respvisModules.map(module => {
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
