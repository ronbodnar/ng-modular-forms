import type { Routes } from '@angular/router';
import { MaterialInputsExampleComponent } from './examples/material-inputs/material-inputs.component';
import { MultiStepFormComponent } from './examples/multi-step-form/multi-step-form.component';
import { NativeInputsExampleComponent } from './examples/native-inputs/native-inputs.component';
import { GettingStartedComponent } from './guides/getting-started/getting-started.component';

export const routes: Routes = [
  {
    path: 'docs',
    children: [
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
            component: NativeInputsExampleComponent,
          },
          {
            path: 'material-inputs',
            component: MaterialInputsExampleComponent,
          },
          {
            path: 'multi-step-form',
            component: MultiStepFormComponent,
          },
        ],
      },
    ],
  },
];
