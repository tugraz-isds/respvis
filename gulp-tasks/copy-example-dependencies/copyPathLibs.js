const {libsDepsDir, exampleDirList, rootDir} = require('../paths')

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

const libsPaths = [srcLibsPaths, respvisLibPaths, respvisCSSPaths]

module.exports = {
  libsPaths
}
