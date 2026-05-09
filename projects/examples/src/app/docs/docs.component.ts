import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-docs',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './docs.component.html',
  styleUrl: './docs.component.css',
})
export class DocsComponent {
  readonly router = inject(Router);

  navigationItems: Record<string, NavigationLink[]> = {
    guides: [
      { label: 'Getting Started', path: '/docs/guides/getting-started' },
    ],
    examples: [
      { label: 'Native inputs', path: '/docs/examples/basic-inputs' },
      { label: 'Material inputs', path: '/docs/examples/material-inputs' },
      { label: 'Multi-step form', path: '/docs/examples/multi-step' },
    ],
  };

  navigationSections = Object.keys(this.navigationItems);
}

interface NavigationLink {
  label: string;
  path: string;
}
