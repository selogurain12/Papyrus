import "@testing-library/jest-dom";

if (!globalThis.ResizeObserver) {
  globalThis.ResizeObserver = class ResizeObserver {
    public observe() {}
    public unobserve() {}
    public disconnect() {}
  };
}

if (!globalThis.DOMRect) {
  globalThis.DOMRect = class DOMRect {
    public bottom = 0;
    public height = 0;
    public left = 0;
    public right = 0;
    public top = 0;
    public width = 0;
    public x = 0;
    public y = 0;

    public constructor(x = 0, y = 0, width = 0, height = 0) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.left = x;
      this.top = y;
      this.right = x + width;
      this.bottom = y + height;
    }

    public static fromRect(rectangle?: Partial<DOMRectInit>) {
      return new DOMRect(rectangle?.x, rectangle?.y, rectangle?.width, rectangle?.height);
    }

    public toJSON() {
      return { ...this };
    }
  } as typeof DOMRect;
}

if (!globalThis.PointerEvent) {
  globalThis.PointerEvent = MouseEvent as unknown as typeof PointerEvent;
}

if (!Element.prototype.hasPointerCapture) {
  Element.prototype.hasPointerCapture = () => false;
}

if (!Element.prototype.setPointerCapture) {
  Element.prototype.setPointerCapture = () => {};
}

if (!Element.prototype.releasePointerCapture) {
  Element.prototype.releasePointerCapture = () => {};
}

if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}
