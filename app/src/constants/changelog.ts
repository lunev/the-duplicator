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
  version: '7.3.0',
  title: "What's New",
  features: [
    {
      title: 'Redesigned update banner',
      description: 'This "What\'s New" banner now appears on every page with a cleaner, easier-to-scan design.',
    },
    {
      title: 'Animated placeholder examples',
      description: 'The URL parameter and group name fields now show animated example text to help you get started.',
    },
  ],
};
