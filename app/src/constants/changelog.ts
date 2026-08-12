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
  version: '7.2.0',
  title: "What's New",
  features: [
    {
      title: 'Redesigned Import Params',
      description: 'Selecting a file now imports it automatically, with a toast notification confirming success or explaining what went wrong.',
    },
    {
      title: 'Smarter forms',
      description: "The Add/Go buttons are disabled until you've entered something, instead of letting you submit and then showing an error.",
    },
  ],
};