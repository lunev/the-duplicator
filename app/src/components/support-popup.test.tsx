import { vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import SupportPopup from './support-popup';

const mockStorageLocalGet = (value: Record<string, unknown>) => {
  vi.mocked(chrome.storage.local.get).mockImplementation(
    (() => Promise.resolve(value)) as typeof chrome.storage.local.get,
  );
};

describe('SupportPopup', () => {
  it('links to the Chrome Web Store support page', async () => {
    mockStorageLocalGet({});
    render(<SupportPopup />);
    const link = await screen.findByRole('link', { name: 'Get support here' });
    expect(link).toHaveAttribute(
      'href',
      'https://chromewebstore.google.com/detail/the-duplicator/cmbkalfnmgbghjoghgcplcmcijbdijei/support',
    );
  });
});
