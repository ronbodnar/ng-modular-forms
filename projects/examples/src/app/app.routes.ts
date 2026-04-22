import { Routes } from '@angular/router';
import { RegistrationFormComponent } from './forms/registration-form/registration-form.component';
import { BasicInputsFormComponent } from './forms/basic-inputs/basic-inputs.component';
import { MaterialInputsFormComponent } from './forms/material-inputs/material-inputs.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/forms/basic-inputs',
  },
  {
    path: 'forms',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/forms/basic-inputs',
      },
      {
        path: 'basic-inputs',
        component: BasicInputsFormComponent,
      },
      {
        path: 'material-inputs',
        component: MaterialInputsFormComponent,
      },
      {
        path: 'registration',
        component: RegistrationFormComponent,
      },
      {
        path: '**',
        redirectTo: '/forms/basic-inputs',
      },
    ],
  },
];
