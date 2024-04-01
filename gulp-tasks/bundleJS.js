const rollup = require("rollup");
const {default: rollupNodeResolve} = require("@rollup/plugin-node-resolve");
const rollupCommonJs = require("@rollup/plugin-commonjs");
const rollupTypescript = require("@rollup/plugin-typescript");
const rollupTerser = require("@rollup/plugin-terser");
const {default: rollupGzip} = require("rollup-plugin-gzip");
const fs = require("fs");
const {rootDir} = require('./paths')
const {stripCode} = require('./rollup-plugin/codeStripPlugin');
const { string } = require("rollup-plugin-string");

async function bundleJS() {
  if (process.env.MODE === 'dev') await bundleJSDevelopment()
  else await bundleJSProduction()
}

async function bundleJSDevelopment() {
  const bundle = await getRollupBundle({ standalone: true })
  return Promise.all(writeBundle(bundle, [
    { extension: 'js', plugins: [], location: `${rootDir}/package/standalone/esm` , format: 'esm' },
  ]))
}

async function bundleJSProduction() {
  const [standaloneBundle, dependencyBasedBundle] = await Promise.all([
    getRollupBundle({ standalone: true } ), getRollupBundle({ standalone: false } )
  ])
  const minPlugins = [rollupTerser()]
  const gzPlugins = [rollupTerser(), rollupGzip()]
  const formats = ['esm', 'cjs', 'iife']
  const configsFormatMapped = formats.map(format => [
    { extension: 'js', plugins: [], location: `${rootDir}/package` , format: `${format}` },
    { extension: 'min.js', plugins: minPlugins, location: `${rootDir}/package` , format: `${format}` },
    { extension: 'min.js', plugins: gzPlugins, location: `${rootDir}/package` , format: `${format}` }
  ]).flat()
  const configsStandaloneMapped = configsFormatMapped.map(config => {
    return {...config, location: `${config.location}/standalone/${config.format}`}
  })
  const configsDependencyBasedMapped = configsFormatMapped.map(config => {
    return {...config, location: `${config.location}/dependency-based/${config.format}`}
  })
  return Promise.all([
    ...writeBundle(standaloneBundle, configsStandaloneMapped.flat()),
    ...writeBundle(dependencyBasedBundle, configsDependencyBasedMapped.flat())
  ])
}

/**
 * @typedef {Object} RollupConfig
 * @property {boolean} standalone - Flag for creating standalone bundle.
 */

/**
 * Concatenates two strings.
 * @param {RollupConfig} config - Rollup bundle config.
 */
async function getRollupBundle(config) {
  return await rollup.rollup({
    input: `${rootDir}/src/lib/index.ts`,
    plugins: [
      rollupNodeResolve({ browser: true }),
      rollupCommonJs(),
      string({
        include: "**/*.svg"
      }),
      rollupTypescript({
        tsconfig: `${rootDir}/tsconfig.json`,
      }),
      process.env.STRIP_CODE === 'true' ? stripCode({
        startComment: '/* DEV_MODE_ONLY_START */',
        endComment: '/* DEV_MODE_ONLY_END */'
      }) : null,
    ].filter(plugin => plugin),
    ...(config.standalone ? {} : { external: ['d3'] } )
  });
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
    file:`${c.location}/respvis.${c.extension}`,
    format: c.format,
    name: 'respVis',
    plugins: c.plugins,
    sourcemap: true,
    inlineDynamicImports: true,
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
