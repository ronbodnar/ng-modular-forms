# @ng-modular-forms/behavior

Reusable behaviors for custom Angular form input components.

## What This Provides

- Standardized control behavior

## Installation

```bash
npm install @ng-modular-forms/behavior
```

## Example

```ts
import { FormControlBase } from "@ng-modular-forms/core";
import { CurrencyBehavior } from "@ng-modular-forms/behavior";

@Component({...})
export class CustomCurrencyInput extends FormControlBase<string> {

   behavior = new CurrencyBehavior()

   onInput(value: string) {
      behavior.onInput(this, value);
   }

}
```

Behaviors are just plain JavaScript objects:

```ts
class CurrencyBehavior {
  onInput(ctx: FormControlBase<string>, value: string) {
    const rawValue = value.replace(/[^\d\-,.]/g, "");
    ctx.value = this.formatCurrency(rawValue);
    ctx.onChange(ctx.value);
  }
}
```

---

### When to Use

- Building custom form controls
- Standardizing input behavior
- Creating reusable UI libraries

## License

MIT
