export type Preferences = {
  basicMode: boolean;
  newTab: boolean;
  sidePanel: boolean;
  showGroups: boolean;
  showForm: boolean;
};

export type Param = {
  id: string;
  title: string;
};

export type Icon = {
  size?: string;
  color?: string;
};

export type Group = {
  id: string;
  name: string;
  items: string[];
  selected: boolean;
};
