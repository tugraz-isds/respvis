const {dataDepsDir, exampleDir} = require('./paths')

const dataAustrianCitiesPaths = {
  src: `${dataDepsDir}/austrian-cities`,
  target: [
    `${exampleDir}/barcharts/barchart`
  ]
}

const dataCompensationEmployeesPaths = {
  src: `${dataDepsDir}/compensation-employees`,
  target: [
    `${exampleDir}/barcharts/grouped-barchart`
  ]
}

const dataDesktopPhoneTabletPaths = {
  src: `${dataDepsDir}/desktop-phone-tablet`,
  target: [
    `${exampleDir}/barcharts/stacked-barchart`,
    `${exampleDir}/article/charts/market-shares`
  ]
}

const dataElectricPowerConsumptionPaths = {
  src: `${dataDepsDir}/electric-power-consumption`,
  target: [
    `${exampleDir}/linecharts/linechart-multiline`,
    `${exampleDir}/article/charts/electric-power-consumption`
  ]
}

const dataSoldCarsGermanyPaths = {
  src: `${dataDepsDir}/sold-cars-germany`,
  target: [
    `${exampleDir}/scatterplots/scatterplot`,
    `${exampleDir}/experimental/parcoord`,
    `${exampleDir}/experimental/scatterplot-colourscale`,
    `${exampleDir}/article/charts/sold-cars-germany`
  ]
}

const dataStudentsTuGrazPaths = {
  src: `${dataDepsDir}/students-tugraz`,
  target: [
    `${exampleDir}/linecharts/linechart`
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
