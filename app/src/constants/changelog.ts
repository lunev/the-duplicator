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
  version: '7.6.1',
  title: "What's New",
  features: [
    {
      title: 'Accessibility fixes',
      description:
        'The import-file picker, per-parameter actions menu, and "Add parameter" form are now fully keyboard- and screen-reader-accessible.',
    },
  ],
};
