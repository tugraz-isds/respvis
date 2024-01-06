const {dataDepsDir, exampleDir} = require('./paths')

const dataAustrianCitiesPaths = {
  src: `${dataDepsDir}/austrian-cities/**/*`,
  target: [
    `${exampleDir}/barcharts/barchart/data`
  ]
}

const dataCompensationEmployeesPaths = {
  src: `${dataDepsDir}/compensation-employees/**/*`,
  target: [
    `${exampleDir}/barcharts/grouped-barchart/data`
  ]
}

const dataDesktopPhoneTabletPaths = {
  src: `${dataDepsDir}/desktop-phone-tablet/**/*`,
  target: [
    `${exampleDir}/barcharts/stacked-barchart/data`,
    `${exampleDir}/article/charts/market-shares/data`
  ]
}

const dataElectricPowerConsumptionPaths = {
  src: `${dataDepsDir}/electric-power-consumption/**/*`,
  target: [
    `${exampleDir}/linecharts/linechart-multiline/data`,
    `${exampleDir}/article/charts/electric-power-consumption/data`
  ]
}

const dataSoldCarsGermanyPaths = {
  src: `${dataDepsDir}/sold-cars-germany/**/*`,
  target: [
    `${exampleDir}/scatterplots/scatterplot/data`,
    `${exampleDir}/experimental/parcoord/data`,
    `${exampleDir}/experimental/scatterplot-colourscale/data`,
    `${exampleDir}/experimental/scatterplot-reusable/sold-cars-germany/data`,
    `${exampleDir}/article/charts/sold-cars-germany/data`
  ]
}

const dataStudentsTuGrazPaths = {
  src: `${dataDepsDir}/students-tugraz/**/*`,
  target: [
    `${exampleDir}/linecharts/linechart/data`
  ]
}

const dataPaths = [
  dataAustrianCitiesPaths,
  dataCompensationEmployeesPaths,
  dataDesktopPhoneTabletPaths,
  dataElectricPowerConsumptionPaths,
  dataSoldCarsGermanyPaths,
  dataStudentsTuGrazPaths
]

module.exports = {
  dataPaths
}
