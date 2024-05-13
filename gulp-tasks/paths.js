const path = require('path');

const rootDir = path.dirname(__dirname).split(path.sep).join(path.posix.sep)
const srcDir = `${rootDir}/src`
const tsDir = `${srcDir}/ts`
const assetsDir = `${srcDir}/assets`

const gulpUtilGenerated = `${rootDir}/gulp-util-generated`
const iconsDir = `${srcDir}/assets/svg/cursor-icons`

const exampleDepsDir = `${srcDir}/examples-dependencies`
const dataDepsDir = `${srcDir}/data`
const libsDepsDir = `${srcDir}/libs`

const respvisDepsDir = `${libsDepsDir}/respvis`


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
  tsDir,
  assetsDir,
  exampleDepsDir,
  dataDepsDir,
  libsDepsDir,
  respvisDepsDir,
  gulpUtilGenerated,
  exampleDir,
  exampleDirList,
  iconsDir
}
