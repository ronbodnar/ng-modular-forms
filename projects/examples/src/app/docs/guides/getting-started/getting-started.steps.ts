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

  /** STEP 3 **/
  {
    id: '3',
    title: 'Add an orchestrator',
    description:
      'When forms grow across multiple components, FormOrchestrator keeps them coordinated from a single root.',
    variant: 'orchestrator',
    tabs: [
      {
        id: 'parent',
        label: 'parent.component.ts',
        language: 'typescript',
        code: `@Component({
  imports: [ReactiveFormsModule, SectionAComponent],
  providers: [SectionAHandler],
  template: \`
    <form [formGroup]="form()" (ngSubmit)="submit()">
      <app-section-a [form]="getSubForm('sectionA')" />
      <button type="submit">Submit</button>
    </form>
  \`,
})
export class ParentComponent extends FormOrchestrator {
  readonly sectionAHandler = inject(SectionAHandler);

  constructor(
    override readonly hydrator: FormHydrator,
    override readonly serializer: FormSerializer,
  ) {
    super(hydrator, serializer);

    const form = new FormGroup({
      sectionA: new FormGroup({
        fieldA: new FormControl('', Validators.required),
        fieldB: new FormControl({ value: '', disabled: true }),
      }),
    })

    const mapperRegistry = { sectionA: new SectionAMapper() };

    const handlerRegistry = [this.sectionAHandler];

    // The mapperRegistry and handlerRegistry are optional, for when components grow
    this.orchestrate({ form, mapperRegistry, handlerRegistry });
  }

  submit() {
    const form = this.form();
    if (form.invalid) {
      form.markAllAsTouched();
      return;
    }

    this.setStatus('submitting');

    const requestBody = this.buildRequest(form);

    apiCall(requestBody).subscribe({
      next: () => this.setStatus('success'),
      error: () => {
        form.setErrors({ custom: 'Something went wrong' });
        this.setStatus('error');
      },
    });
  }
}`,
      },
      {
        id: 'section-a',
        label: 'section-a.component.ts',
        language: 'typescript',
        code: `// Subforms are pure presentational components.
// No logic, no subscriptions — just a FormGroup input.
@Component({
  selector: 'app-section-a',
  imports: [ReactiveFormsModule, NmfTextComponent],
  template: \`
    <div [formGroup]="form">
      <nmf-text formControlName="fieldA" label="Field A" />
      <nmf-text formControlName="fieldB" label="Field B" />
    </div>
  \`,
})
export class SectionAComponent {
  @Input({ required: true }) form!: FormGroup;
}`,
      },
    ],
  },

  /** STEP 4 **/
  {
    id: '4',
    title: 'Encapsulate reactive logic in handlers',
    description:
      'Extract cross-field dependencies, conditional enabling, and derived state from components into handlers. One handler per form section, or a single handler for the entire form.',
    variant: 'handler',
    note: 'Handlers are standard Angular services — fully injectable and independently testable.',
    tabs: [
      {
        id: 'section-a-handler',
        label: 'section-a.handler.ts',
        language: 'typescript',
        code: `const CONTROLS = ['sectionA.fieldA', 'sectionA.fieldB'] as const;

type ControlNames = typeof CONTROLS[number];

@Injectable()
export class SectionAHandler extends FormHandlerBase<ControlNames> {

  // The FormOrchestrator handles registering and unregistering subscriptions from handlers.
  // If you don't use the orchestrator, you must manually register and unregister them yourself.
  override getReactiveLogic(form: FormGroup): Subscription {
    this.registerControls(form, [...CONTROLS]);

    const sub = new Subscription();

    sub.add(
      this.valueChangesOf('sectionA.fieldA').subscribe(value => {
        const fieldB = getControl('sectionA.fieldB', form);
        if (!value) {
          fieldB.reset();
          fieldB.disable();
          return;
        }
        fieldB.enable();
      }));

    return sub;
  }
}`,
      },
    ],
  },

  /** STEP 5 **/
  {
    id: '5',
    title: 'Transform data with mappers',
    description:
      'Keep API serialization and hydration logic out of components. One mapper per form section or per form for small forms.',
    variant: 'mapper',
    note: 'The Mapper is not meant to be invoked directly, however it can be. FormSerializer and FormHydrator will call it automatically.',
    tabs: [
      {
        id: 'section-a-mapper',
        label: 'section-a.mapper.ts',
        language: 'typescript',
        code: `export class SectionAMapper extends FormMapperBase<
  ApiResponseModel,
  ApiRequestModel,
  FormModel
> {
  buildRequest(form: FormGroup): ApiRequestModel {
    const fieldA = form.value.fieldA ?? '';
    return {
      fieldA: fieldA.trim().replace(/\\s+/g, '-').toLowerCase(),
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
}`,
      },
    ],
  },
];
