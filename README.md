<p align="center">
  <img src="https://raw.githubusercontent.com/ronbodnar/ng-modular-forms/main/projects/examples/public/icons/apple-touch-icon.png" height="120" alt="ng-modular-forms logo" />
</p>

<h1 align="center">ng-modular-forms</h1>

<p align="center">
  <strong>A structured Angular forms architecture built for complex, scalable applications.</strong>
</p>

<p align="center">
  <a href="https://github.com/ronbodnar/ng-modular-forms/actions/workflows/ci-cd.yml"><img src="https://github.com/ronbodnar/ng-modular-forms/actions/workflows/ci-cd.yml/badge.svg" alt="CI/CD" /></a>
  <a href="https://angular.dev"><img src="https://img.shields.io/badge/Angular-19--21-DD0031?logo=angular" alt="Angular Version" /></a>
  <a href="https://www.npmjs.com/package/@ng-modular-forms/core"><img src="https://badge.fury.io/js/%40ng-modular-forms%2Fcore.svg" alt="npm version" /></a>
  <a href="/LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT" /></a>
</p>

<p align="center">
  <a href="https://ngmf.ronbodnar.com/docs/examples">
    <strong>Live Examples & Interactive Demo →</strong>
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
  
  // Required ONLY if utilizing @ng-modular-forms/core native UI elements
  "node_modules/@ng-modular-forms/core/styles/form-controls.css",
  
  // Required ONLY if utilizing @ng-modular-forms/material UI components
  "node_modules/@ng-modular-forms/material/styles/form-controls.css"
]
```

###  3. Configure Global Configuration
`@ng-modular-forms/core` provides a single global configuration system via `provideNmfConfig`.

This configuration is shared across all packages (core + material) **and is optional**.

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
        validationMessages: {},
      };
    });
  ],
};
```

## Code Examples

### Start Simple

```typescript
@Component({
  template: `
    <form [formGroup]="form">
      <nmf-text
        label="First Name"
        formControlName="firstName"
      />

      <nmf-number
        label="Salary"
        formControlName="salary"
        [formatValue]="true"
        prefix="$"
        suffix="USD"
      />
    </form>
  `,
})
export class EmployeeComponent {
  form = new FormGroup({
    firstName: new FormControl('', Validators.required),
    salary: new FormControl<number | null>(null),
  });
}
```

Start with standard Angular Reactive Forms and adopt orchestration features only when your application needs them.

### Add Reactive Logic

As forms grow, reactive business rules often end up scattered throughout Angular components.

`ng-modular-forms` allows reactive behavior to be moved into dedicated handlers.

```typescript
@Injectable()
export class RegistrationFormHandler extends FormHandlerBase<Controls> {

  override getReactiveLogic(form?: FormGroup) {
    if (!form) {
      throw new Error(
        'RegistrationFormHandler requires a form instance'
      );
    }

    this.initializeForm(form);

    const emailControl =
      this.getControl('personalInfo.email');

    return this.valueChangesOf(
      'preferences.agreeToTerms'
    ).subscribe((acceptedTerms) => {

      const validators = acceptedTerms
        ? [Validators.required, Validators.email]
        : [Validators.email];

      emailControl.setValidators(validators);
      emailControl.updateValueAndValidity({
        emitEvent: false,
      });
    });
  }
}
```

Instead of managing subscriptions inside components, business rules are isolated into reusable handlers that can be tested independently.

### DTO ↔ Form Mapping

API contracts and form models often evolve independently.

`ng-modular-forms` provides dedicated mappers for translating between them.

```typescript
export class PreferencesMapper extends FormMapperBase<
  PreferencesDto,
  PreferencesForm,
  PreferencesForm,
  PreferencesOptions
> {

  override fromModel(dto: PreferencesDto) {
    return {
      receiveEmails: dto.receive_emails,
      theme: dto.theme_name,
    };
  }

  override toRequest(formValue: PreferencesForm, options?: PreferencesOptions) {
    return {
      receive_emails: formValue.receiveEmails,
      theme: formValue.theme,
    };
  }
}
```

