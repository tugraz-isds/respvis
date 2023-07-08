const {stylesDepsDir, exampleDirList} = require('./paths')

const stylesPaths = {
  src: `${stylesDepsDir}/**/*`,
  target: exampleDirList.map((dir) => `${dir}/styles`)
}

module.exports = {
  stylesPaths
}
