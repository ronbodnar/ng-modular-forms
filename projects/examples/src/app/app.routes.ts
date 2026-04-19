import { Routes } from '@angular/router';
import { SimpleFormNoOrchestrationComponent } from './simple-form-no-orchestration/simple-form-no-orchestration.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/simple-form-no-orchestration',
  },
  {
    path: 'simple-form-no-orchestration',
    component: SimpleFormNoOrchestrationComponent,
  },
];
