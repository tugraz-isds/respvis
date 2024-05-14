const {rootDir, tsDir} = require("../paths");

const respvisBundleConfig = {
  entryFile: `${tsDir}/index.ts`,
  include: ["src/ts/**/*", "module-specs.d.ts"],
  exclude: ["node_modules", "dist", "**/*.spec.ts", "src/stories", "src/examples"],
  outputDirectory: `${rootDir}/package/respvis`,
  module: 'respvis'
}

const modules = ['respvis-core', 'respvis-bar', 'respvis-cartesian', 'respvis-line', 'respvis-parcoord', 'respvis-point', 'respvis-tooltip']

const moduleNames = modules.reduce((acc, item) => {
  acc[item] = item;
  return acc;
}, {d3: 'd3'});

const singleBundleConfigs = modules.map(currentModule => {
  return {
    entryFile: `${tsDir}/${currentModule}/index.ts`,
    include: [`src/ts/**/*`, `module-specs.d.ts`],
    exclude: ["node_modules", "dist", "**/*.spec.ts", "src/stories"],
    outputDirectory: `${rootDir}/package/${currentModule}`,
    external: modules.filter(module => module !== currentModule),
    module: currentModule
  }
})

const allBundlesConfigsBase = [respvisBundleConfig, ...singleBundleConfigs]

module.exports = {
  respvisBundleConfig,
  allBundlesConfigsBase,
  moduleNames,
  modules
}
