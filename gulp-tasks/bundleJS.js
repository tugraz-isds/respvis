const rollup = require("rollup");
const {default: rollupNodeResolve} = require("@rollup/plugin-node-resolve");
const rollupCommonJs = require("@rollup/plugin-commonjs");
const rollupTypescript = require("@rollup/plugin-typescript");
const {terser: rollupTerser} = require("rollup-plugin-terser");
const {default: rollupGzip} = require("rollup-plugin-gzip");
const fs = require("fs");
const {rootDir} = require('./paths')

async function bundleJSDevelopment() {
  await bundleJS("development")
}

async function bundleJSProduction() {
  await bundleJS("production")
}

async function bundleJS(mode) {
  const bundle = await rollup.rollup({
    input: `${rootDir}/src/lib/index.ts`,
    plugins: [
      rollupNodeResolve({ browser: true }),
      rollupCommonJs(),
      rollupTypescript({ tsconfig: `${rootDir}/tsconfig.json` })
    ]
  });

  const minPlugins = [rollupTerser()];
  const gzPlugins = [rollupTerser(), rollupGzip()];

  function write(format) {
    const location = `${rootDir}/package/${format}`
    const writeConfigurationsIIFE = [
      { extension: 'js', plugins: [] },
      { extension: 'min.js', plugins: minPlugins },
      { extension: 'min.js', plugins: gzPlugins },
    ];
    return writeConfigurationsIIFE.map((c) => bundle.write({
      file:`${location}/respvis.${c.extension}`,
      format,
      name: 'respVis',
      plugins: c.plugins,
      sourcemap: true,
    }).then(() => {
      const fileData = fs.readFileSync(`${location}/respvis.${c.extension}`, 'utf8');
      const formatString = format === 'iife' ? 'IIFE' :
        format === 'esm' ? 'ESM' :
          format === 'cjs' ? 'CommonJS' : ''
      const dataWithHeaderLine = `// RespVis version 2.0 ${formatString}\n` + fileData
      fs.writeFileSync(`${location}/respvis.${c.extension}`, dataWithHeaderLine, 'utf8');
    }))
  }

  return Promise.all([
    ...write('esm'),
    ...((mode === 'production') ? [write('iife'), write('cjs')] : [])
  ])
}

module.exports = {
  bundleJSProduction,
  bundleJSDevelopment
}
