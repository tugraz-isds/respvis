const {libsDepsDir, exampleDirList} = require('./paths')

const libsPaths = {
  src: `${libsDepsDir}/**/*`,
  target: exampleDirList.map((dir) => `${dir}/libs`)
}

module.exports = {
  libsPaths
}
