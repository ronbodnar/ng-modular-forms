import type { DocStep } from '../../docs.types';

export const GETTING_STARTED_STEPS: DocStep[] = [
  /** STEP 1 **/
  {
    id: '1',
    title: 'Install the packages',
    description: 'Core is always required. Material bindings are optional.',
    variant: 'install',
    tabs: [
      {
        id: 'core',
        language: 'shell',
        code: `# Core (required)
npm install @ng-modular-forms/core

# Optional: Material UI bindings
npm install @ng-modular-forms/material`,
      },
    ],
  },

  /** STEP 2 **/
  {
    id: '2',
    title: 'Add styles (if using UI control components)',
    description:
      'Add the core input styles to your angular.json file. If using Material, add the Material theme instead of the core theme. If using both, add them both to the stylesheet array.',
    variant: 'styles',
    tabs: [
      {
        id: 'core-styles',
        label: 'angular.json (core)',
        language: 'json',
        code: `"styles": [
  "..."
  "node_modules/@ng-modular-forms/core/styles/form-controls.css"
]`,
      },
      {
        id: 'material-styles',
        label: 'angular.json (material)',
        language: 'json',
        code: `"styles": [
  "..."
  "node_modules/@ng-modular-forms/material/styles/material-theme.css"
]`,
      },
      {
        id: 'both-styles',
        label: 'angular.json (both)',
        language: 'json',
        code: `"styles": [
  "..."
  "node_modules/@ng-modular-forms/core/styles/form-controls.css",
  "node_modules/@ng-modular-forms/material/styles/material-theme.css"
]`,
      },
    ],
  },

  /** STEP 3 **/
  {
    id: '3',
    title: 'Use the UI form field controls',
    description:
      'Drop-in form controls built on ControlValueAccessor that work seamlessly with formControlName and formControl.',
    variant: 'ui',
    note: 'Controls surface validation errors automatically. No extra error template needed.',
    tabs: [
      {
        id: 'html',
        label: 'component.html',
        language: 'html',
        code: `<!-- Replace native inputs with nmf-* controls -->
<form [formGroup]="form" (ngSubmit)="submit()">
  <nmf-text
    type="email"
    label="Email address"
    formControlName="email"
  />
  <nmf-text
    label="Username"
    formControlName="username"
  />

  <!-- Optional: Angular Material input controls -->
  <nmf-mat-text
    type="password"
    label="Password"
    formControlName="password"
  />

  <button type="submit">Submit</button>
</form>`,
      },
      {
        id: 'ts',
        label: 'component.ts',
        language: 'typescript',
        code: `@Component({
  // Optionally: MatInputTextComponent for Material UI
  imports: [ReactiveFormsModule, InputTextComponent],
})
export class SignupComponent {
  form = new FormGroup({
    email: new FormControl('', Validators.required),
    username: new FormControl('', Validators.required),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    // ...
  }
}`,
      },
    ],
  },

  /** STEP 4 **/
  {
    id: '4',
    title: 'Add an orchestrator',
    description:
      'When forms grow across multiple components, FormOrchestrator keeps them coordinated from a single root.',
    variant: 'orchestrator',
    tabs: [
      {
        id: 'orchestrated-form',
        label: 'orchestrated-form.component.ts',
        language: 'typescript',
        code: `@Component({
  imports: [ReactiveFormsModule],
  template: \`
    <form [formGroup]="form()" (ngSubmit)="submit()">
      <nmf-text formControlName="fieldA" label="Field A" />
      <nmf-text formControlName="fieldB" label="Field B" />
      <button type="submit">Submit</button>
    </form>
  \`,
})
export class OrchestratedFormComponent extends FormOrchestrator {
  constructor(
    override readonly hydrator: FormHydrator,
    override readonly serializer: FormSerializer,
  ) {
    super(hydrator, serializer);

    const form = new FormGroup({
      fieldA: new FormControl(false),
      fieldB: new FormControl({ value: '', disabled: true }),
    })

    this.orchestrate({ form });
  }

  submit() {
    const form = this.form();
    if (form.invalid) {
      form.markAllAsTouched();
      return;
    }

    const requestBody = this.buildRequest();

    console.log('Generated request body:', requestBody);
  }
}`,
      },
    ],
  },

  /** STEP 5 **/
  {
    id: '5',
    title: 'Encapsulate reactive logic in handlers',
    description:
      'Extract cross-field dependencies, conditional enabling, and derived state from components into handlers. One handler per form section, or a single handler for the entire form.',
    variant: 'handler',
    note: 'Handlers are standard Angular services — fully injectable and independently testable.',
    tabs: [
      {
        id: 'form-handler',
        label: 'form.handler.ts',
        language: 'typescript',
        code: `type Controls = {
  'fieldA': FormControl<boolean>;
  'fieldB': FormControl<string>;
};

@Injectable()
export class FormHandler extends FormHandlerBase<Controls> {
  override getReactiveLogic(form: FormGroup): Subscription {
    this.initializeForm(form);

    return this.valueChangesOf('fieldA').subscribe(value => {
      const fieldB = this.getControl('fieldB');
      if (!value) {
        fieldB.reset();
        fieldB.disable();
        return;
      }
      fieldB.enable();
    });
  }
}`,
      },
    ],
  },

  /** STEP 6 **/
  {
    id: '6',
    title: 'Transform data with mappers',
    description:
      'Keep API serialization and hydration logic out of components. One mapper per form section or per form for small forms.',
    variant: 'mapper',
    note: 'The Mapper is not meant to be invoked directly, however it can be. FormSerializer and FormHydrator will call it automatically.',
    tabs: [
      {
        id: 'form-mapper',
        label: 'form.mapper.ts',
        language: 'typescript',
        code: `export class FormMapper extends FormMapperBase<
  ApiResponseModel,
  ApiRequestModel,
  FormModel
> {
  toRequest(formValue: FormModel): ApiRequestModel {
    const fieldA = formValue.fieldA ?? '';
    return {
      fieldA: fieldA.trim().replace(/\\s+/g, '-').toLowerCase(),
      fieldB: formValue.fieldB,
      requestedAt: new Date(),
    };
  }

  fromModel(model: ApiResponseModel): FormModel {
    return {
      fieldA: model.fieldA,
      fieldB: model.fieldB,
    };
  }
}`,
      },
    ],
  },
];
