const rollup = require("rollup");
const {default: rollupNodeResolve} = require("@rollup/plugin-node-resolve");
const rollupCommonJs = require("@rollup/plugin-commonjs");
const rollupTypescript = require("@rollup/plugin-typescript");
const rollupTerser = require("@rollup/plugin-terser");
const {default: rollupGzip} = require("rollup-plugin-gzip");
const fs = require("fs");
const {rootDir} = require('../paths')
const {stripCode} = require('../rollup-plugin/codeStripPlugin');
const {string} = require("rollup-plugin-string");
const {allBundlesConfigsBase, respvisBundleConfig} = require('./bundle-configs')
const typescript = require('typescript')

async function bundleJS() {
  if (process.env.MODE === 'dev') await bundleJSDevelopment()
  else {
    const allBundleConfigDependencyBased = allBundlesConfigsBase.map(config => {
      const external = config.external ? [...config.external, 'd3'] : ['d3']
      return {...config, external}
    })
    const allBundleConfigStandalone = allBundlesConfigsBase.map(config => {
      return {...config, external: undefined}
    })
    const allBundleConfigs = [...allBundleConfigDependencyBased, ...allBundleConfigStandalone]
    // splitting necessary to not overload heap //increase optionally heap for node process
    await bundleJSProduction([...allBundleConfigDependencyBased.slice(0, 1), ...allBundleConfigStandalone.slice(0, 1)])
    await bundleJSProduction([...allBundleConfigDependencyBased.slice(1, 2), ...allBundleConfigStandalone.slice(1, 2)])
    await bundleJSProduction([...allBundleConfigDependencyBased.slice(2, 5), ...allBundleConfigStandalone.slice(2, 5)])
    await bundleJSProduction([...allBundleConfigDependencyBased.slice(5), ...allBundleConfigStandalone.slice(5)])
  }
}

async function bundleJSDevelopment() {
  const bundle = await getRollupBundle(respvisBundleConfig)
  return Promise.all(writeBundle(bundle, [
    {extension: 'js', plugins: [], location: `${rootDir}/package/respvis/standalone/esm`, format: 'esm'},
  ]))
}

/**
 * @typedef {Object} BundleJsConfig
 * @property {string} entryFile - Entry File.
 * @property {string[]} include - Include Globs.
 * @property {string[]} exclude - Exclude Globs.
 * @property {string} outputDirectory - Output Directory.
 * @property {string[]} external - External Dependencies.
 * @property {boolean} replaceAliases - Replace Aliases with relative paths (for entire code bundle).
 */

async function bundleJSProduction(allBundleConfigs) {
  const allBundles = await Promise.all(allBundleConfigs.map(getRollupBundle))

  const minPlugins = [rollupTerser()]
  const gzPlugins = [rollupTerser(), rollupGzip()]
  const formats = ['esm', 'cjs', 'iife']

  const writeBundles = allBundles.map((bundle, index) => {
    const writeConfigs = formats.map(format => {
      const bundleConfig = allBundleConfigs[index]
      const dependencyType = bundleConfig.external && bundleConfig.external.length > 0 ? 'dependency-based' : 'standalone'
      const location = `${bundleConfig.outputDirectory}/${dependencyType}/${format}`
      return [
        {extension: 'js', plugins: [], location, format},
        {extension: 'min.js', plugins: minPlugins, location, format},
        {extension: 'min.js', plugins: gzPlugins, location, format}
      ]
    }).flat()
    return writeBundle(bundle, writeConfigs)
  }).flat()
  return Promise.all(writeBundles)
}

/**
 // * @param {RollupOptions} options - Overwrite default rollup bundle options.
 * @param {BundleJsConfig} config - Additional config options.
 */
async function getRollupBundle(config) {
  return await rollup.rollup({
    input: config.entryFile,
    plugins: [
      rollupNodeResolve({browser: true}),
      rollupCommonJs(),
      string({include: "**/*.svg"}),
      rollupTypescript({
        typescript: typescript,
        tsconfig: `${rootDir}/tsconfig.json`,
        include: config.include ?? ["src/lib/**/*", "module-specs.d.ts"],
        exclude: config.exclude ?? ["node_modules", "dist", "**/*.spec.ts", "src/stories"],
        compilerOptions: {
          plugins: [
            ...(config.replaceAliases ? [{ "transform": "typescript-transform-paths", "afterDeclarations": true }] : [])
          ]
        }
      }),
      process.env.STRIP_CODE === 'true' ? stripCode({
        startComment: '/* DEV_MODE_ONLY_START */',
        endComment: '/* DEV_MODE_ONLY_END */'
      }) : null,
    ].filter(plugin => plugin),
    ...(config.external ? {external: config.external} : {})
  })
}

/**
 * @typedef {Object} WriteConfig
 * @property {'js' | 'min.js'} extension - File extension of bundled file.
 * @property {OutputPluginOption} plugins - Plugins.
 * @property {string} location - Path to generate to.
 * @property {'esm' | 'iife' | 'cjs'} format - The bundling format.
 */

/**
 * Concatenates two strings.
 * @param {RollupBuild} bundle - Rollup bundle Object.
 * @param {WriteConfig[]} writeConfigurations - Writeconfigurations.
 */
function writeBundle(bundle, writeConfigurations) {
  return writeConfigurations.map((c) => bundle.write({
    file: `${c.location}/respvis.${c.extension}`,
    format: c.format,
    name: 'respVis',
    plugins: c.plugins,
    sourcemap: true,
    inlineDynamicImports: true,
    globals: {
      d3: 'd3',
      'respvis-bar': 'respvis-bar',
      'respvis-cartesian': 'respvis-cartesian',
      'respvis-core': 'respvis-core',
      'respvis-line': 'respvis-line',
      'respvis-parcoord': 'respvis-parcoord',
      'respvis-point': 'respvis-point',
      'respvis-tooltip': 'respvis-tooltip',
    }
  }).then(() => {
    const fileData = fs.readFileSync(`${c.location}/respvis.${c.extension}`, 'utf8');
    const formatString = c.format === 'iife' ? 'IIFE' :
      c.format === 'esm' ? 'ESM' :
        c.format === 'cjs' ? 'CommonJS' : ''
    const dataWithHeaderLine = `// RespVis version 2.0 ${formatString}\n` + fileData
    fs.writeFileSync(`${c.location}/respvis.${c.extension}`, dataWithHeaderLine, 'utf8');
  }))
}

module.exports = {
  bundleJS
}
