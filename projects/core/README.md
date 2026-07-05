<p align="center">
  <img src="https://raw.githubusercontent.com/ronbodnar/ng-modular-forms/main/projects/examples/public/icons/apple-touch-icon.png" height="120" alt="ng-modular-forms logo" />
</p>

<h1 align="center">@ng-modular-forms/core</h1>

<p align="center">
  <strong>Composable primitives for building scalable Angular reactive form architectures.</strong>
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

## The Problem

As enterprise Angular applications grow, form logic quickly becomes a maintenance bottleneck. Side-effect subscriptions spread across components, API data mapping logic gets duplicated, and components bloat with validation mechanics. 

## The Solution

`ng-modular-forms` introduces a strict **separation of concerns** layer built right on top of Angular Reactive Forms. It isn't a replacement for standard reactive APIs — it's an architectural framework designed to decouple:

* **Form Orchestration:** Isolate conditional validation and multi-step workflow logic.
* **Reactive Behaviors:** Pull complex cross-field dependencies out of presentation components.
* **Data Mapping:** Translate backend DTOs to form states declaratively.
* **UI Shells:** Interchange native elements and Angular Material layers instantly.

## Key Features
- Typed Reactive Forms support
- Form orchestration layer
- DTO ↔ Form mapping
- State hydration and serialization
- Cross-field behavior management
- Dynamic enable/disable workflows
- Native and Angular Material UI packages
- Consistent component APIs
- Enterprise-scale architecture patterns
- Angular 19–21 support

## Installation & Setup

### 1. Install Packages
Start with core:

```bash
npm install @ng-modular-forms/core
```

If you are using Angular Material components, install the UI adapter and its peer dependencies:

```bash
npm install @ng-modular-forms/material @angular/material @angular/cdk
```

### 2. Configure Global Styles
Add the required control structural themes to your angular.json styles pipeline depending on your configuration:

```json
"styles": [
  "src/styles.css",
  
  // Required ONLY if utilizing @ng-modular-forms/core native UI components
  "node_modules/@ng-modular-forms/core/styles/form-controls.css",
  
  // Required ONLY if utilizing @ng-modular-forms/material UI components
  "node_modules/@ng-modular-forms/material/styles/form-controls.css"
]
```

### 3. Global Configuration
`@ng-modular-forms/core` provides a single global configuration system via `provideNmfConfig` or `provideNmfConfigFactory`.

This **optional** configuration is shared across all packages (core + material).

If not provided, sensible defaults are used.

#### Available options
  
```typescript
translate?: (
  key: string,
  params?: Record<string, unknown>
) => string;

validationMessages?: ValidationMessages;
```

#### Code Example
```typescript
import { ApplicationConfig, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { provideNmfConfig } from '@ng-modular-forms/core';

export const appConfig: ApplicationConfig = {
  providers: [
    // Simple config
    provideNmfConfig({
      validationMessages: {
        email: 'Invalid email',
      },
    })

    //DI-based config
    provideNmfConfigFactory(() => {
      const translate = inject(TranslateService);

      return {
        translate: (k, p) => translate.instant(k, p),
        validationMessages: {
          email: 'Invalid email'
        },
      };
    });
  ],
};
```

## Without ng-modular-forms
```typescript
@Component({
  selector: 'app-legacy-form',
  imports: [ReactiveFormsModule, CommonModule],
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

      @if (form.errors?.custom) {
        <div class="error">{{ form.errors.custom }}</div>
      }

      <button type="submit" [disabled]="status() === 'submitting'">Submit</button>
    </form>
  `
})
export class LegacyFormComponent implements OnInit {
  status = signal<'idle' | 'submitting' | 'error' | 'success'>('idle');

  form = new FormGroup({
    fieldA: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    fieldB: new FormControl({ value: '', disabled: true })
  });

