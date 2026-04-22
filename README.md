# ng-modular-forms

**A structured Angular forms architecture for complex, scalable applications.**

`ng-modular-forms` provides separation of UI, orchestration, reactive logic, and data mapping into clearly
defined, reusable primitives.

[![npm version](https://badge.fury.io/js/%40ng-modular-forms%2Fcore.svg)](https://badge.fury.io/js/%40ng-modular-forms%2Fcore)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Packages

| Package                        | Description                         |
| :----------------------------- | :---------------------------------- |
| **@ng-modular-forms/core**     | Orchestration, handlers, mapping    |
| **@ng-modular-forms/behavior** | Base input behaviors                |
| **@ng-modular-forms/input**    | Framework-agnostic input components |
| **@ng-modular-forms/material** | Angular Material-based inputs       |

## Installation

Start with core:

```bash
npm install @ng-modular-forms/core
```

Add UI layers as needed:

```bash
npm install @ng-modular-forms/behavior
npm install @ng-modular-forms/input
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
git clone https://github.com/your-repo/ng-modular-forms.git
cd ng-modular-forms
npm install
npm run start:examples
```

Navigate to `http://localhost:4200` to see the interactive examples.

## Examples

The library includes several example forms demonstrating different use cases:

- **Basic Input Components** - Framework-agnostic input components without Material Design
- **Material Input Components** - Material-based form fields using Angular Material components
- **Registration Form** - Comprehensive form with validation and multiple input types

Each example includes:

- Complete component implementation
- Template with form structure
- Styling examples
- Unit tests

## The Problem

Angular reactive forms often become:

- tightly coupled to components
- overloaded with subscriptions
- difficult to scale across features
- inconsistent in transformation logic

## The Solution

Separate responsibilities:

- Orchestration → form lifecycle + composition
- Handlers → reactive logic
- Mappers → API transformations
- UI → isolated, reusable controls

## Example: Orchestrated Form

### Without ng-modular-forms

```ts
@Component({
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()">
      <div>
        <label>Field A</label>
        <input formControlName="fieldA" />
      </div>

      ...

      <div *ngIf="form.errors?.server" class="error">
        {{ form.errors.server }}
      </div>

      <button type="submit">Submit</button>
    </form>
  `,
  ...
})
export class ExampleComponent {
  form = new FormGroup({
    fieldA: new FormControl(null),
    fieldB: new FormControl({ value: null, disabled: true }),
  });

