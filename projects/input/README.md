# @ng-modular-forms/input

Prebuilt, framework-agnostic form inputs built on top of control primitives.

## Installation

```bash
npm install @ng-modular-forms/input
```

## Example

```ts
import { InputComponent } from "@ng-modular-forms/input";

@Component({
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()">
      <nmf-input formControlName="fieldA" label="Field A" />
      <nmf-input formControlName="fieldB" label="Field B" />

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

---

### Use Case

- Teams not using Angular Material or other UI frameworks
- Custom design systems

## License

MIT
