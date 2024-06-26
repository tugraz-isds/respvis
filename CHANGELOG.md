# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.0] - 2024-05-23

### Added

- Add CSS variables for font sizing.
- Add a gulp task for compiling ts files in self-contained examples.
- Add category filtering to all charts and axis types.
- Add linear/time filtering to all charts and axis types.
- Add zooming to all charts and linear/time axis types.
- Enable single axis zooming of cartesian charts.
- Add a new system of rotating axis labels, working for all axis positions (top, bottom, left, right) and both dimensions(width, height) out of the box.
- Add a new system to solve padding problems combining padding containers, clip-path element, and CSS variables.
- Add dev mode and production mode in gulp.
- Add SVG generation cleanup and toolbar options.
- Add consistent handling of svg text element layouting, consider rotations in SVG (occupied place matches now with text layout elements).
- Add flipping for all charts. Provide special flip options for axes.
- Add legend filter interaction.
- Add drag & drop to parcoord chart. 
- Add extra filter interactions to parcoord chart.
- Add zooming possibility for parcoord axes. Let developer specify zoom options for each axis.
- Add cursor elements for parcoord chart.
- Add a new cursor system (base64 gulp task, fix cursor on interactions).
- Add a gulp task for creating both, standalone and dependency based bundles.
- Add Storybook. Add custom storybook doc components. Add documentation.
- Add origin line for cartesian charts.
- Add intelligent grid for cartesian charts (orients on axis ticks. Configurable by user).
- Add timescale support.
- Add CSS Variables for certain d3 transitions.
- Add CSS Transitions where possible as these can easily be overridden via CSS.
- Add a gulp task for creating isolated package bundles.
- Add path aliases for packages in tsconfigs.
- Add a consistent labeling system for graphic elements.

### Changed

- Improve reusability of charts (break point configuration, CSS layout variables).
- Refactor the whole library (make code reusable, understandable, provide understandable API, restrict types of API).
- Change styles to CSS files only. Add a gulp task for merging library css files.
- Improve layouter to be capable of interrupting layout hierarchies and have nested layout structures.
- Change chart class to be extended via ts mixins. Avoid nested inheritance.
- Change import/export policy according to packages.
- Change packages to be REAL packages containing package.json.
- Improve chart class: Can now be used alone.
- Improve chart render strategy. Works now without performance issues but is still capable of detecting interactions.
- Redesign toolbar completely, provide additional toolbar options, improved usability.
- Remove all inner SVGs, replace with g elements.

### Fixed

- Fix rerender problems occurring due to layouter and CSS-only resize events.


## [2.0.0] - 2024-02-08

## [1.0.0] - 2023-07-25

### Added

- Add source for each dataset.
- Add findMatchingBoundsIndex function.
- Add first container queries to example charts (article).
- Add SCSS auto generation via gulp.
- Add x-axis rotation feature.
- Add source for all datasets.
- Add noscript message which demands to activate javascript.
- Add dependencies folder which holds dependencies that could be of interest for all examples.

### Changed

- Change dataset for grouped bar chart to compensation for employees in countries.
- Change dataset for line chart to number of students of tugraz.
- Change dataset for bar chart about population in austrian cities.
- Rearrange structure of generated dist folder.


## [0.2.0] - 2023-03-25

### Added

- Add chartCartesian.
  - Handles flipping of axes.
- Add legend.
- Add dataLegendItemSquareGenerator
  - To create legend with square symbols.
- Add legend to chartBarGrouped.
- Add legend to chartBarStacked.
- Add menuDropdown.
- Add menuTools (menuDropdown).
- Add toolbar.
- Add chartWindow (= chart + toolbar).
- Add toolDownloadSVG.
  - To download the chart inside a chartWindow as an SVG file.
- Add seriesCheckbox.
- Add toolFilterNominal.
- Add chartWindowBar (= chartBar + toolbar with category filter)
- Add chartWindowBarGrouped (= chartBarGrouped + toolbar with category & subcategory filters)
- Add chartWindowBarStacked (= chartBarStacked + toolbar with category & subcategory filters)
- Add barHighlight function.
- Add barGroupedHighlight function.
- Add barStackedHighlight function.
- Add labelHighlight function.
- Add legendItemHighlight function.
- Add axisTickHighlight function.
- Add findByFilter utility function.
- Add findByDataProperty utility function.
- Add findByKey utility function.
- Add findByIndex utility function.
- Add siblingIndex utility function.
  - Get sibling index of a node with optional selector that siblings need to match.
- Add siblingIndexSameClasses function.
- Add barFind function to find bars by key.
- Add barFindByCategory function.
- Add barGroupedFindBySubcategory function.
- Add barStackedFindBySubcategory function.
- Add labelFind function find labels by key.
- Add labelFindByIndex function.
- Add labelFindByFilter function.
- Add axisTickFindByIndex function.
- Add legendItemFindByLabel function.
- Add legendItemFindByIndex function.
- Add arrayIs function.
- Add arrayIs2D function.
- Add arrayFlat function.
- Add arrayPartition function.
- Add rectPosition function.
- Add ValueOrArray type.
- Add NestedArray type.
- Add automatic highlighting of bars on hover to SeriesBar.
- Add automatic highlighting of bars on hover to SeriesBarGrouped.
- Add automatic highlighting of legend items on hover to legend.
- Add automatic highlighting of bars, labels and main axis ticks to chartBar.
- Add automatic highlighting of bars, labels, main axis ticks and legend items to chartBarGrouped.
- Add automatic highlighting of bars, labels, main axis ticks and legend items to chartBarStacked.
- Add subcategories to dataChartBarGrouped.
  - Used as default legend labels.