  ngOnInit() {
    this.form.get("fieldA")?.valueChanges.subscribe((value) => {
      if (value) {
        this.form.get("fieldB")?.enable();
      } else {
        this.form.get("fieldB")?.disable();
      }
    });

    this.form.valueChanges.subscribe((value) => {
      console.log("Form changed:", value);
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const fieldAValue = this.form.value.fieldA ?? "";

    const payload = {
      fieldA: fieldAValue.trim().replace(/\s+/g, "-").toLowerCase(),
      fieldB: this.form.value.fieldB,
      submittedAt: new Date(),
    };

    apiCall(payload).subscribe({
      next: () => console.log("Success"),
      error: () => {
        this.form.setErrors({
          server: "Something went wrong",
        });
      },
    });
  }
}
```

Issues:

- logic spread across component
- hard to scale with bigger or more complex forms
- difficult to test and reuse

### With ng-modular-forms

#### Parent Form (Orchestrator)

```ts
@Component({
   providers: [ExampleFormHandler, ExampleFormMapper, SectionAHandler, SectionBHandler],
   template: `
      <form [formGroup]="form" (ngSubmit)="submit()">
         <app-section-a (formReady)="onSubformReady($event, 'sectionA')" />
         <app-section-b (formReady)="onSubformReady($event, 'sectionB')" />

         <button type="submit">Submit</button>
      </form>
   `,
   ...
})
export class ExampleComponent extends FormOrchestratorBase {

  mapper = inject(ExampleFormMapper);

  ngOnInit() {
    // Handlers are not required if there is no reactive logic or value change subscriptions.
    const mainHandler = inject(ExampleFormHandler);
    const sectionAHandler = inject(SectionAHandler);
    const sectionBHandler = inject(SectionBHandler);

    const form = new FormGroup({});

    const formOptions = {
      mainHandler: mainHandler,
      subHandlers: {
         sectionA: sectionAHandler,
         sectionB: sectionBHandler
      }
    };

    this.initialize(form, formOptions);
  }

  submit() {
    // Delegate to a service or handle here, depending on your use case
    const form = this.form();
    if (form.invalid) {
      form.markAllAsTouched();
      return;
    }

    const body = this.mapper.buildRequest(form, this.store);

    apiCall(body).subscribe({
      next: () => console.log("Success"),
      error: () => {
        this.form.setErrors({
          server: "Something went wrong",
        });
      },
    });
  }
}
```

#### Subform Component

```ts
@Component({
    selector: 'app-section-a',
    providers: [SectionAMapper], // Handler is already provided from the orchestrator component
    template: `
      <div [formGroup]="form">
        <nmf-input formControlName="fieldA" label="Field A" />
        <nmf-input formControlName="fieldB" label="Field B (depends on field A)" />
      </div>
    `,
    ...
})
export class SectionAComponent {
    @Output() formReady = new EventEmitter<FormGroup>();

    form = new FormGroup({
      fieldA: new FormControl(null),
      fieldB: new FormControl({ value: null, disabled: true }),
    });

    ngOnInit() {
      this.formReady.emit(this.form);
    }
}
```

#### Handler (Reactive Logic Layer)

```ts
const CONTROL_NAMES = ["fieldA", "fieldB"] as const;

type ControlNames = (typeof CONTROL_NAMES)[number];

@Injectable()
export class SectionAHandler extends FormHandlerBase<ControlNames> {
  override getReactiveLogic(): Subscription {
    this.registerControls(this.form, [...CONTROL_NAMES]);

    return this.valueChangesOf("fieldA").subscribe((value) => {
      if (!value) {
        this.controls.fieldB.reset();
        this.controls.fieldB.disable();
        return;
      }

      this.controls.fieldB.enable();
    });
  }
}
```

#### Mapper (Data Transformation Layer)

```ts
interface ApiModel {
  fieldA: unknown;
  fieldB: unknown;
}

interface RequestModel {
  fieldA: unknown;
  fieldB: unknown;
  requestedAt: Date;
}

export class ExampleMapper extends FormMapperBase<ApiModel, RequestModel> {
  buildRequest(form: FormGroup) {
    const fieldAValue = form.value.fieldA ?? "";
    return {
      fieldA: fieldAValue.trim().replace(/\s+/g, "-").toLowerCase(),
      fieldB: form.value.fieldB,
    };
  }

  transformFromModel(model: ApiModel) {
    return {
      fieldA: model.fieldA,
      fieldB: model.fieldB,
      requestedAt: new Date(),
    };
  }
}
```

### Result

- Subforms are fully isolated and reusable
- Logic is centralized and testable
- Complex dependencies are predictable and maintainable
- Easily scales to large, multi-section forms

## Available Components

### Input Components

| Component   | Basic Selector   | Material Selector    | Description                            |
| :---------- | :--------------- | :------------------- | :------------------------------------- |
| Text Input  | `nmf-text`       | `nmf-mat-text`       | Single-line text input with validation |
| Textarea    | `nmf-textarea`   | `nmf-mat-textarea`   | Multi-line text input                  |
| Select      | `nmf-select`     | `nmf-mat-select`     | Dropdown selection from options        |
| Currency    | `nmf-currency`   | `nmf-mat-currency`   | Currency input with formatting         |
| Date Picker | `nmf-datepicker` | `nmf-mat-datepicker` | Date selection input                   |

### Core Classes

- **FormOrchestratorBase** - Base class for form orchestration
- **FormHandlerBase** - Base class for reactive form logic
- **FormMapperBase** - Base class for data transformation
- **FormControlBase** - Base class for custom form controls

## API Documentation

### FormOrchestratorBase

```typescript
class FormOrchestratorBase {
  // Properties
  readonly form: Signal<FormGroup>;
  readonly mainHandler: Signal<FormHandlerBase | null>;
  readonly status: Signal<FormStatus>;
  readonly errorMessage: Signal<string | null>;

  // Methods
  initialize(form: FormGroup, options?: FormOrchestratorOptions): void;
  onSubformReady(subform: FormGroup, groupName: string, nestGroups?: boolean): void;
  setStatus(status: FormStatus): void;
  setErrorMessage(message: string | null): void;
}
```

### FormHandlerBase

```typescript
abstract class FormHandlerBase<ControlNames extends string = string> {
  abstract getReactiveLogic(form?: FormGroup): Subscription;

  registerControls(form: FormGroup, controlNames: ControlNames[]): void;
  valueChangesOf<T>(key: ControlNames): Observable<T>;
}
```

## When to Use

Use this library when your application has:

- complex or multi-step forms
- shared form logic across features
- API-driven form transformations
- nested or dynamically composed forms
- or you just want simple declarative form structures without the boilerplate

## License

MIT
