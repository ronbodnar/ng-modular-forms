<p align="center">
  <img src="https://raw.githubusercontent.com/ronbodnar/ng-modular-forms/main/projects/examples/public/icons/apple-touch-icon.png" height="120" alt="ng-modular-forms logo" />
</p>

<h1 align="center">@ng-modular-forms/material</h1>

<p align="center">
  <strong>Angular Material implementation of ng-modular-forms inputs.</strong>
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

## Example

```ts
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

## Built On

- Angular Material
- ControlValueAccessor

## Features

- Material styling
- Floating labels
- Validation UI
- Loading states

### Requires

- @ng-modular-forms/core
- @angular/material
- @angular/cdk

## License

MIT