Mapping logic remains centralized and reusable instead of being duplicated throughout components and services.

### Large Forms and Multi-Step Workflows

As complexity grows, handlers, mappers, hydration, and serialization can be orchestrated through a single coordinator.

```typescript
@Component({
  providers: [
    MultiStepFormHandler,
    PersonalInfoFormHandler,
    AccountDetailsFormHandler,
    PreferencesFormHandler,
  ],
})
export class MultiStepFormComponent
  extends FormOrchestrator {

  initialize() {
    this.orchestrate({
      form: registrationForm,

      handlerRegistry: [
        inject(MultiStepFormHandler),
        inject(PersonalInfoFormHandler),
        inject(AccountDetailsFormHandler),
        inject(PreferencesFormHandler),
      ],

      mapperRegistry: {
        preferences: new PreferencesMapper(),
      },
    });

    this.hydrateFromModel(existingUser);
  }
}
```

The same architecture scales from simple forms to enterprise workflows without moving business logic into Angular components.

## Developer Quick Start

Clone and run the examples app:

```bash
git clone https://github.com/ronbodnar/ng-modular-forms.git
cd ng-modular-forms
npm install
npm start
```

Open your browser to `http://localhost:4200/docs/examples` to see the live interactive examples.

## Ecosystem Packages
<table>
  <tr>
    <th style="white-space: nowrap;">Package</th>
    <th>Description</th>
    <th style="white-space: nowrap;">Links</th>
  </tr>

  <tr>
    <td style="white-space: nowrap;"><b>@ng-modular-forms/core</b></td>
    <td>
      Form orchestration, reactive behavior handling, API mapping, and state hydration
    </td>
    <td style="white-space: nowrap;">
      <a href="https://www.npmjs.com/package/@ng-modular-forms/core">npm</a>,
      <a href="https://github.com/ronbodnar/ng-modular-forms/tree/main/projects/core#readme">docs</a>
    </td>
  </tr>

  <tr>
    <td style="white-space: nowrap;"><b>@ng-modular-forms/material</b></td>
    <td>
      Angular Material-based input components
    </td>
    <td style="white-space: nowrap;">
      <a href="https://www.npmjs.com/package/@ng-modular-forms/material">npm</a>,
      <a href="https://github.com/ronbodnar/ng-modular-forms/tree/main/projects/material#readme">docs</a>
    </td>
  </tr>
</table>

## Unified Input Control API

All integrated control primitives are built on ControlValueAccessor. This allows you to interchange Native selectors for Material selectors instantly without altering a single line of orchestration logic.

| Input Type        | Native Selector                | Material Selector                  | Description                                              |
|-------------------|--------------------------------|------------------------------------|----------------------------------------------------------|
| Text / Password   | `nmf-text`                     | `nmf-mat-text`                     | Masking, text parsing, and standard string inputs.       |
| Lookup            | `nmf-lookup`                   | `nmf-mat-lookup`                   | Automated synchronous/asynchronous auto-complete engine. |
| Number / Currency | `nmf-number`                   | `nmf-mat-number`                   | Strictly typed runtime numeric normalization.            |
| Date              | `nmf-datepicker`               | `nmf-mat-datepicker`               | Calendar utility wrappers.                               |
| Time              | `nmf-timepicker`               | `nmf-mat-timepicker`               | Standard temporal data picking inputs.                   |
| Select            | `nmf-select`                   | `nmf-mat-select`                   | Option-driven stream selectors.                          |
| Textarea          | `nmf-textarea`                 | `nmf-mat-textarea`                 | Multi-line textual controls.                             |

### Features

- `ControlValueAccessor` compatible
- Fully compatible with Angular Reactive Forms
- Consistent API across all inputs
- Built-in validation state + error messaging
- Label, required indicator, and loading state support
- Behavior-driven input handling (formatting, parsing, restrictions)

## License

MIT
