<p align="center">
  <img src="https://raw.githubusercontent.com/ronbodnar/ng-modular-forms/main/projects/examples/public/icons/apple-touch-icon.png" height="120" alt="ng-modular-forms logo" />
</p>

<h1 align="center">@ng-modular-forms/core</h1>

<p align="center">
  <strong>Core primitives, behaviors, and input components for orchestrating complex Angular reactive forms.</strong>
</p>

<p align="center">
  <a href="https://github.com/ronbodnar/ng-modular-forms/actions/workflows/ci-cd.yml"><img src="https://github.com/ronbodnar/ng-modular-forms/actions/workflows/ci-cd.yml/badge.svg" alt="CI/CD" /></a>
  <a href="https://angular.dev"><img src="https://img.shields.io/badge/Angular-19--21-DD0031?logo=angular" alt="Angular Version" /></a>
  <a href="https://www.npmjs.com/package/@ng-modular-forms/core"><img src="https://badge.fury.io/js/%40ng-modular-forms%2Fcore.svg" alt="npm version" /></a>
  <a href="https://github.com/ronbodnar/ng-modular-forms/blob/main/projects/core/LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT" /></a>
</p>

<p align="center">
  <a href="https://ngmf.ronbodnar.com/docs/examples">
    <strong>Live Examples & Interactive Demo</strong>
  </a>
</p>

## Why ng-modular-forms?

Angular Reactive Forms often become difficult to maintain as applications grow:

- Reactive subscriptions spread across components
- Cross-field behavior becomes tightly coupled
- API mapping logic becomes duplicated
- Large forms become difficult to test and reuse

`@ng-modular-forms/core` introduces a modular architecture that separates:

- form orchestration
- reactive behavior
- API mapping
- reusable form controls

Built on top of Angular Reactive Forms — not a replacement.

Compatible with Angular 19–21.

## Installation

```bash
npm install @ng-modular-forms/core

# Optional Material UI bindings:
npm install @ng-modular-forms/material
```

## Core Primitives

### FormOrchestrator

Coordinates form structure and lifecycle.

```ts
import { FormOrchestrator, FormHydrator, FormSerializer } from '@ng-modular-forms/core';

@Component({
  selector: 'app-example',
  imports: [ReactiveFormsModule],
  providers: [SectionAHandler], // Handlers are scoped to the component, not the whole application.
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()">
      <app-section-a [form]="getSubForm('sectionA')" />

      <button type="submit">Submit</button>
    </form>
  `,
})
export class ExampleComponent extends FormOrchestrator {

  constructor(
    override readonly hydrator: FormHydrator,
    override readonly serializer: FormSerializer,
  ) {
    super(hydrator, serializer);

    const form = new FormGroup({
      fieldA: new FormControl<string>(''),
      fieldB: new FormControl<string>('')
    });

    const handlerRegistry = [inject(SectionAHandler)];

    const mapperRegistry = {
      sectionA: new SectionAMapper()
    };

    // The mapperRegistry and handlerRegistry are optional, for when components grow
    this.orchestrate({ form, handlerRegistry, mapperRegistry });

    const model = { fieldA: "aValue", fieldB: "bValue" };
    this.hydrateFromModel(model);
  }

  submit(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const request = this.buildRequest();
  }
}
```

Optional component for Section A to house the form controls.
```ts
import { InputTextComponent } from '@ng-modular-forms/core';

