import {absolutePaths} from "../paths/absolute-paths";
import {respvisModules} from "../constants/modules";

const {srcDir, rootDir, respVisModulesPaths} = absolutePaths

export const singleModuleConfigsCSS = respvisModules.map(module => {
  return {
    module,
    src: `${respVisModulesPaths[module]}/css/index.css`,
    target: `${respVisModulesPaths[module]}/package`,
  }
})

export const respvisModuleConfigCSS = {
  module: 'respvis',
  src: `${srcDir}/packages/index.css`,
  target: `${rootDir}/package`,
}