- Add subtitle to dataAxis & axisX.
- Add seriesLabelBarRightConfig.
  - Configures seriesLabelBar labels to appear to the right of bars.
- Add filterBrightness.
- Add colors property to SeriesBar, SeriesBarGrouped & SeriesBarStacked.
- Add stokeWidths property to SeriesBar, SeriesBarGrouped & SeriesBarStacked.
- Add stoke property to SeriesBar, SeriesBarGrouped & SeriesBarStacked.
- Add category, subcategory and value properties to Bar & BarGrouped
- Add labels property to ChartBar, ChartBarGrouped & ChartBarStacked.
- Add textAnchor & dominantBaseline properties to Label.
- Add textAnchors & dominantBaselines properties to SeriesLabel
- Add tooltip.
- Add tooltipShow function.
- Add tooltipContent function.
- Add tooltipPosition function.
- Add tooltipHide function.
- Add tooltips to SeriesBar, SeriesBarGrouped & SeriesBarStacked.

- Add d3 bundle locally.
- Add electric power consumption dataset.
- Add multi-line chart example.
- Add possibility to reverse element order in legend.
- Add categories to scatter plot
- Add zooming to scatter plot.
- Add radius size as dimension to scatter plot.
- Add color scale as dimension to scatter plot (WIP).
- Add basic parcoord chart.
- Add github workflows for development and releases.
- Add SCSS and split up default style in multiple files.

### Changed

- Set custom colors in grouped bar chart example.
- Show horizontal bar labels on the right in bar chart example.
- Show horizontal bar labels on the right in grouped bar chart example.
- Use chartWindowBar in bar chart example.
- Use chartWindowBarGrouped in grouped bar chart example.
- Configure components only once in configure function of examples.
- Move highlighting code from examples into series & chart components.
- Set sans-serif font family on chart.
- Decrease font-size of axis title.
- Make chartBar a subcomponent of chartCartesian.
- Make chartBarGrouped a subcomponent of chartCartesian.
- Make chartBarStacked a subcomponent of chartCartesian.
- Make chartPoint a subcomponent of chartCartesian.
- Highlight points in scatterplot example with a brightness filter.
- Rename dataSeriesXCreation to just dataSeriesX.
- Make partial inputs of dataX functions non-optional.
- Require layouter data to be set before initializing layouter.
- Rename SeriesBar properties:
  - mainValues → categories
  - mainScale → categoryScale
  - crossValues → values
  - crossScale → valueScale
- Rename SeriesBarGrouped property innerPadding → subcategoryPadding.
- Rename SeriesPoint properties:
  - mainValues → xValues
  - mainScale → xScale
  - crossValues → yValues
  - crossScale → yScale
- Set viewBox attribute on chart root.
- Remove width and height attributes from chart root.
- Set namespace attribute on chart.
- Refactor SeriesLabel.
- Refactor SeriesLabelBar.

- Change dataset for scatter plot to car dataset.
- Change toolbar to be shown only when hovering a chart.
- Improve Article to use 3 charts, multi-line, scatter plot and stacked bar chart

### Removed

- Remove BarOrientation enum.
- Remove orientation property from dataSeriesBar & dataChartBar.
- Remove dataSeriesBarCustom.
- Remove dataSeriesPointCustom.
- Remove creation property from dataSeriesBar.
- Remove creation property from dataSeriesBarGrouped.
- Remove creation property from dataSeriesBarStacked.
- Remove creation property from dataSeriesPoint.
- Remove chroma.js dependency and the corresponding color functions.
- Remove DataSeries interface and dataSeries creation function.
- Remove unused Selection.transformData.
- Remove unused Selection.transformAttr.
- Remove unused Selection.transformCall.
- Remove index and groupIndex properties from DataBar & DataBarGrouped.
- Remove DataBarStacked.
- Remove seriesLabelBarCenterConfig, seriesLabelBarLeftConfig, seriesLabelBarRightConfig, seriesLabelBarTopConfig.

- Remove basic charts.

### Fixed

- Fix dataAxis function ignoring passed in title and subtitle properties.
- Fix bar label jittering in Firefox.
- Fix bar labels for exiting bars.
- Fix stacked bar keys in stacked bar chart example.
- Fix keys not being passed into series data from partial parameter.
- Fix keys property type in DataSeriesBarGrouped & DataSeriesBarStacked.
- Fix dataChartCartesian not setting passed in data.flipped property.

## [0.1.0] - 2021-06-02

### Added

- Add browser-based layouter.
- Add layouter node that wraps a chart and lays out its contents.
- Add dependency on ResizeObserver Web API.
- Add dependency on MutationObserver Web API.
- Add toggleable debug logging.
- Dispatch 'datachange' event when node data changes.
- Add this change log.
- Add rectEquals function to compare rects.

### Changed

- Layout is now configured via selection.layout(...) method.
- Node bounds calculated by layouter can be accessed via selection.bounds() method.
- Only dispatch 'render' event on nodes whose bounds have changed
- Dispatch 'render' event when 'datachange' event occurs on specific nodes.
  - No need to manually rerender charts anymore.
- Set cubic out (instead of cubic in out) easing on all render transitions.
- Name all transitions so multiple transitions can be started concurrently.
- Use chroma.js in bar chart example to brighten bar colors on hover.

### Removed

- Remove FaberJS-based layouter and its dependencies.
- Remove old brush components and example.
- Remove all transition events on series joins.
- Remove IE support due to usage of modern Web APIs.

### Fixed

- Fix value parameter bug in rect and position functions that accept value or value function parameters.
