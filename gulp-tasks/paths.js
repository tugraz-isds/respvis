const path = require('path');

const rootDir = path.dirname(__dirname).split(path.sep).join(path.posix.sep)
const srcDir = `${rootDir}/src`

const exampleDepsDir = `${srcDir}/examples-dependencies`
const dataDepsDir = `${exampleDepsDir}/data`
const libsDepsDir = `${exampleDepsDir}/libs`
const respvisDepsDir = `${libsDepsDir}/respvis`
const utilDepsDir = `${exampleDepsDir}/util`

const iconsDir = `${srcDir}/lib/respvis-core/assets/cursor-icons`

const exampleDir = `${srcDir}/examples`

const exampleDirList = [
  `${exampleDir}/article`,

  `${exampleDir}/barcharts/barchart`,
  `${exampleDir}/barcharts/grouped-barchart`,
  `${exampleDir}/barcharts/stacked-barchart`,

  `${exampleDir}/parcoords/parcoord`,

  `${exampleDir}/linecharts/linechart`,
  `${exampleDir}/linecharts/linechart-multiline`,

  `${exampleDir}/scatterplots/scatterplot`,
  `${exampleDir}/scatterplots/scatterplot-style-container-queries`,
  `${exampleDir}/scatterplots/scatterplot-labels`,

  `${exampleDir}/experimental/aggregated-barchart`,
  `${exampleDir}/experimental/scatterplot-colourscale`,
]

module.exports = {
  rootDir,
  srcDir,
  exampleDepsDir,
  dataDepsDir,
  libsDepsDir,
  respvisDepsDir,
  utilDepsDir,
  exampleDir,
  exampleDirList,
  iconsDir
}
