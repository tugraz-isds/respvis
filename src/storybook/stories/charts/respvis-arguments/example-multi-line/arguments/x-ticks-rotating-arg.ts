import {Axis, AxisDomain, timeFormat} from "d3";
import {BaseAxisUserArgs} from "../../../../../../ts";

export const x: BaseAxisUserArgs = {
  title: 'Year',
  subTitle: '[2012 to 2021]',
  tickOrientation: {
    dependentOn: 'width',
    scope: 'self',
    mapping: {0: 90, 3: 0},
  },
  breakPoints: {
    width: {
      values: [10, 30, 50],
      unit: 'rem'
    }
  },
  configureAxis: (axis: Axis<AxisDomain>) => axis.tickFormat(timeFormat('%Y'))
}
