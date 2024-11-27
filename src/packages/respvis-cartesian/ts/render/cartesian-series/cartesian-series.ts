import {AxisType, BaseAxis, DataSeries, getCurrentResponsiveValue, SVGHTMLElementLegacy} from "respvis-core";
import {CartesianResponsiveState} from "./cartesian-responsive-state";
import {CartesianRenderer} from "../cartesian-chart/cartesian-renderer";
import {CartesianAxis} from "../validate-cartesian-axis";
import {Selection} from "d3";
import {CartesianSeriesData} from "./validate-cartesian-series";

export abstract class CartesianSeries implements DataSeries {
  abstract originalData: CartesianSeriesData
  abstract renderData: CartesianSeriesData
  abstract responsiveState: CartesianResponsiveState
  abstract renderer: CartesianRenderer

  getScaledValuesAtScreenPosition(x: number, y: number) {
    const getAxisData = (axisS: Selection<SVGHTMLElementLegacy, CartesianAxis>, position: number) => {
      const axis = axisS.datum()
      const scaleFormat = axis.scaledValues.tag !== 'categorical' ? axis.scaledValues.scale.tickFormat() : (h => h)
      const appliedFormat = axis.d3Axis?.tickFormat() ?? scaleFormat
      const screenValue = this.renderer.horizontalAxisS.datum().scaledValues.atScreenPosition(position)
      const nearestRealValue = this.renderer.horizontalAxisS.datum().scaledValues.getNearestValue(screenValue as never)
      return {
        appliedFormat,
        formattedValue: appliedFormat(screenValue, 0),
        title: getCurrentResponsiveValue(axis.title, {
          self: axisS,
          chart: axis.renderer.chartS
        }),
        screenValue, nearestRealValue
      }
    }

    const horizontal = getAxisData(this.renderer.horizontalAxisS, x)
    const vertical = getAxisData(this.renderer.verticalAxisS, y)

    return {
      horizontal: horizontal.formattedValue,
      horizontalName: horizontal.title,
      horizontalNearestRealValue: horizontal.nearestRealValue,
      horizontalScreenValue: horizontal.screenValue,
      vertical: vertical.formattedValue,
      verticalName: vertical.title,
      verticalNearestRealValue: vertical.nearestRealValue,
      verticalScreenValue: vertical.screenValue,
    }
  }

  abstract cloneToRenderData(): CartesianSeries

  applyFilter(): CartesianSeries {
    const {x, y, color, categories} = this.renderData

    this.renderData = {...this.renderData,
      x: x.cloneFiltered(),
      y: y.cloneFiltered()
    }

    if (color) {
      const colorFiltered = color.axis.scaledValues.cloneFiltered()
      const axis: BaseAxis = {...color.axis, scaledValues: colorFiltered}
      this.renderData.color = {...color, axis}
    }
    if (categories) {
      this.renderData.categories = categories.cloneFiltered()
    }
    return this
  }

  applyZoom(): CartesianSeries {
    const {zoom, x, y} = this.renderData
    if (!zoom) return this

    const [xDirection, yDirection]: [AxisType, AxisType] =
      this.responsiveState.currentlyFlipped ? ['y', 'x'] : ['x', 'y']

    this.renderData = {...this.renderData,
      x: x.cloneZoomed(zoom.currentTransform, xDirection),
      y: y.cloneZoomed(zoom.currentTransform, yDirection)
    }

    return this
  }

  abstract applyInversion(): DataSeries
}
