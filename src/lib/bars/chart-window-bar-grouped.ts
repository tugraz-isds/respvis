import {select, Selection} from 'd3';
import {
  arrayIs,
  arrayPartition,
  Checkbox,
  layouterCompute,
  toolDownloadSVGRender,
  ToolFilterNominal,
  toolFilterNominalData,
  toolFilterNominalRender,
  windowChartBaseRender,
} from '../core';
import {ChartBarGrouped, chartBarGroupedData, chartBarGroupedRender} from './chart-bar-grouped';

export interface ChartWindowBarGrouped extends ChartBarGrouped {
  categoryActiveStates: boolean[];
  subcategoryActiveStates: boolean[];
  categoryEntity: string;
  subcategoryEntity: string;
  valueEntity: string;
  valueDomain: number[] | ((values: number[][]) => number[]);
}

export function chartWindowBarGroupedData(
  data: Partial<ChartWindowBarGrouped>
): ChartWindowBarGrouped {
  const chartData = chartBarGroupedData(data),
    valueDomain =
      data.valueDomain ||
      ((values) => [0, Math.max(...values.map((catV) => Math.max(...catV))) * 1.05]);

  chartData.valueScale.domain(
    valueDomain instanceof Function ? valueDomain(chartData.values) : valueDomain
  );

  return {
    ...chartData,
    categoryEntity: data.categoryEntity || 'Categories',
    subcategoryEntity: data.subcategoryEntity || 'Subcategories',
    valueEntity: data.valueEntity || 'Values',
    valueDomain: valueDomain,
    categoryActiveStates: data.categoryActiveStates || chartData.categories.map(() => true),
    subcategoryActiveStates:
      data.subcategoryActiveStates || chartData.subcategories.map(() => true),
  };
}

