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
export class ExampleComponent extends FormOrchestrator {
  sectionAHandler = inject(SectionAHandler);

  constructor(
    override readonly hydrator: FormHydrator,
    override readonly serializer: FormSerializer,
  ) {
    super(hydrator, serializer);
    this.setupForm();
  }

  setupForm() {
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

    this.orchestrate(options);
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
type Controls = {
  'sectionA.fieldA': FormControl<string>;
  'sectionA.fieldB': FormControl<string>;
}

@Injectable()
export class SectionAHandler extends FormHandlerBase<Controls> {
  override getReactiveLogic(form: FormGroup): Subscription {
    this.initializeForm(form);

    return this.valueChangesOf("sectionA.fieldA").subscribe((value) => {
      const fieldBControl = this.getControl("sectionA.fieldB");
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

interface FormMapperOptions {
  extraField1?: string;
  extraField2?: string;
}

export class SectionAMapper extends FormMapperBase<ApiResponseModel, ApiRequestModel, FormModel, FormMapperOptions> {
  buildRequest(form: FormGroup, _options?: FormMapperOptions): ApiRequestModel {
    const fieldAValue = form.value.fieldA ?? options.extraField1 ?? "";
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