import {dest, src} from "gulp";
import rollup from "rollup";
import del from "del";
import {moduleNames, modules} from "./bundle-js/bundle-configs";
import {writeStreamToPromise} from "./util/stream-to-promise";

const dts = require("rollup-plugin-dts");
const {string} = require("rollup-plugin-string");

export async function bundleDeclarations(declarationConfigs) {
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
    external: [...modules, 'd3']
  });
  await bundle.write({
    file: `${location}/${module}.d.ts`,
    format,
    globals: moduleNames
  })
}