export function chartWindowBarGroupedRender(
  selection: Selection<HTMLDivElement, ChartWindowBarGrouped>
): void {
  selection
    .classed('chart-window-bar-grouped', true)
    .call((s) => windowChartBaseRender(s))
    .each((chartWindowD, i, g) => {
      const {
        categories,
        categoryScale,
        subcategories,
        styleClasses,
        values,
        valueScale,
        keys,
        valueDomain,
        categoryActiveStates,
        subcategoryActiveStates,
        labels: { labels: labels },
      } = chartWindowD;
      const chartWindowS = select<HTMLDivElement, ChartWindowBarGrouped>(g[i]),
        menuItemsS = chartWindowS.selectAll('.menu-tools > .items'),
        layouterS = chartWindowS.selectAll<HTMLDivElement, any>('.layouter');

      // category filter
      const categoryFilterS = menuItemsS
        .selectAll<HTMLLIElement, ToolFilterNominal>('.tool-filter-categories')
        .data([
          toolFilterNominalData({
            text: chartWindowD.categoryEntity,
            options: chartWindowD.categories,
            keys: chartWindowD.categories,
          }),
        ])
        .join('li')
        .classed('tool-filter-categories', true)
        .call((s) => toolFilterNominalRender(s))
        .call((s) =>
          s.selectAll('.checkbox input').attr('checked', (d, i) => categoryActiveStates[i])
        )
        .on('change.chartwindowbar', function (e, filterD) {
          const categoryFilterS = select(this);
          const checkedStates: boolean[] = [];
          const checkboxS = categoryFilterS
            .selectAll<Element, Checkbox>('.checkbox')
            .each((d, i, g) => checkedStates.push(g[i].querySelector('input')!.checked));
          chartWindowS.dispatch('categoryfilter', {
            detail: { categoryActiveStates: checkedStates },
          });
        });

      // subcategory filter
      const subcategoryFilterS = menuItemsS
        .selectAll<HTMLLIElement, ToolFilterNominal>('.tool-filter-subcategories')
        .data([
          toolFilterNominalData({
            text: chartWindowD.subcategoryEntity,
            options: chartWindowD.subcategories,
            keys: chartWindowD.subcategories,
          }),
        ])
        .join('li')
        .classed('tool-filter-subcategories', true)
        .call((s) => toolFilterNominalRender(s))
        .call((s) =>
          s.selectAll('.checkbox input').attr('checked', (d, i) => subcategoryActiveStates[i])
        )
        .on('change.chartwindowbar', function (e, filterD) {
          const subcategoryFilterS = select(this);
          const checkedStates: boolean[] = [];
          const checkboxS = subcategoryFilterS
            .selectAll<Element, Checkbox>('.checkbox')
            .each((d, i, g) => checkedStates.push(g[i].querySelector('input')!.checked));
          chartWindowS.dispatch('subcategoryfilter', {
            detail: { subcategoryActiveStates: checkedStates },
          });
        });

      // download svg
      menuItemsS
        .selectAll<HTMLLIElement, any>('.tool-download-svg')
        .data([null])
        .join('li')
        .call((s) => toolDownloadSVGRender(s));

      const filterCat = (v: any, i: number) => categoryActiveStates[i];
      const filterSubcat = (v: any, i: number) => subcategoryActiveStates[i];

      const filteredCats = categories.filter(filterCat),
        filteredSubcats = subcategories.filter(filterSubcat),
        filteredStyleClasses = styleClasses.filter(filterSubcat),
        filteredValues = values.filter(filterCat).map((v) => v.filter(filterSubcat)),
        filteredKeys = keys?.filter(filterCat).map((v) => v.filter(filterSubcat)),
        filteredLabels = arrayIs(labels)
          ? arrayPartition(labels, subcategories.length)
              .filter(filterCat)
              .map((v) => v.filter(filterSubcat))
              .flat()
          : labels,
        filteredValueDomain =
          valueDomain instanceof Function ? valueDomain(filteredValues) : valueDomain;

      categoryScale.domain(filteredCats);
      valueScale.domain(filteredValueDomain).nice();

      // chart
      const chartS = layouterS
        .selectAll<SVGSVGElement, ChartBarGrouped>('svg.chart-bar-grouped')
        .data([
          chartBarGroupedData({
            ...chartWindowD,
            categories: filteredCats,
            subcategories: filteredSubcats,
            values: filteredValues,
            keys: filteredKeys,
            styleClasses: filteredStyleClasses,
            labels: { ...chartWindowD.labels, labels: filteredLabels },
          }),
        ])
        .join('svg')
        .call((s) => chartBarGroupedRender(s));

      layouterS
        .on('boundschange.chartwindowbargrouped', () => chartBarGroupedRender(chartS))
        .call((s) => layouterCompute(s));
    });
}

export function chartWindowBarGroupedAutoResize(
  selection: Selection<HTMLDivElement, ChartWindowBarGrouped>
): void {
  selection.on('resize', function () {
    select<HTMLDivElement, ChartWindowBarGrouped>(this).call((s) => chartWindowBarGroupedRender(s));
  });
}

export function chartWindowBarGroupedAutoFilterCategories(
  data?: ChartWindowBarGrouped
): (selection: Selection<HTMLDivElement, ChartWindowBarGrouped>) => void {
  return (s) =>
    s.on('categoryfilter', function (e, d) {
      data = data || d;
      data.categoryActiveStates = e.detail.categoryActiveStates;
      select<HTMLDivElement, ChartWindowBarGrouped>(this)
        .datum(chartWindowBarGroupedData(data))
        .call((s) => chartWindowBarGroupedRender(s));
    });
}

export function chartWindowBarGroupedAutoFilterSubcategories(
  data?: ChartWindowBarGrouped
): (selection: Selection<HTMLDivElement, ChartWindowBarGrouped>) => void {
  return (s) =>
    s.on('subcategoryfilter', function (e, d) {
      data = data || d;
      data.subcategoryActiveStates = e.detail.subcategoryActiveStates;
      select<HTMLDivElement, ChartWindowBarGrouped>(this)
        .datum(chartWindowBarGroupedData(data))
        .call((s) => chartWindowBarGroupedRender(s));
    });
}