@Component({
  selector: 'app-section-a',
  imports: [ReactiveFormsModule, InputTextComponent],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()">
      <nmf-text formControlName="fieldA" label="Field A" />
      <nmf-text formControlName="fieldB" label="Field B" />
    </form>
  `,
})
export class SectionAComponent {
  @Input({ required: true }) form!: FormGroup;
}
```

### FormHandlerBase

Encapsulates cross-field reactive behavior. Keeps UI logic out of the component.

```ts
import { Subscription } from 'rxjs';
import { FormHandlerBase, getControl } from '@ng-modular-forms/core';

const CONTROL_NAMES = ['fieldA', 'fieldB'] as const;

type ControlNames = typeof CONTROL_NAMES[number];

@Injectable()
export class SectionAHandler extends FormHandlerBase<ControlNames> {
  override getReactiveLogic(form: FormGroup): Subscription {
    this.registerControls(form, CONTROL_NAMES);

    const subscription = new Subscription();

    subscription.add(
      this.valueChangesOf<string>('fieldA').subscribe((val) => {
        const fieldB = getControl<string>('fieldB', form);

        val?.trim()
          ? fieldB.enable()
          : fieldB.disable();
      }),
    );

    subscription.add(
      this.valueChangesOf<string>('fieldB').subscribe((val) => {
        console.log('Field B changed:', val);
      }),
    );

    return subscription;
  }
}
```

### FormMapperBase

Handles transformations between API and form. `FormHydrator` and `FormSerializer` will call these automatically.

```ts
import { FormMapperBase, getControlValue } from '@ng-modular-forms/core';

export class SectionAMapper extends FormMapperBase<ApiModel, RequestModel, FormModel> {
  toRequest(form: FormGroup): RequestModel {
    const fieldAValue = getControlValue<string>('fieldA', form);
    const fieldBValue = getControlValue<string>('fieldB', form);
    return {
      fieldA: fieldAValue?.trim() ?? '',
      fieldB: fieldBValue?.trim() ?? ''
    };
  }

  fromModel(model: ApiModel): FormModel {
    return {
      fieldA: model.fieldA,
      fieldB: model.fieldB
    };
  }
}

// Each model can have its own shape. If all are the same, you only need one and others will inherit from it.
// FormMapperBase<ApiModel> is the same as FormMapperBase<ApiModel, ApiModel, ApiModel>
type ApiModel = {
  fieldA: string;
  fieldB: string;
};

type RequestModel = ApiModel;
type FormModel = ApiModel;

/**
 * These are intentionally separated even if identical.
 * In real applications:
 * - ApiModel represents backend responses
 * - FormModel represents UI state shape
 * - RequestModel represents payload contracts
 *
 * They may diverge as the system evolves.
 */
```

### FormControlBase

Provides ControlValueAccessor boilerplate and common UI inputs (labels, hints, error states) for custom components.

## Hydration & Serialization
`FormHydrator` and `FormSerializer` provide recursive form hydration and request serialization with optional mapper support.

This helps centralize API ↔ form transformations and reduces repetitive patching logic across components and services.

### FormHydrator
Patches form controls from a model.

Standalone usage:
```ts
import { FormHydrator } from '@ng-modular-forms/core';

@Component({...})
export class ExampleComponent {

  form = new FormGroup({
    fieldA: new FormControl<string>('')
  });

  constructor(private hydrator: FormHydrator) {
    const model = { fieldA: "value" };
    this.hydrator.hydrate(this.form, model);
  }
}
```

FormOrchestrator usage:
```ts
import { FormOrchestrator, FormHydrator, FormSerializer } from '@ng-modular-forms/core';

@Component({...})
export class ExampleComponent extends FormOrchestrator {

  constructor(
    override readonly hydrator: FormHydrator,
    override readonly serializer: FormSerializer,
  ) {
    super(hydrator, serializer);

    this.orchestrate({
      form: new FormGroup({
        fieldA: new FormControl<string>('')
      })
    });

    const model = { fieldA: "value" };
    this.hydrateFromModel(model);
  }
}
```

### FormSerializer
Serializes form controls to a model.

Standalone usage:
```ts
import { FormSerializer } from '@ng-modular-forms/core';

@Component({...})
export class ExampleComponent {

  form = new FormGroup({
    fieldA: new FormControl<string>('')
  });

  constructor(private serializer: FormSerializer) {}

  submit() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }
    const request = this.serializer.toRequest(this.form);
  }
}
```

FormOrchestrator usage:
```ts
import { FormOrchestrator, FormHydrator, FormSerializer } from '@ng-modular-forms/core';

@Component({...})
export class ExampleComponent extends FormOrchestrator {

  constructor(
    override readonly hydrator: FormHydrator,
    override readonly serializer: FormSerializer,
  ) {
    super(hydrator, serializer);

    this.orchestrate({
      form: new FormGroup({
        fieldA: new FormControl<string>('')
      })
    });
  }

  submit() {
    const request = this.buildRequest();
    // ...
  }
}
```

##  Input Component Example (No Orchestration)

```ts
import { InputTextComponent, InputCurrencyComponent } from '@ng-modular-forms/core';

@Component({
  template: `
    <form [formGroup]="form">
      <nmf-text formControlName="fieldA" label="Field A" />
      <nmf-currency formControlName="fieldB" label="Field B" />
    </form>
  `,
})
export class ExampleComponent {
  form = new FormGroup({
    fieldA: new FormControl<string>('', Validators.required),
    fieldB: new FormControl<number | null>(null),
  });
}
```

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
