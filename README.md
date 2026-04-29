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

      <div>
        <label>Field B</label>
        <input formControlName="fieldB" />
      </div>

      ...

      <div *ngIf="form.errors?.custom" class="error">
        {{ form.errors.custom }}
      </div>

      <button type="submit" [disabled]="status() === 'submitting'">Submit</button>
    </form>
  `,
  ...
})
export class ExampleComponent {
  status = signal<'idle' | 'submitting' | 'error' | 'success'>('idle')

  form = new FormGroup({
    fieldA: new FormControl(null, Validators.required),
    fieldB: new FormControl({ value: null, disabled: true }),
  });

  ngOnInit() {
    this.form.get("fieldA")?.valueChanges.subscribe((value) => {
      if (value) {
        this.form.get("fieldB")?.enable();
      } else {
        this.form.get("fieldB")?.reset();
        this.form.get("fieldB")?.disable();
      }
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

    this.status.set('submitting')

    apiCall(payload).subscribe({
      next: () => {
        console.log("Success");
        this.status.set('success');
      },
      error: () => {
        this.form.setErrors({
          custom: "Something went wrong",
        });
        this.status.set('error');
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
  selector: "app-example",
  imports: [ReactiveFormsModule, SectionAComponent],
  providers: [SectionAHandler],
  template: `
    <form [formGroup]="form()" (ngSubmit)="submit()">
      <app-section-a [form]="getSubForm('sectionA')" />

      <button type="submit">Submit</button>
    </form>
  `,
})
export class ExampleComponent extends FormOrchestratorBase {
  sectionAHandler = inject(SectionAHandler);

  ngOnInit() {
    const options = {
      form: new FormGroup({
        sectionA: new FormGroup({
          fieldA: new FormControl("", Validators.required),
          fieldB: new FormControl({ value: "", disabled: true }),
        }),
      }),

      handlers: [this.sectionAHandler],

      mapperRegistry: {
        sectionA: new SectionAMapper(),
      },
    };

    this.initialize(options);
  }

  submit() {
    const form = this.form();
    if (form.invalid) {
      form.markAllAsTouched();
      return;
    }

    this.setStatus("submitting");

    const body = this.buildRequest(this.form());

    apiCall(body).subscribe({
      next: () => {
        console.log("Success");
        this.setStatus("success");
      },
      error: () => {
        this.form().setErrors({
          custom: "Something went wrong",
        });
        this.setStatus("error");
      },
    });
  }
}
```

#### Subform Component

```ts
@Component({
  selector: "app-section-a",
  imports: [ReactiveFormsModule, InputTextComponent],
  template: `
    <div [formGroup]="form">
      <nmf-text formControlName="fieldA" label="Field A" />
      <nmf-text formControlName="fieldB" label="Field B (depends on field A)" />
    </div>
  `,
})
export class SectionAComponent {
  @Input({ required: true }) form!: FormGroup;
}
```

#### Handler (Reactive Logic Layer)

```ts
const CONTROL_NAMES = ["sectionA.fieldA", "sectionA.fieldB"] as const;

type ControlNames = (typeof CONTROL_NAMES)[number];

@Injectable()
export class SectionAHandler extends FormHandlerBase<ControlNames> {
  override getReactiveLogic(form: FormGroup): Subscription {
    this.registerControls(form, [...CONTROL_NAMES]);

    return this.valueChangesOf("sectionA.fieldA").subscribe((value) => {
      const fieldBControl = getControl("sectionA.fieldB", form);
      if (!value) {
        fieldBControl.reset();
        fieldBControl.disable();
        return;
      }
      fieldBControl.enable();
    });
  }
}
```

#### Mapper (Data Transformation Layer)

```ts
interface ApiResponseModel {
  fieldA: unknown;
  fieldB: unknown;
}

interface ApiRequestModel {
  fieldA: unknown;
  fieldB: unknown;
  requestedAt: Date;
}

type FormModel = ApiResponseModel;

export class SectionAMapper extends FormMapperBase<ApiResponseModel, ApiRequestModel, FormModel> {
  buildRequest(form: FormGroup): ApiRequestModel {
    const fieldAValue = form.value.fieldA ?? "";
    return {
      fieldA: fieldAValue.trim().replace(/\s+/g, "-").toLowerCase(),
      fieldB: form.value.fieldB,
      requestedAt: new Date(),
    };
  }

  transformModelToForm(model: ApiResponseModel): FormModel {
    return {
      fieldA: model.fieldA,
      fieldB: model.fieldB,
    };
  }
}
```

### Result

- Subforms are fully isolated and reusable
- Logic is centralized and testable
- Complex dependencies are predictable and maintainable
- Easily scales to large, multi-section or multi-step forms

## Available Components

### Input Components

| Component  | Basic Selector   | Material Selector    | Description                     |
| :--------- | :--------------- | :------------------- | :------------------------------ |
| Currency   | `nmf-currency`   | `nmf-mat-currency`   | Currency input with formatting  |
| Datepicker | `nmf-datepicker` | `nmf-mat-datepicker` | Date selection input            |
| Select     | `nmf-select`     | `nmf-mat-select`     | Dropdown selection from options |
| Text       | `nmf-text`       | `nmf-mat-text`       | Single-line text input          |
| Textarea   | `nmf-textarea`   | `nmf-mat-textarea`   | Multi-line text input           |
| Timepicker | `nmf-timepicker` | `nmf-mat-timepicker` | Time selection input            |

## When to Use

Use this library when your application has:

- complex or multi-step forms
- shared form logic across features
- API-driven form transformations
- nested or dynamically composed forms
- or you just want simple declarative form structures without the boilerplate

## License

MIT
