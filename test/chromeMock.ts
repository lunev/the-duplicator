import { afterEach, Mock, vi } from 'vitest';

afterEach(() => {
  mockStorage = {};
});

type MockStorageType = {
  [key: string]: unknown;
};

// Mock chrome storage
let mockStorage: MockStorageType = {};

// Mock chrome voices
const mockVoices: chrome.tts.TtsVoice[] = [
  { voiceName: 'Voice 1', lang: 'en-US' },
  { voiceName: 'Voice 2', lang: 'en-GB' },
];

// Mock badge
type mockBadgeTypes = {
  text: string;
  textColor: string | [number, number, number, number];
  backgroundColor: string | [number, number, number, number];
};
const mockBadge: mockBadgeTypes = {
  text: '',
  textColor: '',
  backgroundColor: '',
};

// Mock tts
const mockTts: {
  speak: boolean;
  stop: boolean;
} = {
  speak: false,
  stop: false,
};

global.chrome = {
  storage: {
    sync: {
      set: vi.fn((items) => {
        Object.assign(mockStorage, items);
        return Promise.resolve();
      }),
      get: vi.fn((keys) => {
        return new Promise((resolve) => {
          const result = {};
          const keysArray = Array.isArray(keys) ? keys : [keys];
          keysArray.forEach((key: string) => {
            result[key] = mockStorage[key];
          });
          resolve(result);
        });
      }),
      clear: vi.fn(() => {
        mockStorage = {};
        return Promise.resolve();
      }),
      onChanged: {
        addListener: vi.fn(),
        removeListener: vi.fn(),
        hasListener: vi.fn(),
        getRules: vi.fn(),
        addRules: vi.fn(),
        removeRules: vi.fn(),
        hasListeners: vi.fn(),
      },
      getBytesInUse: vi.fn(),
      remove: vi.fn(),
      setAccessLevel: vi.fn(),
      // eslint-disable-next-line
      // @ts-ignore
      getKeys: vi.fn(),
      MAX_SUSTAINED_WRITE_OPERATIONS_PER_MINUTE: 0,
      QUOTA_BYTES: 0,
      QUOTA_BYTES_PER_ITEM: 0,
      MAX_ITEMS: 0,
      MAX_WRITE_OPERATIONS_PER_HOUR: 0,
      MAX_WRITE_OPERATIONS_PER_MINUTE: 0,
    },
    onChanged: {
      addListener: vi.fn(),
      getRules: vi.fn(),
      hasListener: vi.fn(),
      removeRules: vi.fn(),
      addRules: vi.fn(),
      removeListener: vi.fn(),
      hasListeners: vi.fn(),
    },
    AccessLevel: {
      TRUSTED_AND_UNTRUSTED_CONTEXTS: 'TRUSTED_AND_UNTRUSTED_CONTEXTS',
      TRUSTED_CONTEXTS: 'TRUSTED_CONTEXTS',
    },
  },
  action: {
    setBadgeText: vi.fn((details: { text: string }): Promise<void> => {
      mockBadge.text = details.text;
      return Promise.resolve();
    }),
    getBadgeText: vi.fn(() => {
      return Promise.resolve(mockBadge.text);
    }),
    setBadgeBackgroundColor: vi.fn(
      (details: {
        color: string | [number, number, number, number];
      }): Promise<void> => {
        mockBadge.backgroundColor = details.color;
        return Promise.resolve();
      },
    ),
    setBadgeTextColor: vi.fn(
      (details: {
        color: string | [number, number, number, number];
      }): Promise<void> => {
        mockBadge.textColor = details.color;
        return Promise.resolve();
      },
    ),
    getBadgeBackgroundColor: vi.fn(
      (): Promise<[number, number, number, number]> => {
        // eslint-disable-next-line
        // @ts-ignore
        return Promise.resolve(mockBadge.backgroundColor);
      },
    ),
    getBadgeTextColor: vi.fn((): Promise<[number, number, number, number]> => {
      // eslint-disable-next-line
      // @ts-ignore
      return Promise.resolve(mockBadge.textColor);
    }),
    disable: vi.fn(),
    enable: vi.fn(),
    getPopup: vi.fn(),
    getTitle: vi.fn(),
    getUserSettings: vi.fn(),
    isEnabled: vi.fn(),
    openPopup: vi.fn(),
    setIcon: vi.fn(),
    setPopup: vi.fn(),
    setTitle: vi.fn(),
    // eslint-disable-next-line
    // @ts-ignore
    onClicked: vi.fn(),
  },
  tts: {
    speak: vi.fn((utterance: string) => {
      return Promise.resolve(utterance);
    }),
    stop: vi.fn(() => {
      mockTts.stop = true;
      return mockTts.stop;
    }),
    isSpeaking: vi.fn(() => Promise.resolve()),
    getVoices: vi.fn(() => Promise.resolve(mockVoices)),
    pause: vi.fn(() => Promise.resolve()),
    resume: vi.fn(() => Promise.resolve()),
  },
  alarms: {
    // eslint-disable-next-line
    // @ts-ignore
    clear: vi.fn((name: string) => {
      return Promise.resolve(name);
    }),
    // eslint-disable-next-line
    // @ts-ignore
    create: vi.fn((name: string) => {
      return Promise.resolve(name);
    }),
    // eslint-disable-next-line
    // @ts-ignore
    onAlarm: {
      addListener: vi.fn(),
    },
  },
  runtime: {
    openOptionsPage: vi.fn(() => {}),
    onInstalled: {
      addListener: vi.fn((callback) => {
        callback({ reason: 'update', previousVersion: '4.0.0' });
      }),
      removeListener: vi.fn(),
      hasListener: vi.fn(() => true),
    },
  },
  tabs: {
    // eslint-disable-next-line
    // @ts-ignore
    query: vi
      .fn()
      .mockResolvedValue([{ url: 'https://www.google.com/', index: 1 }]),
    create: vi
      .fn()
      .mockImplementation((props) => Promise.resolve({ ...props })),
    // eslint-disable-next-line
    // @ts-ignore
    remove: vi.fn((tabId, callback) => {
      if (callback) callback();
    }),
    // eslint-disable-next-line
    // @ts-ignore
    update: vi
      .fn()
      .mockImplementation((props) => Promise.resolve({ ...props })),
  },
};
