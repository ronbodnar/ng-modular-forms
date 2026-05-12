import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppShellComponent } from './layout/app-shell/app-shell.component';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    AppShellComponent,
  ],
  template: `
    <app-app-shell-content>
      <router-outlet />
    </app-app-shell-content>
  `,
})
export class AppComponent {}
