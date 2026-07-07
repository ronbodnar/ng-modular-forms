<p align="center">
  <img src="https://raw.githubusercontent.com/ronbodnar/ng-modular-forms/main/projects/examples/public/icons/apple-touch-icon.png" height="120" alt="ng-modular-forms logo" />
</p>

<h1 align="center">@ng-modular-forms/material</h1>

<p align="center">
  <strong>
    Angular Material form controls for typed reactive forms with CVA support.
  </strong>
</p>

<p align="center">
  <a href="https://github.com/ronbodnar/ng-modular-forms/actions/workflows/ci-cd.yml"><img src="https://github.com/ronbodnar/ng-modular-forms/actions/workflows/ci-cd.yml/badge.svg" alt="CI/CD" /></a>
  <a href="https://angular.dev"><img src="https://img.shields.io/badge/Angular-19--21-DD0031?logo=angular" alt="Angular Version" /></a>
  <a href="https://www.npmjs.com/package/@ng-modular-forms/material"><img src="https://badge.fury.io/js/%40ng-modular-forms%2Fmaterial.svg" alt="npm version" /></a>
  <a href="https://github.com/ronbodnar/ng-modular-forms/blob/main/projects/material/LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT" /></a>
</p>

<p align="center">
  <a href="https://ngmf.ronbodnar.com/docs/examples">
    <strong>Live Examples & Interactive Demo</strong>
  </a>
</p>

## Installation

```bash
npm install @ng-modular-forms/material
```
Note: This will also install <a href="https://www.npmjs.com/package/@ng-modular-forms/core">@ng-modular-forms/core</a>.

## Styles Setup
Add the global styles to your application's angular.json file under the styles array:

```json
"styles": [
  "src/styles.css",
  "node_modules/@ng-modular-forms/material/styles/form-controls.css"
]
```

## Global configuration
Material controls can be configured globally using `provideNmfMaterialConfig`.

This configuration only affects visual behavior of Material components.

### Available options
  
```typescript
appearance: MatFormFieldAppearance;
floatLabel: FloatLabelType;
detachLabels: boolean;
hideRequiredMarker: boolean;
```

### Example
```typescript
import { ApplicationConfig } from '@angular/core';
import { provideNmfMaterialConfig } from '@ng-modular-forms/material';

export const appConfig: ApplicationConfig = {
  providers: [
    provideNmfMaterialConfig({
      floatLabel: 'always',
      appearance: 'outline',
    }),
  ],
};
```

### Translation

Translation is handled globally by <a href="https://www.npmjs.com/package/@ng-modular-forms/core">@ng-modular-forms/core</a>. This includes validation messages.

Material components automatically use the core configuration.

## Usage Example

```typescript
import { MatInputTextComponent } from "@ng-modular-forms/material";

@Component({
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()">
      <nmf-mat-text formControlName="fieldA" label="Field A" />
      <nmf-mat-text formControlName="fieldB" label="Field B" />

      <button type="submit">Submit</button>
    </form>
  `,
})
export class ExampleComponent {
  form = new FormGroup({
    fieldA: new FormControl(null),
    fieldB: new FormControl(null),
  });
}
```

##  Available Input Components

All components share a consistent API and are interchangeable between Native and Material implementations without changing form logic.

Prefixes / Suffixes are enabled for text and number fields, allowing number to double as a currency field.

| Input Type      | Selector                |
|-----------------|-------------------------|
| Date            | `nmf-mat-datepicker`    |
| File Selector   | `nmf-mat-file-selector` |
| Lookup          | `nmf-mat-lookup`        |
| Number          | `nmf-mat-number`        |
| Range / Slider  | `nmf-mat-range`         |
| Select          | `nmf-mat-select`        |
| Text / Password | `nmf-mat-text`          |
| Textarea        | `nmf-mat-textarea`      |
| Time            | `nmf-mat-timepicker`    |

## Built On

- Angular Reactive Forms
- Angular Material
- ControlValueAccessor (CVA)
- Standalone Components
- RxJS

## Features

- Reusable Angular Material form controls
- Typed reactive forms support
- Built-in ControlValueAccessor integration
- Consistent validation and error handling
- Loading and disabled states
- Standalone component support
- Reduced reactive forms boilerplate
- Enterprise-ready form architecture

### Requires

- @ng-modular-forms/core
- @angular/material
- @angular/cdk

## License

MIT
