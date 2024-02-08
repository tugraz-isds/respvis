import {ErrorMessages} from "../error";
import {BaseType, Selection} from "d3";

export function elementFromSelection<T extends BaseType>(selection?: Selection<T>): T {
  const element = selection?.node()
  if (!element) throw new Error(ErrorMessages.elementNotExisting)
  return element
}

// type WrapperFunction<T extends (...args: any[]) => K, K> = (func: T, delay: number) => T
export function throttle<T extends (...args: any[]) => K, K>(func: T, delayMs: number): T {
  let lastTime = 0;
  return function (...args) {
    const currentTime = new Date().getTime();
    if (currentTime - lastTime >= delayMs) {
      func.apply(this, args);
      lastTime = currentTime;
    }
  } as T
}
