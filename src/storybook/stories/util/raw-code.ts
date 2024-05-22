export type CodeType = 'chart'
export type ChartCodeType = 'LineChart' | 'ScatterPlot' | 'BarChart' | 'ParcoordChart'

type RawCodeprops = {
  args: object,
  codeType?: CodeType,
  chartType?: ChartCodeType,
}

export function rawCode(props: RawCodeprops) {
  const {args, chartType = 'LineChart', codeType = 'chart'} = props

  //TODO: Stringify Function Readability improvable
  const argsString = JSON.stringify(args, (key, value) => {
    if (typeof value === 'function') {
      return value.toString();
    }
    return value;
  }, 2)
  if (codeType === 'chart') {
    return `const chart = new ${chartType}(chartS, ${argsString})`
  }
}
