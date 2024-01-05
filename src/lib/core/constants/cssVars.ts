export const cssVarsDefaults = {
  // '--transform-factor-width': 0,
  // '--transform-factor-height': 0
  '--transform-index-width': 0,
  '--transform-index-height': 0,
} as const
export type CssVar = keyof typeof cssVarsDefaults;
export const cssVars: readonly CssVar[] = Object.keys(cssVarsDefaults) as CssVar[]


