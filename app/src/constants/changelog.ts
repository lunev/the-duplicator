export interface ChangelogFeature {
  title: string;
  description: string;
}

export interface ChangelogEntry {
  version: string;
  title: string;
  features: ChangelogFeature[];
}

export const CHANGELOG: ChangelogEntry = {
  version: '7.5.0',
  title: "What's New",
  features: [
    {
      title: 'Feedback & Support',
      description:
        'A dismissible corner prompt and a new "Support" item in the header menu now link to the Chrome Web Store support page.',
    },
    {
      title: 'Copy parameter',
      description: 'Each URL parameter now has a copy icon, revealed on hover, to copy it to your clipboard.',
    },
  ],
};
