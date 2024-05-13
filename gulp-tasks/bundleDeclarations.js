const rollup = require("rollup");
const {src, dest} = require("gulp")
const dts = require("rollup-plugin-dts");
const {string} = require("rollup-plugin-string");
const {moduleNames} = require("./bundle-js/bundle-configs");
const del = require("del");
const {writeStreamToPromise} = require("./util/stream-to-promise");

async function bundleDeclarations(declarationConfigs) {
  await Promise.all(declarationConfigs.map(reduceToRelevantTypesOnly))
  await Promise.all(declarationConfigs.map(bundleDeclarationByLocation))
  return Promise.all(declarationConfigs.map(config => del(`${config.location}/types`)))
}

async function reduceToRelevantTypesOnly(declarationConfig) {
  const {location, module, dependencyType} = declarationConfig
  if (module === 'respvis' || dependencyType === 'standalone') return Promise.resolve()
  const typePath = `${location}/types`
  const tempTypePath = `${location}/types-temp`
  const tempTypePathFiles = `${tempTypePath}/**/*`
  const modulePath = `${typePath}/${module}`
  const modulePathFiles = `${modulePath}/**/*`

  const writeToTempStream = dest(tempTypePath)
  src(modulePathFiles).pipe(writeToTempStream)
  await writeStreamToPromise(writeToTempStream)

  await del(typePath)

  const writeToTypeStream = dest(typePath)
  src(tempTypePathFiles).pipe(writeToTypeStream)
  await writeStreamToPromise(writeToTypeStream)

  await del(tempTypePath)
}

async function bundleDeclarationByLocation(declarationConfig) {
  const {location, format, module} = declarationConfig
  const bundle = await rollup.rollup({
    input: `${location}/types/index.d.ts`,
    plugins: [
      string({ include: "**/*.svg" }),
      dts.default()
    ],
    external: moduleNames
  });
  await bundle.write({
    file: `${location}/${module}.d.ts`,
    format,
    globals: moduleNames
  })
}

module.exports = {
  bundleDeclarations
}
