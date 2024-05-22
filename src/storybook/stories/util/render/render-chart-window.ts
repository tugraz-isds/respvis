export function renderChartWindow(id = 'chart-window') {
  const chartWindow = document.createElement('div')
  chartWindow.id = id
  return {chartWindow , id}
}
