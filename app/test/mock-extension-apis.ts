import { vi } from 'vitest';

vi.stubGlobal('chrome', {
  storage: {
    sync: {
      set: vi.fn(),
      get: vi.fn(),
      remove: vi.fn(),
    },
    local: {
      set: vi.fn().mockResolvedValue(undefined),
      get: vi.fn().mockResolvedValue({}),
      remove: vi.fn().mockResolvedValue(undefined),
    },
  },
  tabs: {
    query: vi.fn(),
    create: vi.fn().mockImplementation((props) => Promise.resolve({ ...props })),
    update: vi.fn().mockImplementation((props) => Promise.resolve({ ...props })),
  },
  runtime: {
    onInstalled: {
      addListener: vi.fn(),
    },
    openOptionsPage: vi.fn(),
  },
  sidePanel: {
    setPanelBehavior: vi.fn(),
  },
} as unknown as typeof chrome);
