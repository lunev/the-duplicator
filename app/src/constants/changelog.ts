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
  version: '7.6.0',
  title: "What's New",
  features: [
    {
      title: 'New name',
      description:
        'Renamed to "Tab Duplicator: Custom URL Parameters" to be easier to find in the Chrome Web Store — same extension, same data, no action needed.',
    },
    {
      title: 'Drag-to-reorder',
      description:
        'Reorder your saved URL parameters by dragging the handle — list order determines which number key (1-9) opens each one, so put your most-used parameters first.',
    },
  ],
};
