<p align="center">
  <img src="https://raw.githubusercontent.com/ronbodnar/ng-modular-forms/main/projects/examples/public/icons/apple-touch-icon.png" height="120" alt="ng-modular-forms logo" />
</p>

<h1 align="center">ng-modular-forms</h1>

<p align="center">
  <strong>A structured Angular forms architecture built for complex, scalable applications.</strong>
</p>

<p align="center">
  <a href="https://github.com/ronbodnar/ng-modular-forms/actions/workflows/ci-cd.yml"><img src="https://github.com/ronbodnar/ng-modular-forms/actions/workflows/ci-cd.yml/badge.svg" alt="CI/CD" /></a>
  <a href="https://angular.dev"><img src="https://img.shields.io/badge/Angular-19--21-DD0031?logo=angular" alt="Angular Version" /></a>
  <a href="https://www.npmjs.com/package/@ng-modular-forms/core"><img src="https://badge.fury.io/js/%40ng-modular-forms%2Fcore.svg" alt="npm version" /></a>
  <a href="/LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT" /></a>
</p>

<p align="center">
  <a href="https://ngmf.ronbodnar.com/docs/examples">
    <strong>Live Examples & Interactive Demo</strong>
  </a>
</p>

## Why ng-modular-forms?

Angular Reactive Forms often become difficult to maintain or scale as applications grow:

- Reactive subscriptions spread across components
- Cross-field behavior becomes tightly coupled
- API mapping logic becomes duplicated
- Large forms become difficult to test and reuse

`@ng-modular-forms/core` introduces a modular architecture that separates:

- form orchestration
- reactive behavior
- API mapping
- reusable form controls

Built on top of Angular Reactive Forms — not a replacement.

Designed for scalable, enterprise-grade Angular applications.

Compatible with Angular 19–21.

## Packages
<table>
  <tr>
    <th style="white-space: nowrap;">Package</th>
    <th>Description</th>
    <th style="white-space: nowrap;">Links</th>
  </tr>

  <tr>
    <td style="white-space: nowrap;"><b>@ng-modular-forms/core</b></td>
    <td>
      Form orchestration, reactive behavior handling, API mapping, and state hydration
    </td>
    <td style="white-space: nowrap;">
      <a href="https://www.npmjs.com/package/@ng-modular-forms/core">npm</a>,
      <a href="https://github.com/ronbodnar/ng-modular-forms/tree/main/projects/core#readme">docs</a>
    </td>
  </tr>

  <tr>
    <td style="white-space: nowrap;"><b>@ng-modular-forms/material</b></td>
    <td>
      Angular Material-based input components
    </td>
    <td style="white-space: nowrap;">
      <a href="https://www.npmjs.com/package/@ng-modular-forms/material">npm</a>,
      <a href="https://github.com/ronbodnar/ng-modular-forms/tree/main/projects/material#readme">docs</a>
    </td>
  </tr>
</table>

## Installation

Start with core:

```bash
npm install @ng-modular-forms/core
```

Add Material UI support if needed:

```bash
npm install @ng-modular-forms/material
```

## Styles Setup
Add the corresponding styles to your application's angular.json file under the styles array. Only include the files for the packages you are actively using:

```json
"styles": [
  "src/styles.css",
  
  // Required ONLY if using @ng-modular-forms/core native controls
  "node_modules/@ng-modular-forms/core/styles/form-controls.css",
  
  // Required ONLY if using @ng-modular-forms/material
  "node_modules/@ng-modular-forms/material/styles/form-controls.css"
]
```

### Peer Dependencies

For the Material package, you'll also need:

```bash
npm install @angular/material @angular/cdk
```

## Quick Start

Clone and run the examples app:

```bash
git clone https://github.com/ronbodnar/ng-modular-forms.git
cd ng-modular-forms
npm install
npm start
```

Navigate to `http://localhost:4200/docs/examples` to see the interactive examples.

##  Simple Example

```typescript
@Component({
  template: `
    <form [formGroup]="form">
      <nmf-text formControlName="name" label="Name" />
      <nmf-currency formControlName="salary" label="Salary" />
    </form>
  `,
})
export class ExampleComponent {
  form = new FormGroup({
    name: new FormControl<string>('', Validators.required),
    salary: new FormControl<number | null>(null),
  });
}
```

##  Input Components

All inputs share a consistent API and are interchangeable between Native and Material implementations without changing form logic.

| Input Type      | Native Selector                | Material Selector                  | Description                                     |
|-----------------|--------------------------------|------------------------------------|-------------------------------------------------|
| Text / Password | `nmf-text`                     | `nmf-mat-text`                     | Text / password input with toggle support       |
| Lookup          | `nmf-lookup`                   | `nmf-mat-lookup`                   | Synchronous or asynchronous lookup/autocomplete |
| Number          | `nmf-number`                   | `nmf-mat-number`                   | Type-safe numeric input                         |
| Currency        | `nmf-currency`                 | `nmf-mat-currency`                 | Formatting + parsing support                    |
| Date            | `nmf-datepicker`               | `nmf-mat-datepicker`               | Native or Material datepicker                   |
| Time            | `nmf-timepicker`               | `nmf-mat-timepicker`               | Structured time input                           |
| Select          | `nmf-select`                   | `nmf-mat-select`                   | Dropdown with option support                    |
| Textarea        | `nmf-textarea`                 | `nmf-mat-textarea`                 | Multi-line input                                |

###  Shared Features

- `ControlValueAccessor` compatible
- Fully compatible with Angular Reactive Forms
- Consistent API across all inputs
- Built-in validation state + error messaging
- Label, required indicator, and loading state support
- Behavior-driven input handling (formatting, parsing, restrictions)

## Requirements

- Angular 19–21
- Reactive Forms module

## License

MIT
