const path = require('path');
const fs = require('fs');

const rootDir = path.dirname(__dirname)
const srcDir = `${rootDir}/src`

const exampleDepsDir = `${srcDir}/examples-dependencies`
const dataDepsDir = `${exampleDepsDir}/data`
const libsDepsDir = `${exampleDepsDir}/libs`

const exampleDir = `${srcDir}/examples`

const exampleDirList = [
  `${exampleDir}/article`,

  `${exampleDir}/barcharts/barchart`,
  `${exampleDir}/barcharts/grouped-barchart`,
  `${exampleDir}/barcharts/stacked-barchart`,

  `${exampleDir}/experimental/parcoord`,
  `${exampleDir}/experimental/scatterplot-colourscale`,

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
  exampleDirList
}
