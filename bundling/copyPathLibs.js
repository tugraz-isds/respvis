const {libsDepsDir, exampleDirList} = require('./paths')

const libsPaths = {
  src: `${libsDepsDir}`,
  target: [
    ...exampleDirList
  ]
}

module.exports = {
  libsPaths
}
