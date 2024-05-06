const rollup = require("rollup");
const dts = require("rollup-plugin-dts");
const {rootDir} = require('./paths')

async function bundleDeclaration() {
  await Promise.all([bundleDeclarationByDepsType('standalone'),
    ...(process.env.MODE === 'prod' ? [bundleDeclarationByDepsType('dependency-based')] : [])
  ])
}

async function bundleDeclarationByDepsType(depsType) {
  const bundle = await rollup.rollup({
    input: `${rootDir}/package/respvis/${depsType}/esm/types/index.d.ts`,
    plugins: [dts.default()]
  });
  await bundle.write({
    file: `${rootDir}/package/respvis/${depsType}/respvis.d.ts`,
    format: "esm"
  })
}

module.exports = {
  bundleDeclaration
}
