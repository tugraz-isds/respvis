export const cssVarsDefaults = {
  // '--layout-width-factor': 0,
  // '--layout-height-factor': 0
  '--layout-width': 0,
  '--layout-height': 0,
} as const
export type CssVar = keyof typeof cssVarsDefaults;
export const cssVars: readonly CssVar[] = Object.keys(cssVarsDefaults) as CssVar[]


