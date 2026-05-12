export interface NavItem {
  sectionName: string;
  label: string;
  icon?: string;
  route?: string;
  children?: { label: string; route: string }[];
}
