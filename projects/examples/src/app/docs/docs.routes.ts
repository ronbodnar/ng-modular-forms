import type { Routes } from '@angular/router';
import { GettingStartedComponent } from './guides/getting-started/getting-started.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'guides' },

  {
    path: 'guides',
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'getting-started' },
      { path: 'getting-started', component: GettingStartedComponent },
    ],
  },

  {
    path: 'examples',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'native-inputs',
      },
      {
        path: 'native-inputs',
        loadComponent: () =>
          import('./examples/native-inputs/native-inputs.component').then(
            (m) => m.NativeInputsExampleComponent,
          ),
      },
      {
        path: 'material-inputs',
        loadComponent: () =>
          import('./examples/material-inputs/material-inputs.component').then(
            (m) => m.MaterialInputsExampleComponent,
          ),
      },
      {
        path: 'multi-step-form',
        loadComponent: () =>
          import('./examples/multi-step-form/multi-step-form.component').then(
            (m) => m.MultiStepFormComponent,
          ),
      },
    ],
  },
];
