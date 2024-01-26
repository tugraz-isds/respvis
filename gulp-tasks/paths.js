const path = require('path');

const rootDir = path.dirname(__dirname).split(path.sep).join(path.posix.sep)
const srcDir = `${rootDir}/src`

const exampleDepsDir = `${srcDir}/examples-dependencies`
const dataDepsDir = `${exampleDepsDir}/data`
const libsDepsDir = `${exampleDepsDir}/libs`
const stylesDepsDir = `${exampleDepsDir}/styles`

const exampleDir = `${srcDir}/examples`

const exampleDirList = [
  `${exampleDir}/article`,

  `${exampleDir}/barcharts/barchart`,
  `${exampleDir}/barcharts/grouped-barchart`,
  `${exampleDir}/barcharts/stacked-barchart`,

  `${exampleDir}/experimental/parcoord`,
  `${exampleDir}/experimental/scatterplot-colourscale`,
  `${exampleDir}/experimental/scatterplot-reusable`,
  `${exampleDir}/experimental/scatterplot-labels`,

  `${exampleDir}/linecharts/linechart`,
  `${exampleDir}/linecharts/linechart-multiline`,

  `${exampleDir}/scatterplots/scatterplot`,
]

module.exports = {
  rootDir,
  srcDir,
  exampleDepsDir,
  dataDepsDir,
  libsDepsDir,
  exampleDir,
  exampleDirList,
  stylesDepsDir
}
