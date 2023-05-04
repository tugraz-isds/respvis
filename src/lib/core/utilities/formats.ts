import d3 from "d3"

type d3Format = ReturnType<typeof d3.format>
export function formatWithDecimalZero(formatFunction: d3Format) : d3Format {
  return (val) => {
    if (val === 0) return '0'
    return formatFunction(val)
  }
}
