<p align="center">
  <img src="projects/examples/public/icons/apple-touch-icon.png" height="120" alt="ng-modular-forms logo" />
</p>

<h1 align="center">ng-modular-forms</h1>

<p align="center">
  <strong>A structured Angular forms architecture built for complex, scalable applications.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT" />
  <img src="https://badge.fury.io/js/%40ng-modular-forms%2Fcore.svg" alt="npm version" />
  <img src="https://img.shields.io/badge/Angular-v19--21-DD0031?logo=angular" alt="Angular Version" />
</p>

## Why ng-modular-forms?

Angular Reactive Forms tend to grow into tightly coupled components containing UI logic, reactive subscriptions, and API mapping.

`ng-modular-forms` introduces a separation of concerns that keeps forms scalable and maintainable.

It splits form logic into reusable building blocks:

- **FormOrchestrator** – form lifecycle and composition
- **FormHandlerBase** – reactive logic and cross-field behavior
- **FormMapperBase** – API ↔ UI transformations
- **FormControlBase** – reusable form controls (CVA-based)

**Note:** `ng-modular-forms` builds on top of Angular Reactive Forms. It does not replace them.

## Installation

Start with core:

```bash
npm install @ng-modular-forms/core
```

Add Material UI support if needed:

```bash
npm install @ng-modular-forms/material
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
ng serve
```

Navigate to `http://localhost:4200/docs/examples` to see the interactive examples.

##  Simple Example

```ts
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

## Packages

| Package                        | Description                                                          |
| :----------------------------- | :------------------------------------------------------------------- |
| **@ng-modular-forms/core**     | Orchestration, handlers, mapping, hydration, serialization, controls |
| **@ng-modular-forms/material** | Angular Material-based input components                              |

##  Input Components

All inputs share a consistent API and are interchangeable between Native and Material implementations without changing form logic.

| Input Type      | Native Selector                | Material Selector                  | Description                                 |
|-----------------|--------------------------------|------------------------------------|---------------------------------------------|
| Text / Password | `nmf-text`                     | `nmf-mat-text`                     | Text / password input with toggle support   |
| Number          | `nmf-number`                   | `nmf-mat-number`                   | Type-safe numeric input                     |
| Currency        | `nmf-currency`                 | `nmf-mat-currency`                 | Formatting + parsing support                |
| Date            | `nmf-datepicker`               | `nmf-mat-datepicker`               | Native or Material datepicker               |
| Time            | `nmf-timepicker`               | `nmf-mat-timepicker`               | Structured time input                       |
| Select          | `nmf-select`                   | `nmf-mat-select`                   | Dropdown with option support                |
| Textarea        | `nmf-textarea`                 | `nmf-mat-textarea`                 | Multi-line input                            |

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
