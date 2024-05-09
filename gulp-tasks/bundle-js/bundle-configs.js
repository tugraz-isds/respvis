const {rootDir} = require("../paths");

const respvisBundleConfig = {
  entryFile: `${rootDir}/src/lib/index.ts`,
  include: ["src/lib/**/*", "module-specs.d.ts"],
  exclude: ["node_modules", "dist", "**/*.spec.ts", "src/stories", "src/examples"],
  outputDirectory: `${rootDir}/package/respvis`,
  replaceAliases: true
}

const modules = ['respvis-core', 'respvis-bar', 'respvis-cartesian', 'respvis-line', 'respvis-parcoord', 'respvis-point', 'respvis-tooltip']


const singleBundleConfigs = modules.map(currentModule => {
  return {
    entryFile: `${rootDir}/src/lib/${currentModule}/index.ts`,
    include: ["src/lib/**/*", "module-specs.d.ts"],
    exclude: ["node_modules", "dist", "**/*.spec.ts", "src/stories"],
    outputDirectory: `${rootDir}/package/${currentModule}`,
    external: modules.filter(module => module !== currentModule)
  }
})

const allBundlesConfigsBase = [respvisBundleConfig, ...singleBundleConfigs]

module.exports = {
  respvisBundleConfig,
  allBundlesConfigsBase
}
