import {absolutePaths} from "../paths/absolute-paths";

const {libsDepsDir, exampleDirList, rootDir, barExampleDir} = absolutePaths

const srcLibsPaths = {
  src: `${libsDepsDir}/**/*`,
  target: exampleDirList.map((dir) => `${dir}/libs`)
}

const respvisLibPaths = {
  src: `${rootDir}/package/respvis/standalone/esm/**/*`,
  target: exampleDirList.map((dir) => `${dir}/libs/respvis`)
}

const respvisCSSPaths = {
  src: `${rootDir}/package/respvis/respvis.css`,
  target: exampleDirList.map((dir) => `${dir}/libs/respvis`)
}

const respvisCoreDependencyBasedPaths = {
  src: `${rootDir}/package/respvis-core/dependency-based/esm/**/*`,
  target: [`${barExampleDir}/libs/respvis`]
}

const respvisBarDependencyBasedPaths = {
  src: `${rootDir}/package/respvis-bar/dependency-based/esm/**/*`,
  target: [`${barExampleDir}/libs/respvis`]
}

const respvisCartesianDependencyBasedPaths = {
  src: `${rootDir}/package/respvis-cartesian/dependency-based/esm/**/*`,
  target: [`${barExampleDir}/libs/respvis`]
}

const respvisTooltipDependencyBasedPaths = {
  src: `${rootDir}/package/respvis-tooltip/dependency-based/esm/**/*`,
  target: [`${barExampleDir}/libs/respvis`]
}

export const dependencyBasedLibPaths = [respvisCoreDependencyBasedPaths, respvisBarDependencyBasedPaths,
respvisCartesianDependencyBasedPaths, respvisTooltipDependencyBasedPaths]

export const libsPaths = [srcLibsPaths, respvisLibPaths, respvisCSSPaths]
