export function throttle<T extends (...args: any[]) => K, K>(func: T, delayMs: number) {
  return {
    lastTime: 0,
    func: function (...args: any[]) {
      const currentTime = new Date().getTime();
      if (currentTime - this.lastTime >= delayMs) {
        // console.trace('Func Works!?', currentTime - this.lastTime)
        func.apply(this, args);
        this.lastTime = currentTime;
      }
    }
  }
}

export class ThrottleScheduled<T extends (...args: any[]) => K, K> {
  func: T
  lastTime = 0
  delayMs: number
  timeout?: NodeJS.Timeout
  constructor(func: T, delayMs: number) {
    this.func = func
    this.delayMs = delayMs
  }
  invokeScheduled(...args: any[]) {
    const currentTime = new Date().getTime()
    const timeDiff = currentTime - this.lastTime
    if (timeDiff < this.delayMs) {
      this.timeout = setTimeout(() => this.invokeScheduled(...args), timeDiff)
      return
    }
    clearTimeout(this.timeout)
    this.func.apply(this, args)
    this.lastTime = currentTime
  }
}
