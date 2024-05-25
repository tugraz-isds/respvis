import {absolutePaths} from "../paths/absolute-paths";

const {libsDepsDir, exampleDirList, rootDir, barExampleDir, respVisModulesPaths} = absolutePaths

const srcLibsPaths = {
  src: `${libsDepsDir}/**/*`,
  target: exampleDirList.map((dir) => `${dir}/libs`)
}

const respvisLibPaths = {
  src: `${rootDir}/package/standalone/esm/**/*`,
  target: exampleDirList.map((dir) => `${dir}/libs/respvis`)
}

const respvisCSSPaths = {
  src: `${rootDir}/package/respvis.css`,
  target: exampleDirList.map((dir) => `${dir}/libs/respvis`)
}

const respvisCoreDependencyBasedPaths = {
  src: `${respVisModulesPaths["respvis-core"]}/package/dependency-based/esm/**/*`,
  target: [`${barExampleDir}/libs/respvis`]
}

const respvisBarDependencyBasedPaths = {
  src: `${respVisModulesPaths["respvis-bar"]}/package/dependency-based/esm/**/*`,
  target: [`${barExampleDir}/libs/respvis`]
}

const respvisCartesianDependencyBasedPaths = {
  src: `${respVisModulesPaths["respvis-cartesian"]}/package/dependency-based/esm/**/*`,
  target: [`${barExampleDir}/libs/respvis`]
}

const respvisTooltipDependencyBasedPaths = {
  src: `${respVisModulesPaths["respvis-tooltip"]}/package/dependency-based/esm/**/*`,
  target: [`${barExampleDir}/libs/respvis`]
}

export const dependencyBasedLibPaths = [respvisCoreDependencyBasedPaths, respvisBarDependencyBasedPaths,
respvisCartesianDependencyBasedPaths, respvisTooltipDependencyBasedPaths]

export const libsPaths = [srcLibsPaths, respvisLibPaths, respvisCSSPaths]
