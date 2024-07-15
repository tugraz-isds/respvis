export const cursorClasses = [
  'cursor--invert-vertical',
  'cursor--invert-up',
  'cursor--invert-horizontal',
  'cursor--invert-right',
  'cursor--range-vertical',
  'cursor--range-up',
  'cursor--range-horizontal',
  'cursor--range-left',
  'cursor--range-rect',
  'cursor--range-rect-horizontal',
  'cursor--drag-horizontal',
  'cursor--drag-right-only',
  'cursor--drag-left-only',
  'cursor--drag-vertical',
  'cursor--drag-up-only',
  'cursor--drag-down-only',
] as const
type CursorClass = typeof cursorClasses[number]
