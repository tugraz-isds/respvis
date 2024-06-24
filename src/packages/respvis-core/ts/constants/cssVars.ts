import {genKeyObjectFromObject} from "respvis-core";

export const cssVarsDefaults = {
  // '--layout-width-factor': 0,
  // '--layout-height-factor': 0
  '--layout-width': 0,
  '--layout-width-pre-breakpoint': '0rem',
  '--layout-width-post-breakpoint': '0rem',
  '--layout-height': 0,
  '--layout-height-pre-breakpoint': '0rem',
  '--layout-height-post-breakpoint': '0rem',
  //LEGEND
  '--min-radius': '0',
  '--max-radius': '0'
} as const
export const cssVarDefaultsKeys= genKeyObjectFromObject(cssVarsDefaults)
export type CssVar = keyof typeof cssVarsDefaults;
export const cssVars: readonly CssVar[] = Object.keys(cssVarsDefaults) as CssVar[]


