// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

jest.mock('phaser', () => {
  class Scene {
    constructor(key) {
      this.scene = { key };
    }
  }

  return {
    AUTO: 'AUTO',
    Scale: {
      FIT: 'FIT',
      CENTER_BOTH: 'CENTER_BOTH',
    },
    Input: {
      Keyboard: {
        KeyCodes: {
          ESC: 27,
          R: 82,
          SPACE: 32,
        },
        JustDown: jest.fn(() => false),
      },
    },
    Math: {
      Angle: {
        RotateTo: jest.fn((from, to) => to || from),
      },
      Clamp: jest.fn((value, min, max) => global.Math.max(min, global.Math.min(max, value))),
      Distance: {
        Between: jest.fn(() => 9999),
      },
      Interpolation: {
        CatmullRom: jest.fn((values) => values[1] || 0),
      },
      Linear: jest.fn((from, to, amount) => from + (to - from) * amount),
    },
    Game: jest.fn().mockImplementation(() => ({
      destroy: jest.fn(),
      registry: {
        set: jest.fn(),
      },
    })),
    Scene,
  };
});

class IntersectionObserverMock {
  constructor(callback) {
    this.callback = callback;
  }

  observe(element) {
    this.callback([{ isIntersecting: true, intersectionRatio: 1, target: element }]);
  }

  unobserve() {}

  disconnect() {}
}

window.IntersectionObserver = IntersectionObserverMock;
global.IntersectionObserver = IntersectionObserverMock;

window.matchMedia = (query) => ({
  matches: false,
  media: query,
  onchange: null,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  addListener: jest.fn(),
  removeListener: jest.fn(),
  dispatchEvent: jest.fn(),
});

window.requestAnimationFrame = () => 1;
window.cancelAnimationFrame = () => {};

HTMLCanvasElement.prototype.getContext = () => ({
  setTransform: jest.fn(),
  clearRect: jest.fn(),
  fillRect: jest.fn(),
  strokeRect: jest.fn(),
  beginPath: jest.fn(),
  closePath: jest.fn(),
  arc: jest.fn(),
  fill: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  stroke: jest.fn(),
  drawImage: jest.fn(),
  save: jest.fn(),
  restore: jest.fn(),
  translate: jest.fn(),
  rotate: jest.fn(),
  scale: jest.fn(),
  measureText: jest.fn(() => ({ width: 0 })),
  getImageData: jest.fn(() => ({ data: new Uint8ClampedArray(4) })),
  createImageData: jest.fn(() => ({ data: new Uint8ClampedArray(4) })),
  putImageData: jest.fn(),
});
