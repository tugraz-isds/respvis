export class RawCSSHandler {
  private styleElement: HTMLStyleElement
  constructor(private rawCSS: string) {
    this.styleElement = document.createElement('style');
    this.styleElement.textContent = rawCSS;
  }
  addToHead() {
    document.head.appendChild(this.styleElement)
  }
  removeFromHead() {
    if (this.styleElement.parentNode === document.head) {
      document.head.removeChild(this.styleElement)
    }
  }
}
