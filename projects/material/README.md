# @ng-modular-forms/material

Angular Material implementation of ng-modular-forms inputs.

## Installation

```bash
npm install @ng-modular-forms/material
```

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
- @ng-modular-forms/behavior
- @angular/material
- @angular/cdk

## License

MIT
