# @ng-modular-forms/core

Core primitives for orchestrating complex Angular reactive forms.

## What This Provides

- Form orchestration
- Reactive logic isolation
- Data mapping layer

## Installation

```bash
npm install @ng-modular-forms/core
```

## Key Concepts

### FormOrchestratorBase

Coordinates form structure and lifecycle.

```ts
@Component({...})
export class ExampleComponent extends FormOrchestratorBase {
  form = new FormGroup({});

  ngOnInit() {
   // Handlers are not required if there is no reactive logic or value change subscriptions.
   const mainHandler = inject(ExampleFormHandler);
   const sectionAHandler = inject(SectionAHandler);

   const formOptions = {
      mainHandler: mainHandler,
      subHandlers: {
         sectionA: sectionAHandler
      }
    };

   this.initialize(this.form, formOptions);
  }

  // Only required if forms are split across multiple components
  onSubformReady(form: FormGroup, key: string) {
    super.onSubformReady(form, key);
  }
}
```

---

### FormHandlerBase

Encapsulates reactive logic.

```ts
const CONTROL_NAMES = ["fieldA", "dependentField"] as const;

type ControlNames = (typeof CONTROL_NAMES)[number];

@Injectable()
export class SectionAHandler extends FormHandlerBase<ControlNames> {
  override getReactiveLogic(): Subscription {
    this.registerControls(this.form, [...CONTROL_NAMES]);

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

---

### FormMapperBase

Handles transformations between API and form.

```ts
export class ExampleMapper extends FormMapperBase<ApiModel, RequestModel> {
  buildRequest(form: FormGroup) {
    return {
      fieldA: form.value.fieldA,
      fieldB: form.value.fieldB,
    };
  }

  transformFromModel(model: ApiModel) {
    return {
      fieldA: model.fieldA,
      fieldB: model.fieldB,
    };
  }
}
```

---

### Responsibility Boundaries

| Layer            | Responsibility                                           |
| :--------------- | :------------------------------------------------------- |
| **Orchestrator** | Manages form composition and lifecycle coordination.     |
| **Handler**      | Encapsulates all reactive logic and stream management.   |
| **Mapper**       | Handles data transformation between API and Form states. |

---

### No UI Included

This package does **not** provide UI components.

Use:

- @ng-modular-forms/behavior
- @ng-modular-forms/input
- @ng-modular-forms/material

## License

MIT
