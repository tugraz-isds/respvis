import {absolutePaths} from "../paths/absolute-paths";

const {dataDepsDir, exampleDir} = absolutePaths

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
    `${exampleDir}/parcoords/parcoord/data`,
    `${exampleDir}/experimental/scatterplot-colourscale/data`,
    `${exampleDir}/scatterplots/scatterplot-style-container-queries/sold-cars-germany/data`,
    `${exampleDir}/scatterplots/scatterplot-labels/sold-cars-germany/data`,
    `${exampleDir}/article/charts/sold-cars-germany/data`
  ]
}

const dataStudentsTuGrazPaths = {
  src: `${dataDepsDir}/students-tugraz/**/*`,
  target: [
    `${exampleDir}/linecharts/linechart/data`
  ]
}

const dataTemperatureAnomaliesPaths = {
  src: `${dataDepsDir}/global-temperature-anomalies/**/*`,
  target: [
    `${exampleDir}/experimental/aggregated-barchart/data`
  ]
}

export const dataPaths = [
  dataAustrianCitiesPaths,
  dataCompensationEmployeesPaths,
  dataDesktopPhoneTabletPaths,
  dataElectricPowerConsumptionPaths,
  dataSoldCarsGermanyPaths,
  dataStudentsTuGrazPaths,
  dataTemperatureAnomaliesPaths
]
