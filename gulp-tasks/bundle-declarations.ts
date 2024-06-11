import rollup from "rollup";
import del from "del";
import dts from "rollup-plugin-dts";
import {string} from "rollup-plugin-string";
import {modulesMap, respvisModules} from "./constants/modules";

export async function bundleDeclarations(declarationConfigs) {
  await Promise.all(declarationConfigs.map(bundleDeclarationByLocation))
  return Promise.all(declarationConfigs.map(config => del(`${config.location}/types`)))
}

async function bundleDeclarationByLocation(declarationConfig) {
  const {location, format, module} = declarationConfig
  const input = module === 'respvis' ? `${location}/types/index.d.ts` :
    `${location}/types/${module}/ts/index.d.ts`
  const bundle = await rollup.rollup({
    input,
    plugins: [
      string({ include: "**/*.svg" }),
      dts()
    ],
    external: [...respvisModules, 'd3']
  });
  await bundle.write({
    file: `${location}/${module}.d.ts`,
    format,
    globals: modulesMap
  })
}
