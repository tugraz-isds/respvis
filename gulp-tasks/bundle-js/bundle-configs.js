const {rootDir} = require("../paths");

const respvisBundleConfig = {
  entryFile: `${rootDir}/src/lib/index.ts`,
  include: ["src/lib/**/*", "module-specs.d.ts"],
  exclude: ["node_modules", "dist", "**/*.spec.ts", "src/stories", "src/examples"],
  outputDirectory: `${rootDir}/package/respvis`,
  replaceAliases: true
}

const modules = ['bar', 'cartesian', 'respvis-core', 'line', 'parcoord', 'point', 'tooltip']
// const modulesPath = `src/lib`

const modulePathsExceptBar = modules.filter(module => module !== 'bar')//.map(module => `${modulesPath}/${module}`)
const barBundleConfig = {
  entryFile: `${rootDir}/src/lib/bar/index.ts`,
  include: ["src/lib/**/*", "module-specs.d.ts"],
  exclude: ["node_modules", "dist", "**/*.spec.ts", "src/stories"],
  outputDirectory: `${rootDir}/package/respvis-bar`,
  external: modulePathsExceptBar
}


const allBundlesConfigsBase = [respvisBundleConfig, barBundleConfig]


module.exports = {
  respvisBundleConfig,
  allBundlesConfigsBase
}
