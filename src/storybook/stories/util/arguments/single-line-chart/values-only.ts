import {LineChartUserArgs} from "respvis-line";
// import {format} from "d3";

const students = [
  8291, 8785, 9203, 9766, 10245, 11211, 11681, 12105, 12323,
  12565, 12764, 13167, 13454, 13737, 13373, 13566, 13673, 13712
]

const years = [
  "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012",
  "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021"
]

export const singleLineChartValuesOnly: LineChartUserArgs = {
  series: {
    x: {
      values: years
    },
    y: {
      values: students
    }
  },
  x: {},
  y: {}
}

// title: 'Students Registered at TU Graz',
//   subTitle: 'TU Graz',
//   x: {
//   title: 'Year',
//     subTitle: '[2012 to 2021]'
// },
// y: {
//   title: 'Students',
//     subTitle: '[Winter Semester]',
// },


// markerTooltips: {
//   tooltips: function(_, {xValue, yValue}) {
//     return `Year: ${xValue}<br/>Students: ${format('.2f')(yValue)}`
//   }
// }
