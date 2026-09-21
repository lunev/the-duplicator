export type Content = {
  id: string;
  shortName: string;
  name: string;
  tagline: string;
  hero: { width: number; height: number };
  repoUrl: string;
  narrative: { heading: string; body: string[] };
  steps: { title: string; body: string }[];
  features: string[];
};

export const content: Content = {
  id: "cmbkalfnmgbghjoghgcplcmcijbdijei",
  shortName: "Tab Duplicator",
  name: "Tab Duplicator: Custom URL Parameters",
  tagline: "Duplicate a tab — with a twist.",
  hero: { width: 1400, height: 560 },
  repoUrl: "https://github.com/lunev/the-duplicator",
  narrative: {
    heading: "For developers and testers who live in the URL bar",
    body: [
      "Sometimes you need the same page again — but with a debug flag, a feature toggle, or a different locale. Tab Duplicator clones your current tab and appends the parameters you define, saving you the manual edit every single time.",
      "Define presets once and reproduce complex states with a single click.",
    ],
  },
  steps: [
    {
      title: "Define your presets",
      body: "Create named parameter sets like ?debug=true or ?locale=fr you use often.",
    },
    {
      title: "Duplicate a tab",
      body: "Click Tab Duplicator and pick a preset to open a copy with those parameters applied.",
    },
    {
      title: "Iterate faster",
      body: "Compare states side by side without ever touching the address bar.",
    },
  ],
  features: [
    "Duplicate any tab with custom URL parameters",
    "Save reusable parameter presets",
    "One-click reproduction of complex page states",
    "Keyboard shortcut support",
    "Works entirely locally with no data collected",
  ],
};
