# @ng-modular-forms/core

Core primitives, behaviors, and input components for orchestrating complex Angular reactive forms.

## Installation

```bash
npm install @ng-modular-forms/core
# Optional Material UI bindings:
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
    this.initialize({
      form: new FormGroup({}),
      handlerRegistry: [inject(SectionAHandler)]
    });
  }
}
```

### FormHandlerBase

Encapsulates reactive logic (e.g., if Field A changes, disable Field B). Keeps UI logic out of the component.

```ts
@Injectable()
export class SectionAHandler extends FormHandlerBase<'fieldA' | 'fieldB'> {
  override getReactiveLogic(form?: FormGroup): Subscription {
    this.registerControls(form, ["fieldA", "fieldB"]);

    return this.valueChangesOf("fieldA").subscribe(val => {
      const fieldB = getControl("fieldB", form);
      val ? fieldB.enable() : fieldB.disable();
    });
  }
}
```

### FormMapperBase

Handles transformations between API and form. `FormHydrator` and `FormSerializer` will call these automatically.

```ts
export class ExampleMapper extends FormMapperBase<ApiModel, RequestModel, FormModel> {
  toRequest(form: FormGroup): RequestModel {
    return { fieldA: form.value.fieldA?.trim() };
  }

  fromModel(model: ApiModel): FormModel {
    return { fieldA: model.fieldA };
  }
}
```

### FormControlBase

Provides ControlValueAccessor boilerplate and common UI inputs (labels, hints, error states) for custom components.

##  Available Input Components

All components share a consistent API and are interchangeable between Native and Material implementations without changing form logic.

| Input Type      | Native Selector      | Material Selector     |
|-----------------|----------------------|-----------------------|
| Text / Password | `nmf-text`           | `nmf-mat-text`        |
| Number          | `nmf-number`         | `nmf-mat-number`      |
| Currency        | `nmf-currency`       | `nmf-mat-currency`    |
| Date            | `nmf-datepicker`     | `nmf-mat-datepicker`  |
| Time            | `nmf-timepicker`     | `nmf-mat-timepicker`  |
| Select          | `nmf-select`         | `nmf-mat-select`      |
| Textarea        | `nmf-textarea`       | `nmf-mat-textarea`    |

###  Shared Features

- **CVA Compatible:** Works with formControlName.
- **Behavior-Driven:** Reusable logic for masking, parsing, and restrictions.
- **Validation:** Integrated error messaging and state handling.

## License

MIT
