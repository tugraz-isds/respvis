const rollup = require("rollup");
const dts = require("rollup-plugin-dts");
const {rootDir} = require('./paths')
const {string} = require("rollup-plugin-string");

async function bundleDeclaration() {
  await Promise.all([bundleDeclarationByDepsType('standalone'),
    ...(process.env.MODE === 'prod' ? [bundleDeclarationByDepsType('dependency-based')] : [])
  ])
}

async function bundleDeclarationByDepsType(depsType) {
  const bundle = await rollup.rollup({
    input: `${rootDir}/package/respvis/${depsType}/esm/types/index.d.ts`,
    plugins: [
      string({ include: "**/*.svg" }),
      dts.default()
    ],
    external: {
      d3: 'd3',
      'respvis-core': 'respvis-core',
    }
  });
  await bundle.write({
    file: `${rootDir}/package/respvis/${depsType}/respvis.d.ts`,
    format: "esm",
  })
}

module.exports = {
  bundleDeclaration
}
