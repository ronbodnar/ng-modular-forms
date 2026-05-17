import type { NavItem } from './side-nav.types';

export const SIDE_NAV_ITEMS: NavItem[] = [
  {
    sectionName: 'guides',
    label: 'Guides',
    children: [
      {
        label: 'Getting Started',
        route: '/docs/guides/getting-started',
      },
    ],
  },
  {
    sectionName: 'examples',
    label: 'Examples',
    children: [
      {
        label: 'Native Inputs',
        route: '/docs/examples/native-inputs',
      },
      {
        label: 'Material Inputs',
        route: '/docs/examples/material-inputs',
      },
      {
        label: 'Multi-Step Form',
        route: '/docs/examples/multi-step-form',
      },
    ],
  },
];
