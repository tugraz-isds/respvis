import {LineChartUserArgs} from "respvis-line";
import {format, timeFormat, timeYear} from "d3";
import {formatWithDecimalZero} from "respvis-core";

const students = [
  8291, 8785, 9203, 9766, 10245, 11211, 11681, 12105, 12323,
  12565, 12764, 13167, 13454, 13737, 13373, 13566, 13673, 13712
]

const years = [
  "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012",
  "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021"
]

const yearsJsDate = years.map(year => new Date(year))

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

export const singleLineChartLabeled: LineChartUserArgs = {
  ...singleLineChartValuesOnly,
  title: 'Students Registered at TU Graz',
  subTitle: '',
  x: {
    title: 'Year',
    subTitle: '[2012 to 2021]',
  },
  y: {
    title: 'Students',
    subTitle: '[Winter Semester]',
  }
}

export const singleLineChartDateValues = {
  ...singleLineChartLabeled,
  series: {
    ...singleLineChartLabeled.series,
    x: {values: yearsJsDate},
  }
}

export const singleLineChartResponsiveTitle: LineChartUserArgs = {
  ...singleLineChartDateValues,
  breakPoints: {
    width: {
      values: [20, 30, 50],
      unit: 'rem'
    }
  },
  title: {
    dependentOn: 'width',
    mapping: {0: 'Registered Students', 1: 'Students at TU Graz', 3: 'Students Registered at TU Graz'}
  },
  subTitle: {
    dependentOn: 'width',
    mapping: {0: 'TU Graz', 1: ''}
  }
}

export const singleLineChartResponsiveAxisTicks: LineChartUserArgs = {
  ...singleLineChartResponsiveTitle,
  x: {
    ...singleLineChartResponsiveTitle.x,
    breakPoints: {
      width: {
        values: [15, 30, 50],
        unit: 'rem'
      }
    },
    configureAxis: {
      dependentOn: "width",
      mapping: {
        0: (axis) => {
          axis.ticks(timeYear.every(2))
          axis.tickFormat(timeFormat('%Y'))
        },
        3: (axis) => {
          axis.ticks(timeYear.every(1))
          axis.tickFormat(timeFormat('%Y'))
        },
      }
    },
    tickOrientation: {
      dependentOn: 'width',
      mapping: {0: 90, 3: 0}
    }
  },
  y: {
    ...singleLineChartResponsiveTitle.y,
    configureAxis: {
      dependentOn: 'width',
      scope: 'chart',
      mapping: {
        0: (axis) => axis.tickFormat(formatWithDecimalZero(format('.2s'))),
        2: (axis) => axis.tickFormat(formatWithDecimalZero(format(',')))
      }
    }
  }
}

export const singleLineChartLabelsAndTooltips: LineChartUserArgs = {
  ...singleLineChartResponsiveAxisTicks,
  series: { ...singleLineChartResponsiveAxisTicks.series,
    markerTooltipGenerator: function (_, {xValue, yValue}) {
      return `Year: ${xValue}<br/>Students: ${format('.2f')(yValue)}`
    },
    labels: {
      values: students.map(student => student.toString()),
      offset: 6,
      format: (bar, label) => format('.3s')(label as any)
    }
  },
  // x: {
  //   ...singleLineChartResponsiveTitle.x,
  //   breakPoints: {
  //     width: {
  //       values: [15, 30, 50],
  //       unit: 'rem'
  //     }
  //   },
  //   configureAxis: {
  //     dependentOn: "width",
  //     mapping: {
  //       0: (axis) => {
  //         axis.ticks(timeYear.every(2))
  //         axis.tickFormat(timeFormat('%Y'))
  //       },
  //       3: (axis) => {
  //         axis.ticks(timeYear.every(1))
  //         axis.tickFormat(timeFormat('%Y'))
  //       },
  //     }
  //   },
  //   tickOrientation: {
  //     dependentOn: 'width',
  //     mapping: {0: 90, 3: 0}
  //   }
  // },
  // y: {
  //   ...singleLineChartResponsiveTitle.y,
  //   configureAxis: {
  //     dependentOn: 'width',
  //     scope: 'chart',
  //     mapping: {
  //       0: (axis) => axis.tickFormat(formatWithDecimalZero(format('.2s'))),
  //       2: (axis) => axis.tickFormat(formatWithDecimalZero(format(',')))
  //     }
  //   }
  // }
}
