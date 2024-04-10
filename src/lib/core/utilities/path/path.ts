export function pathScale(d: string, scale: number) {
  const numberPattern = /[-+]?\d*\.?\d+(?:[eE][-+]?\d+)?/g
  return d.replace(numberPattern, function(match) {
    console.log(match)
    return (parseFloat(match) * scale).toString();
  })
}
