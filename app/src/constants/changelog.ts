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
  version: '7.4.0',
  title: "What's New",
  features: [
    {
      title: 'Redesigned page header',
      description:
        'Settings, Import Parameters, and Groups now show a back arrow and page title in the header instead of a text link.',
    },
  ],
};
