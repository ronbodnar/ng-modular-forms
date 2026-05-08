import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-examples',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './examples.component.html',
  styleUrl: './examples.component.css',
})
export class ExamplesComponent {
  navigationLinks: NavigationLink[] = [
    { label: 'Native inputs', path: '/examples/basic-inputs' },
    { label: 'Material inputs', path: '/examples/material-inputs' },
    { label: 'Multi-step form', path: '/examples/multi-step' },
  ];
}

interface NavigationLink {
  label: string;
  path: string;
}
