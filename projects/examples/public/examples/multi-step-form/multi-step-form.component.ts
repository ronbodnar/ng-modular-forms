import { Component, signal, computed, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  FormOrchestrator,
  FormHydrator,
  FormSerializer,
} from '@ng-modular-forms/core';
import type {
  FormHandlerRegistry,
  FormOrchestratorOptions,
} from '@ng-modular-forms/core';
import { RegistrationAccountDetailsComponent } from './account-details.component';
import { AccountDetailsFormHandler } from './account-details.handler';
import { RegistrationPersonalInfoComponent } from './personal-info.component';
import { PersonalInfoFormHandler } from './personal-info.handler';
import { RegistrationPreferencesComponent } from './preferences.component';
import { PreferencesFormHandler } from './preferences.handler';
import { PreferencesMapper } from './preferences.mapper';
import { MultiStepFormHandler } from './multi-step-form.handler';

@Component({
  selector: 'app-registration-form',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
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
  templateUrl: './multi-step-form.component.html',
})
export class MultiStepFormComponent extends FormOrchestrator {
  private handlers: FormHandlerRegistry = [
    inject(MultiStepFormHandler),
    inject(PersonalInfoFormHandler),
    inject(AccountDetailsFormHandler),
    inject(PreferencesFormHandler),
  ];

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

      handlerRegistry: [...this.handlers],

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

  // Step wrapper-related -- not part of forms
  currentStep = signal(1);

  readonly steps = computed(() => {
    return [
      {
        label: 'Personal Information',
        form: this.getSubForm<FormGroup>('personalInfo'),
      },
      {
        label: 'Account Details',
        form: this.getSubForm<FormGroup>('accountDetails'),
      },
      {
        label: 'Preferences & Consent',
        form: this.getSubForm<FormGroup>('preferences'),
      },
    ];
  });

  setCurrentStep(step: number) {
    this.currentStep.set(step);
  }

  getFormForStep(step: number) {
    return this.steps()[step].form;
  }
}