  ngOnInit() {
    // Reactive business rules quickly pollute the lifecycle hooks
    this.form.get('fieldA')?.valueChanges.subscribe((value) => {
      const fieldB = this.form.get('fieldB');
      if (value) {
        fieldB?.enable();
      } else {
        fieldB?.reset();
        fieldB?.disable();
      }
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // Direct mapping leak: Transforming UI state directly inside presentation
    const rawA = this.form.value.fieldA ?? '';
    const payload = {
      fieldA: rawA.trim().replace(/\s+/g, '-').toLowerCase(),
      fieldB: this.form.value.fieldB,
      submittedAt: new Date()
    };

    this.status.set('submitting');
    apiCall(payload).subscribe({
      next: () => this.status.set('success'),
      error: () => {
        this.form.setErrors({ custom: 'Something went wrong' });
        this.status.set('error');
      }
    });
  }
}
```

## Core Primitives

### FormOrchestrator

Coordinates form structure and lifecycle.

#### Basic usage

```typescript
import {
  FormOrchestrator, FormHydrator, FormSerializer
} from '@ng-modular-forms/core';

@Component({
  // ...
  template: `
    <form [formGroup]="form">
      <nmf-text formControlName="fieldA" label="Field A" />
      <nmf-text formControlName="fieldB" label="Field B" />
    </form>
  `,
})
export class ExampleComponent extends FormOrchestrator {

  constructor(
    override readonly hydrator: FormHydrator,
    override readonly serializer: FormSerializer,
  ) {
    super(hydrator, serializer);

    this.orchestrate({
      form: new FormGroup({
        fieldA: new FormControl(''),
        fieldB: new FormControl('')
      })
    });
  }

}
```

#### Advanced usage
```typescript
import {
  FormOrchestrator, FormHydrator, FormSerializer
} from '@ng-modular-forms/core';

@Component({
  selector: 'app-example',
  imports: [ReactiveFormsModule],
  // Handlers are scoped to the component, not the whole application.
  providers: [SectionAHandler],
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

    // The mapperRegistry and handlerRegistry are optional
    this.orchestrate({ form, handlerRegistry, mapperRegistry });

    this.hydrateFromModel({
      fieldA: "aValue",
      fieldB: "bValue"
    });
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
```typescript
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

```typescript
import { Subscription } from 'rxjs';
import { FormHandlerBase } from '@ng-modular-forms/core';

type Controls = {
  'fieldA': FormControl<string>;
  'fieldB': FormControl<string>;
}

@Injectable()
export class SectionAHandler extends FormHandlerBase<Controls> {
  override getReactiveLogic(form: FormGroup): Subscription {
    this.initializeForm(form);

    return this.valueChangesOf('fieldA').subscribe((value) => {
      const fieldB = this.getControl('fieldB', form);

      value ? fieldB.enable() : fieldB.disable();
    });
  }
}
```

### FormMapperBase

Handles transformations between API and form. `FormHydrator` and `FormSerializer` will call these automatically.

```typescript
import { FormMapperBase, getControlValue } from '@ng-modular-forms/core';

export class SectionAMapper extends FormMapperBase<
  ApiModel, RequestModel, FormModel, FormMapperOptions
> {
  toRequest(formValue: FormModel, _options?: FormMapperOptions): RequestModel {
    const fieldAValue = getControlValue<string>('fieldA', form);
    const fieldBValue = getControlValue<string>('fieldB', form);
    return {
      fieldA: formValue.fieldA?.trim() ?? '',
      fieldB: formValue.fieldB?.trim() ?? ''
    };
  }

  fromModel(model: ApiModel): FormModel {
    return {
      fieldA: model.fieldA,
      fieldB: model.fieldB
    };
  }
}

// Each model can have its own shape.
// If all are the same, you only need one and others will inherit from it.
// FormMapperBase<T> is the same as FormMapperBase<T, T, T, object>
type ApiModel = {
  fieldA: string;
  fieldB: string;
};
type RequestModel = ApiModel;
type FormModel = ApiModel;

interface FormMapperOptions {
  extraField1?: string;
  extraField2?: string;
}
```

### FormControlBase

Provides ControlValueAccessor boilerplate and common UI inputs (labels, hints, error states) for custom components.

## Hydration & Serialization
`FormHydrator` and `FormSerializer` provide recursive form hydration and request serialization with optional mapper support.

This helps centralize API ↔ form transformations and reduces repetitive patching logic across components and services.

### FormHydrator
Patches form controls from a model.

Standalone usage:
```typescript
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
```typescript
import {
  FormOrchestrator, FormHydrator, FormSerializer
} from '@ng-modular-forms/core';

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
```typescript
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
```typescript
import {
  FormOrchestrator, FormHydrator, FormSerializer
} from '@ng-modular-forms/core';

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

```typescript
import {
  InputTextComponent, InputCurrencyComponent
} from '@ng-modular-forms/core';

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

Prefixes / Suffixes are enabled for text and number fields, allowing number to double as a currency field.

| Input Type      | Native Selector      | Material Selector     |
|-----------------|----------------------|-----------------------|
| Text / Password | `nmf-text`           | `nmf-mat-text`        |
| Lookup          | `nmf-lookup`         | `nmf-mat-lookup`      |
| Number          | `nmf-number`         | `nmf-mat-number`      |
| Date            | `nmf-datepicker`     | `nmf-mat-datepicker`  |
| Range Slider    | `nmf-range`          | Not available         |
| Select          | `nmf-select`         | `nmf-mat-select`      |
| Textarea        | `nmf-textarea`       | `nmf-mat-textarea`    |
| Time            | `nmf-timepicker`     | `nmf-mat-timepicker`  |

###  Shared Features

- **CVA Compatible:** Works with formControlName.
- **Behavior-Driven:** Reusable logic for masking, parsing, and restrictions.
- **Validation:** Integrated error messaging and state handling.

## License

MIT
