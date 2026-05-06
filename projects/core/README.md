# @ng-modular-forms/core

Core primitives, behaviors, and input components for orchestrating complex Angular reactive forms.

## Installation

```bash
npm install @ng-modular-forms/core
```

There is also an optional package which supports Angular Material UI components:

```bash
npm install @ng-modular-forms/material
```

## Key Concepts

### FormOrchestrator

Coordinates form structure and lifecycle.

```ts
@Component({...})
export class ExampleComponent extends FormOrchestrator {

  constructor(
    override readonly hydrator: FormHydrator,
    override readonly serializer: FormSerializer,
  ) {
    super(hydrator, serializer);

    const sectionAHandler = inject(SectionAHandler);

    form = new FormGroup({});
    handlers = [sectionAHandler]

    this.initialize({ form, handlers });
  }
}
```

### FormHandlerBase

Encapsulates reactive logic.

```ts
const CONTROL_NAMES = ["fieldA", "dependentField"] as const;

type ControlNames = (typeof CONTROL_NAMES)[number];

@Injectable()
export class SectionAHandler extends FormHandlerBase<ControlNames> {
  override getReactiveLogic(form?: FormGroup): Subscription {
    this.registerControls(form, [...CONTROL_NAMES]);

    const sub = new Subscription();

    sub.add(this.reactiveMethod());

    return sub;
  }

  private reactiveMethod() {
    return this.valueChangesOf("fieldA").subscribe((value) => {
      if (value) {
        this.controls.dependentField.enable();
      } else {
        this.controls.dependentField.disable();
      }
    });
  }
}
```

### FormMapperBase

Handles transformations between API and form. Optional: `FormHydrator` and `FormSerializer` will automatically map correlated values.

```ts
export class ExampleMapper extends FormMapperBase<ApiModel, RequestModel, FormModel> {
  toRequest(form: FormGroup): RequestModel {
    const fieldA = form.value.fieldA ?? null;
    return {
      fieldA: fieldA?.replace(/_/g, " "),
      fieldB: form.value.fieldB,
    };
  }

  fromModel(model: ApiModel): FormModel {
    return {
      fieldA: model.fieldA,
      fieldB: model.fieldB,
    };
  }
}
```

### FormControlBase

Provides the ControlValueAccessor implementation as well as common component inputs such as label, placeholder, etc.

```ts
@Component({
  template: `
    <input
      [value]="displayValue()"
      [disabled]="disabled()"
      [required]="isRequired()"
      (blur)="onTouched()"
      (input)="onInput($event)" />
  `,
})
export class CustomInput extends FormControlBase<string | null> {
  displayValue = signal<string | null>(null);

  override writeValue(value: number | null): void {
    super.writeValue(value);
    this.displayValue.set(value != null ? formatNumber(value) : null);
  }

  onInput(event: Event) {
    if (this._disabled()) return;

    const rawValue: string | null = (event.target as HTMLInputElement).value ?? null;
    const value: number = parseNumber(rawValue);

    this.displayValue.set(value != null ? formatNumber(value) : null);

    this.onChange(value);
  }
}
```

### Reusable Input Behaviors

Behaviors are just plain JavaScript objects:

```ts
export class CurrencyBehavior {
  blockNonDigitKey(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    if (event.ctrlKey || event.metaKey) {
      return;
    }

    // Custom logic...

    event.preventDefault();
  }
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

## License

MIT
