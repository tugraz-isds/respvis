import {PartialBy} from "../../constants/types";

export type GridLine = {
  tickRange: [number, number] | 'rest'
  factor: number
}

export type GridLineUserArgs = PartialBy<GridLine, 'factor'>[] | Partial<GridLine> | undefined

export function gridLineValidation(args: GridLineUserArgs): GridLine[] {
  const defaultGridLines: GridLine[] = [{tickRange: [0, 0], factor: 1}]
  const defaultFillGridLine: GridLine = {tickRange: 'rest', factor: 1}
  if (!args) return defaultGridLines
  if (!Array.isArray(args)) {
    return [{
      tickRange: args.tickRange ?? 'rest',
      factor: args.factor ?? 1,
    }]
  }
  let arrayArgsValid: GridLine[] = []
  for (let i = 0; i < args.length; i++) {
    const argValid: GridLine = { tickRange: args[i].tickRange, factor: args[i].factor ?? 1 }
    if (i !== args.length - 1 && argValid.tickRange === 'rest') {
      arrayArgsValid.push(defaultFillGridLine)
      return arrayArgsValid
    }
    const lastRange = arrayArgsValid[arrayArgsValid.length - 1].tickRange
    const currentRange = argValid.tickRange
    if (lastRange === 'rest') return arrayArgsValid
    if (currentRange === 'rest') {
      arrayArgsValid.push(argValid)
      return arrayArgsValid
    }
    if (Math.min(...currentRange) < Math.max(...lastRange)) return arrayArgsValid
  }
  return arrayArgsValid
}
