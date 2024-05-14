import {absolutePaths} from "../paths/absolute-paths";
import {respvisModules} from "../constants/modules";

const {rootDir, tsDir} = absolutePaths

export const respvisBundleConfig = {
  entryFile: `${tsDir}/index.ts`,
  include: ["src/ts/**/*", "module-specs.d.ts"],
  exclude: ["node_modules", "dist", "**/*.spec.ts", "src/stories", "src/examples"],
  outputDirectory: `${rootDir}/package/respvis`,
  module: 'respvis',
  external: undefined
}

const singleBundleConfigs = respvisModules.map(currentModule => {
  return {
    entryFile: `${tsDir}/${currentModule}/index.ts`,
    include: [`src/ts/**/*`, `module-specs.d.ts`],
    exclude: ["node_modules", "dist", "**/*.spec.ts", "src/stories"],
    outputDirectory: `${rootDir}/package/${currentModule}`,
    external: respvisModules.filter(module => module !== currentModule),
    module: currentModule
  }
})

export const allBundlesConfigsBase = [respvisBundleConfig, ...singleBundleConfigs]
