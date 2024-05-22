import rollup from "rollup";
import {stripCode} from "../rollup-plugin/codeStripPlugin";
import {allBundlesConfigsBase, respvisBundleConfig} from "./bundle-configs";
import rollupNodeResolve from "@rollup/plugin-node-resolve";
import rollupCommonJs from "@rollup/plugin-commonjs";
import rollupTypescript from "@rollup/plugin-typescript";
import rollupTerser from "@rollup/plugin-terser";
import rollupGzip from "rollup-plugin-gzip";
import fs from "fs";
import {string} from "rollup-plugin-string";
import typescript from "typescript";
import {bundleDeclarations} from "../bundleDeclarations";
import {absolutePaths} from "../paths/absolute-paths";
import {modulesMap} from "../constants/modules";

const {rootDir} = absolutePaths


export async function bundleJS() {
  if (process.env.LIVE_SERVER === 'true') await bundleJSLive()
  else {
    const allBundleConfigDependencyBased = allBundlesConfigsBase.map(config => {
      const external = config.external ? [...config.external, 'd3'] : ['d3']
      return {...config, external}
    })
    const allBundleConfigStandalone = allBundlesConfigsBase.map(config => {
      return {...config, external: undefined, replaceAliases: true}
    })
    // splitting necessary to not overload heap //increase optionally heap for node process
    await bundleJSProduction([...allBundleConfigDependencyBased.slice(0, 1), ...allBundleConfigStandalone.slice(0, 1)])
    await bundleJSProduction([...allBundleConfigDependencyBased.slice(1, 2), ...allBundleConfigStandalone.slice(1, 2)])
    await bundleJSProduction([...allBundleConfigDependencyBased.slice(2, 5), ...allBundleConfigStandalone.slice(2, 5)])
    await bundleJSProduction([...allBundleConfigDependencyBased.slice(5), ...allBundleConfigStandalone.slice(5)])
  }
}

async function bundleJSLive() {
  const respvisStandaloneBundleConfig = {...respvisBundleConfig, replaceAliases: true}
  const bundle = await getRollupBundle(respvisStandaloneBundleConfig)
  const declarationConfig = {
    location: `${rootDir}/package/respvis/standalone/esm`,
    format: 'esm',
    module: respvisBundleConfig.module,
    dependencyType: 'standalone'
  }
  await Promise.all(writeBundle(bundle, [
    {extension: 'js', plugins: [], location: declarationConfig.location, format: declarationConfig.format, module: respvisStandaloneBundleConfig.module},
  ]))
  return bundleDeclarations([declarationConfig])
}

/**
 * @typedef {Object} BundleJsConfig
 * @property {string} entryFile - Entry File.
 * @property {string[]} include - Include Globs.
 * @property {string[]} exclude - Exclude Globs.
 * @property {string} outputDirectory - Output Directory.
 * @property {string[]} external - External Dependencies.
 * @property {boolean} replaceAliases - Replace Aliases with relative paths (for entire code bundle).
 * @property {string} module - The name of the bundled module.
 */

async function bundleJSProduction(allBundleConfigs) {
  const allBundles = await Promise.all(allBundleConfigs.map(getRollupBundle))

  const minPlugins = [rollupTerser()]
  const gzPlugins = [rollupTerser(), rollupGzip()]
  const formats = ['esm', 'cjs', 'iife']

  const declarationConfigs = new Set()
  const writeBundles = allBundles.map((bundle, index) => {
    const writeConfigs = formats.map(format => {
      const bundleConfig = allBundleConfigs[index]
      const dependencyType = bundleConfig.external && bundleConfig.external.length > 0 ? 'dependency-based' : 'standalone'
      const location = `${bundleConfig.outputDirectory}/${dependencyType}/${format}`
      const module = bundleConfig.module
      declarationConfigs.add({
        location,
        module: bundleConfig.module,
        format,
        dependencyType
      })
      return [
        {extension: 'js', plugins: [], location, format, module},
        {extension: 'min.js', plugins: minPlugins, location, format, module},
        {extension: 'min.js', plugins: gzPlugins, location, format, module}
      ]
    }).flat()
    return writeBundle(bundle, writeConfigs)
  }).flat()
  await Promise.all(writeBundles)
  return bundleDeclarations(Array.from(declarationConfigs))
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
        include: config.include ?? ["src/ts/**/*", "declarations/*.d.ts"],
        exclude: config.exclude ?? ["node_modules", "dist", "src/stories"],
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
 * @property {string} module - The module name.
 */

/**
 * Concatenates two strings.
 * @param {RollupBuild} bundle - Rollup bundle Object.
 * @param {WriteConfig[]} writeConfigurations - Writeconfigurations.
 */
function writeBundle(bundle, writeConfigurations) {
  return writeConfigurations.map((c) => bundle.write({
    file: `${c.location}/${c.module}.${c.extension}`,
    format: c.format,
    name: 'respvis',
    plugins: c.plugins,
    sourcemap: true,
    inlineDynamicImports: true,
    globals: modulesMap
  }).then(() => {
    const fileData = fs.readFileSync(`${c.location}/${c.module}.${c.extension}`, 'utf8');
    const formatString = c.format === 'iife' ? 'IIFE' :
      c.format === 'esm' ? 'ESM' :
        c.format === 'cjs' ? 'CommonJS' : ''
    const dataWithHeaderLine = `// RespVis version 2.0 ${formatString}\n` + fileData
    fs.writeFileSync(`${c.location}/${c.module}.${c.extension}`, dataWithHeaderLine, 'utf8');
  }))
}
