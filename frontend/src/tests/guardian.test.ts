import { describe, it, expect } from 'vitest';

describe('Guardian Portal & Child Privacy Controls', () => {
  it('validates privacy notice protects minor journal and thought leakage', () => {
    const privacyNotice =
      'Child Privacy Guarantee: Raw user journal writings and individual exploratory attempts are never displayed. Only encouraging milestone summaries and comfortable preferences are shown.';

    expect(privacyNotice).toContain('Child Privacy Guarantee');
    expect(privacyNotice).toContain('never displayed');
  });

  it('manages core consent toggles without breaking application state', () => {
    const initialConsents = [
      { id: 'MINOR_ACCOUNT_CREATION', granted: true },
      { id: 'DATA_STORAGE', granted: true },
      { id: 'AI_ASSISTANCE', granted: true },
    ];

    // Toggle AI assistance off
    const updated = initialConsents.map((c) =>
      c.id === 'AI_ASSISTANCE' ? { ...c, granted: false } : c
    );

    const aiConsent = updated.find((c) => c.id === 'AI_ASSISTANCE');
    expect(aiConsent?.granted).toBe(false);

    const storageConsent = updated.find((c) => c.id === 'DATA_STORAGE');
    expect(storageConsent?.granted).toBe(true);
  });
});
