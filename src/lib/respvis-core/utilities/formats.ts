import {format} from "d3"

type d3Format = ReturnType<typeof format>
export function formatWithDecimalZero(formatFunction: d3Format) : d3Format {
  return (val) => {
    if (val === 0) return '0'
    return formatFunction(val)
  }
}
