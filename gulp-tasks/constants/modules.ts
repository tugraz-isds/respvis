import {genKeyObject} from "./types";

export const respvisModules = [
  'respvis-core', 'respvis-bar', 'respvis-cartesian',
  'respvis-line', 'respvis-parcoord', 'respvis-point',
  'respvis-tooltip'] as const
export type respvisModule = typeof respvisModules[number]

export const externalModules = ['d3'] as const
export type externalModule = typeof externalModules[number]

export const modules = [...respvisModules, ...externalModules] as const
export type Module = typeof modules[number]
export const modulesMap = genKeyObject(modules)
