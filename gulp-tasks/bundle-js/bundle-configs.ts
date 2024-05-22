import {absolutePaths} from "../paths/absolute-paths";
import {respvisModules} from "../constants/modules";

const {rootDir, packagesDir, respVisModulesPaths} = absolutePaths

export const extensiveBundleConfig = {
  entryFile: `${packagesDir}/index.ts`,
  include: ["src/packages/**/*", "declarations/*.d.ts"],
  exclude: ["node_modules", "dist", "src/stories", "src/examples", "**/package"],
  outputDirectory: `${rootDir}/package`,
  module: 'respvis',
  external: undefined
}

const singleBundleConfigs = respvisModules.map(currentModule => {
  return {
    entryFile: `${respVisModulesPaths[currentModule]}/ts/index.ts`,
    include: [`src/packages/**/*`, "declarations/*.d.ts"],
    exclude: ["node_modules", "dist", "src/stories", "**/package"],
    outputDirectory: `${respVisModulesPaths[currentModule]}/package`,
    external: respvisModules.filter(module => module !== currentModule),
    module: currentModule
  }
})

export const allBundlesConfigsBase = [extensiveBundleConfig, ...singleBundleConfigs]
