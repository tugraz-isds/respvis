import path from "path";

const rootDir = path.dirname(__dirname).split(path.sep).join(path.posix.sep)
function createPaths(rootDir: string) {
  const gulpUtilGenerated = `${rootDir}/gulp-util-generated`
  const srcDir = `${rootDir}/src`
  const tsDir = `${srcDir}/ts`

  const assetsDir = `${srcDir}/assets`
  const iconsDir = `${srcDir}/assets/svg/cursor-icons`

  const dataDepsDir = `${srcDir}/data`

  const libsDepsDir = `${srcDir}/libs`
  const respvisDepsDir = `${libsDepsDir}/respvis`

  const exampleDir = `${srcDir}/examples`
  const barExampleDir = `${exampleDir}/barcharts/barchart`
  const exampleDirList = [
    `${exampleDir}/article`,
    barExampleDir,
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

  return {
    gulpUtilGenerated, srcDir, tsDir, assetsDir, iconsDir, dataDepsDir, libsDepsDir, respvisDepsDir,
    exampleDir, barExampleDir, exampleDirList
  }
}

module.exports = {
  rootDir,
  ...createPaths(rootDir)
}
