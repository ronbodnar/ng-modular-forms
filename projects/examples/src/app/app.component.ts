import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { A11yModule } from '@angular/cdk/a11y';

interface NavigationLink {
  label: string;
  path: string;
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, A11yModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'examples';

  navigationLinks: NavigationLink[] = [
    { label: 'Basic input components', path: '/forms/basic-inputs' },
    { label: 'Material input components', path: '/forms/material-inputs' },
    { label: 'Registration', path: '/forms/registration' },
  ];
}
