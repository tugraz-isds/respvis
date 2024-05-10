import {Axis, AxisDomain, timeFormat} from "d3";
import {BaseAxisUserArgs} from "../../../../../../ts";

export const x: BaseAxisUserArgs = {
  title: 'Year',
  subTitle: '[2012 to 2021]',
  configureAxis: (axis: Axis<AxisDomain>) => axis.tickFormat(timeFormat('%Y'))
}
