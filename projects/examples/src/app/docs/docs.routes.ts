import { Routes } from '@angular/router';
import { MaterialInputsExampleComponent } from './examples/material-inputs/material-inputs.component';
import { MultiStepFormComponent } from './examples/multi-step-form/multi-step-form.component';
import { NativeInputsExampleComponent } from './examples/native-inputs/native-inputs.component';
import { DocsComponent } from './docs.component';
import { GettingStartedComponent } from './guides/getting-started/getting-started.component';

export const routes: Routes = [
  {
    path: 'docs',
    component: DocsComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'examples' },

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
            redirectTo: 'basic-inputs',
          },
          {
            path: 'basic-inputs',
            component: NativeInputsExampleComponent,
          },
          {
            path: 'material-inputs',
            component: MaterialInputsExampleComponent,
          },
          {
            path: 'multi-step',
            component: MultiStepFormComponent,
          },
        ],
      },
    ],
  },
];
