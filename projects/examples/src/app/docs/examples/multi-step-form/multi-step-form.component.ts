import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  FormHydrator,
  FormOrchestrator,
  FormOrchestratorOptions,
  FormSerializer,
} from '@ng-modular-forms/core';
import { RegistrationPersonalInfoComponent } from './subforms/personal-info/personal-info.component';
import { RegistrationAccountDetailsComponent } from './subforms/account-details/account-details.component';
import { MultiStepFormHandler } from './multi-step-form.handler';
import { AccountDetailsFormHandler } from './subforms/account-details/account-details.handler';
import { MatButtonModule } from '@angular/material/button';
import { PersonalInfoFormHandler } from './subforms/personal-info/personal-info.handler';
import { RegistrationPreferencesComponent } from './subforms/preferences/preferences.component';
import { PreferencesFormHandler } from './subforms/preferences/preferences.handler';
import { PreferencesMapper } from './subforms/preferences/preferences.mapper';
import { DocsPageComponent } from '../../ui/docs-page/docs-page.component';
import { FormStatusOutputComponent } from '../../ui/form-status-output/form-status-output.component';
import { FormStepWrapperComponent } from '../../ui/form-step-wrapper/form-step-wrapper.component';

@Component({
  selector: 'app-registration-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    FormStepWrapperComponent,
    DocsPageComponent,
    FormStatusOutputComponent,
    RegistrationPersonalInfoComponent,
    RegistrationAccountDetailsComponent,
    RegistrationPreferencesComponent,
  ],
  providers: [
    MultiStepFormHandler,
    PersonalInfoFormHandler,
    AccountDetailsFormHandler,
    PreferencesFormHandler,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './multi-step-form.component.html',
})
export class MultiStepFormComponent extends FormOrchestrator {
  private readonly mainHandler = inject(MultiStepFormHandler);
  private readonly personalInfoHandler = inject(PersonalInfoFormHandler);
  private readonly accountHandler = inject(AccountDetailsFormHandler);
  private readonly preferencesHandler = inject(PreferencesFormHandler);

  constructor(
    override readonly hydrator: FormHydrator,
    override readonly serializer: FormSerializer,
  ) {
    super(hydrator, serializer);
    this.initialize();
  }

  initialize() {
    const options: FormOrchestratorOptions = {
      form: new FormGroup({
        personalInfo: new FormGroup({
          firstName: new FormControl(null, [
            Validators.required,
            Validators.minLength(2),
          ]),
          lastName: new FormControl(null, [Validators.minLength(2)]),
          email: new FormControl(null, Validators.email),
          phone: new FormControl(null, [
            Validators.pattern(
              /^(\+1\s?)?(\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}$/,
            ),
          ]),
          country: new FormControl(null),
          dateOfBirth: new FormControl(null),
          newsletter: new FormControl(false),
        }),

        accountDetails: new FormGroup({
          username: new FormControl({ value: null, disabled: true }, [
            Validators.minLength(4),
          ]),
          password: new FormControl(null, [Validators.minLength(8)]),
          confirmPassword: new FormControl(null, []),
          phone: new FormControl(null, [
            Validators.pattern(
              /^(\+1\s?)?(\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}$/,
            ),
          ]),
        }),

        preferences: new FormGroup({
          monthlyBudget: new FormControl<number | null>(null, [
            Validators.min(0),
            Validators.max(10000),
          ]),
          referralSource: new FormControl(null),
          comments: new FormControl(null),
          agreeToTerms: new FormControl(false, [Validators.requiredTrue]),
        }),
      }),

      handlerRegistry: [
        this.mainHandler,
        this.personalInfoHandler,
        this.accountHandler,
        this.preferencesHandler,
      ],

      mapperRegistry: {
        preferences: new PreferencesMapper(),
      },
    };

    this.orchestrate(options);
  }

  submit() {
    if (!this.form().valid) {
      this.form().markAllAsTouched();
      return;
    }

    console.log('Request body: ', this.buildRequest());

    this.setStatus('submitting');
    setTimeout(() => this.setStatus('success'), 1000);
  }

  // Example-specific -- not part of forms
  currentStep = signal(1);

  readonly steps = computed(() => {
    return [
      {
        label: 'Personal Information',
        form: this.getSubForm('personalInfo'),
      },
      {
        label: 'Account Details',
        form: this.getSubForm('accountDetails'),
      },
      {
        label: 'Preferences & Consent',
        form: this.getSubForm('preferences'),
      },
    ];
  });

  setCurrentStep(step: number) {
    this.currentStep.set(step);
  }

  getFormForStep(step: number) {
    return this.steps()[step].form;
  }

  files = [
    {
      path: 'assets/examples/multi-step-form/multi-step-form.component.html',
      language: 'html',
    },
    {
      path: 'assets/examples/multi-step-form/multi-step-form.component.ts',
      language: 'typescript',
    },
    {
      path: 'assets/examples/multi-step-form/personal-info.component.ts',
      language: 'typescript',
    },
    {
      path: 'assets/examples/multi-step-form/personal-info.handler.ts',
      language: 'typescript',
    },
    {
      path: 'assets/examples/multi-step-form/account-details.component.ts',
      language: 'typescript',
    },
    {
      path: 'assets/examples/multi-step-form/account-details.handler.ts',
      language: 'typescript',
    },
    {
      path: 'assets/examples/multi-step-form/preferences.component.ts',
      language: 'typescript',
    },
    {
      path: 'assets/examples/multi-step-form/preferences.handler.ts',
      language: 'typescript',
    },
    {
      path: 'assets/examples/multi-step-form/preferences.mapper.ts',
      language: 'typescript',
    },
  ];
}
