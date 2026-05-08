import { Routes } from '@angular/router';
import { NativeInputsExampleComponent } from './examples/native-inputs/native-inputs.component';
import { MaterialInputsExampleComponent } from './examples/material-inputs/material-inputs.component';
import { MultiStepFormComponent } from './examples/multi-step-form/multi-step-form.component';
import { ExamplesComponent } from './examples/examples.component';
import { LandingComponent } from './landing/landing.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: LandingComponent,
  },
  {
    path: 'examples',
    component: ExamplesComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/examples/basic-inputs',
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
      {
        path: '**',
        redirectTo: '/',
      },
    ],
  },
];
