import type { Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { routes as docsRoutes } from './docs/docs.routes';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: LandingComponent,
  },

  ...docsRoutes,

  {
    path: '**',
    redirectTo: '',
  },
];
