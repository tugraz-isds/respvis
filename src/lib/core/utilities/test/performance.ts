// let testNum: number = 0

export function measureFunctionPerformance(func: any) {
  let startTime = performance.now()
  // for (let i = 0; i < 15000000; i++) {
  //   testNum++
  // }
  const res = func()
  const endTime = performance.now()
  const timeDifference = endTime - startTime
  console.log('Time between renders (in s):', timeDifference)
  return res
}
