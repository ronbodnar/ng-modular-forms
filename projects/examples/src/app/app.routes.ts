import type { Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: LandingComponent,
  },

  {
    path: 'docs',
    loadChildren: () => import('./docs/docs.routes').then((m) => m.routes),
  },

  {
    path: '**',
    redirectTo: '',
  },
];
