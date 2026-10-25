import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock window.matchMedia for responsive components
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock @emotion/hash module to fix TypeError in tests
vi.mock('@emotion/hash', () => {
  const murmur2 = (str: string) => {
    let h = 0;
    let i = 0;
    let len = str.length;

    for (; len >= 4; ++i, len -= 4) {
      const k = str.charCodeAt(i) & 0xff |
                (str.charCodeAt(++i) & 0xff) << 8 |
                (str.charCodeAt(++i) & 0xff) << 16 |
                (str.charCodeAt(++i) & 0xff) << 24;

      h = (((h & 0xffff) * 0x5bd1e995 + ((h >>> 16) * 0xe995 << 16)) ^
           ((k & 0xffff) * 0x5bd1e995 + ((k >>> 16) * 0xe995 << 16))) >>> 0;
    }

    if (len === 3) {
      h ^= (str.charCodeAt(i + 2) & 0xff) << 16;
      len--;
    }
    if (len === 2) {
      h ^= (str.charCodeAt(i + 1) & 0xff) << 8;
      len--;
    }
    if (len === 1) {
      h ^= str.charCodeAt(i) & 0xff;
      h = ((h & 0xffff) * 0x5bd1e995 + ((h >>> 16) * 0xe995 << 16)) >>> 0;
    }

    h ^= h >>> 13;
    h = ((h & 0xffff) * 0x5bd1e995 + ((h >>> 16) * 0xe995 << 16)) >>> 0;
    return ((h ^ h >>> 15) >>> 0).toString(36);
  };

  return {
    __esModule: true,
    default: murmur2,
  };
});

// 桥接遗留 jest 风格测试：jest.fn/spyOn → vi
(globalThis as Record<string, unknown>).jest = vi;

// Mock ResizeObserver（antd 组件依赖）
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
(globalThis as Record<string, unknown>).ResizeObserver = ResizeObserverMock;
