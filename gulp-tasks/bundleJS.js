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
    // external: ['d3']
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
      inlineDynamicImports: true,
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
