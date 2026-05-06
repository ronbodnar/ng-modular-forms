# ng-modular-forms

**A structured Angular forms architecture for complex, scalable applications.**

`ng-modular-forms` provides separation of UI, orchestration, reactive logic, and data mapping into clearly
defined, reusable primitives.

[![npm version](https://badge.fury.io/js/%40ng-modular-forms%2Fcore.svg)](https://badge.fury.io/js/%40ng-modular-forms%2Fcore)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Packages

| Package                        | Description                                                                 |
| :----------------------------- | :-------------------------------------------------------------------------- |
| **@ng-modular-forms/core**     | Orchestration, handlers, mapping, input components                          |
| **@ng-modular-forms/material** | Angular Material-based input components                                     |

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

1. **Install the packages** you need
2. **Check out the examples** in the `/projects/examples` directory
3. **Run the demo app**:

```bash
git clone https://github.com/ronbodnar/ng-modular-forms.git
cd ng-modular-forms
npm install
npm run start:examples
```

Navigate to `http://localhost:4200` to see the interactive examples.

## The Problem

Angular reactive forms often become:

- tightly coupled to components
- overloaded with subscriptions
- hard to scale and reuse

## The Solution

ng-modular-forms separates concerns:

- **Orchestration** → form lifecycle + composition  
- **Handlers** → reactive logic  
- **Mappers** → API transformations  
- **UI** → reusable input components

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

##  Available Input Components

All inputs share a consistent API and can be swapped between native and Material implementations without changing form logic.

| Input Type      | Native Selector                | Material Selector                  | Description                                                                      |
|-----------------|--------------------------------|------------------------------------|----------------------------------------------------------------------------------|
| Text / Password | `nmf-text`                     | `nmf-mat-text`                     | Supports multiple input types including password with visibility toggle          |
| Number          | `nmf-number`                   | `nmf-mat-number`                   | Numeric input with type-safe value handling                                      |
| Currency        | `nmf-currency`                 | `nmf-mat-currency`                 | Formatted currency input with parsing and display formatting                     |
| Date            | `nmf-datepicker`               | `nmf-mat-datepicker`               | Date selection with native or Angular Material datepicker UI                     |
| Time            | `nmf-timepicker`               | `nmf-mat-timepicker`               | Time input with structured formatting                                            |
| Select          | `nmf-select`                   | `nmf-mat-select`                   | Dropdown/select with support for disabled options                                |
| Textarea        | `nmf-textarea`                 | `nmf-mat-textarea`                 | Multi-line text input with configurable rows                                     |

###  Shared Features

- Implements `ControlValueAccessor`
- Fully compatible with Angular Reactive Forms
- Consistent API across all inputs
- Built-in validation state + error messaging
- Label, required indicator, and loading state support
- Behavior-driven input handling (formatting, parsing, restrictions)

## When to Use

Use this library when your application has:

- complex or multi-step forms
- shared form logic across features
- API-driven form transformations
- nested or dynamically composed forms
- or you just want **simple declarative form structures without the boilerplate**

## License

MIT
