const rollup = require("rollup");
const dts = require("rollup-plugin-dts");
const {rootDir} = require('./paths')

async function bundleDeclaration() {
  const bundle = await rollup.rollup({
    input: `${rootDir}/package/esm/types/index.d.ts`,
    plugins: [dts.default()]
  });
  await bundle.write({
    file: `${rootDir}/package/index.d.ts`,
    format: "esm"
  })
}

module.exports = {
  bundleDeclaration
}
