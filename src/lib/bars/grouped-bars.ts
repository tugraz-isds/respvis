import { range } from 'd3-array';
import { ScaleBand, ScaleContinuousNumeric } from 'd3-scale';
import { linearScale, Rect, utils, bandScale } from '../core';
import { ISize } from '../core/utils';
import { BarOrientation } from './bars';

export interface GroupedBars {
  mainValues(): any[];
  mainValues(categories: any[]): this;
  mainScale(): ScaleBand<any>;
  mainScale(scale: ScaleBand<any>): this;
  crossValues(): any[][];
  crossValues(values: any[][]): this;
  crossScale(): ScaleContinuousNumeric<number, number>;
  crossScale(scale: ScaleContinuousNumeric<number, number>): this;
  mainInnerScale(): ScaleBand<any>;
  mainInnerScale(scale: ScaleBand<any>): this;
  orientation(): BarOrientation;
  orientation(orientation: BarOrientation): this;
  bars(): Rect<number>[];
}

export class GroupedBarsCalculator implements GroupedBars {
  private _mainValues: any[];
  private _mainScale: ScaleBand<any>;
  private _mainInnerScale: ScaleBand<any>;
  private _crossValues: number[][];
  private _crossScale: ScaleContinuousNumeric<number, number>;
  private _orientation: BarOrientation;
  private _bars: Rect<number>[];

  constructor() {
    this._mainValues = [];
    this._mainScale = bandScale().padding(0.1);
    this._mainInnerScale = bandScale().padding(0.1);
    this._crossValues = [];
    this._crossScale = linearScale();
    this._orientation = BarOrientation.Vertical;
    this._bars = [];
  }

  mainValues(): any[];
  mainValues(categories: any[]): this;
  mainValues(categories?: any) {
    if (categories === undefined) return this._mainValues;
    this._mainValues = categories;
    this._mainScale.domain(this._mainValues);
    return this;
  }

  mainScale(): ScaleBand<any>;
  mainScale(scale: ScaleBand<any>): this;
  mainScale(scale?: any) {
    if (scale === undefined) return this._mainScale;
    this._mainScale = scale;
    this._mainScale.domain(this._mainValues);
    return this;
  }

  crossValues(): any[][];
  crossValues(values: any[][]): this;
  crossValues(values?: any) {
    if (values === undefined) return this._crossValues;
    this._crossValues = values;
    this._mainInnerScale.domain(range(this._crossValues[0]?.length || 0));
    return this;
  }

  crossScale(): ScaleContinuousNumeric<number, number>;
  crossScale(scale: ScaleContinuousNumeric<number, number>): this;
  crossScale(scale?: any) {
    if (scale === undefined) return this._crossScale;
    this._crossScale = scale;
    return this;
  }

  mainInnerScale(): ScaleBand<any>;
  mainInnerScale(scale: ScaleBand<any>): this;
  mainInnerScale(scale?: any) {
    if (scale === undefined) return this._mainInnerScale;
    this._mainInnerScale = scale;
    this._mainInnerScale.domain(range(this._crossValues[0]?.length || 0));
    return this;
  }

  orientation(): BarOrientation;
  orientation(orientation: BarOrientation): this;
  orientation(orientation?: any) {
    if (orientation === undefined) return this._orientation;
    this._orientation = orientation;
    return this;
  }

  bars(): Rect<number>[] {
    return this._bars;
  }

  fitInSize(size: ISize): this {
    if (this._orientation === BarOrientation.Vertical) {
      this._mainScale.range([0, size.width]);
      this._crossScale.range([size.height, 0]);
    } else if (this._orientation === BarOrientation.Horizontal) {
      this._mainScale.range([0, size.height]);
      this._crossScale.range([0, size.width]);
    }
    this._mainInnerScale.range([0, this._mainScale.bandwidth()]);

    this._bars = [];
    for (let i = 0; i < this._crossValues.length; ++i) {
      const subcategoryValues = this._crossValues[i];
      for (let j = 0; j < subcategoryValues.length; ++j) {
        const c = this._mainValues[i];
        const v = subcategoryValues[j];

        if (this._orientation === BarOrientation.Vertical) {
          this._bars.push({
            x: this._mainScale(c)! + this._mainInnerScale(j)!,
            y: Math.min(this._crossScale(0)!, this._crossScale(v)!),
            width: this._mainInnerScale.bandwidth(),
            height: Math.abs(this._crossScale(0)! - this._crossScale(v)!),
          });
        } else if (this._orientation === BarOrientation.Horizontal) {
          this._bars.push({
            x: Math.min(this._crossScale(0)!, this._crossScale(v)!),
            y: this._mainScale(c)! + this._mainInnerScale(j)!,
            width: Math.abs(this._crossScale(0)! - this._crossScale(v)!),
            height: this._mainInnerScale.bandwidth(),
          });
        }
      }
    }

    return this;
  }
}

export function groupedBarsCalculator(): GroupedBarsCalculator {
  return new GroupedBarsCalculator();
}
