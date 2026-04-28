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
import { FormOrchestratorBase } from '@ng-modular-forms/core';
import { FormExampleComponent } from '../../shared/form-example/form-example.component';
import { FormStatusOutputComponent } from '../../shared/form-status-output/form-status-output.component';
import { RegistrationPersonalInfoComponent } from './personal-info/personal-info.component';
import { RegistrationAccountDetailsComponent } from './account-details/account-details.component';
import { RegistrationPreferencesComponent } from './preferences/preferences.component';
import { RegistrationFormHandler } from './registration-form.handler';
import { AccountDetailsFormHandler } from './account-details/account-details.handler';
import { PreferencesFormHandler } from './preferences/preferences.handler';
import { MatButtonModule } from '@angular/material/button';
import { PersonalInfoFormHandler } from './personal-info/personal-info.handler';
import { StepWrapperComponent } from '../../shared/step-wrapper/step-wrapper.component';

@Component({
  selector: 'app-registration-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    StepWrapperComponent,
    FormExampleComponent,
    FormStatusOutputComponent,
    RegistrationPersonalInfoComponent,
    RegistrationAccountDetailsComponent,
    RegistrationPreferencesComponent,
  ],
  providers: [
    RegistrationFormHandler,
    PersonalInfoFormHandler,
    AccountDetailsFormHandler,
    PreferencesFormHandler,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './registration-form.component.html',
})
export class RegistrationFormComponent extends FormOrchestratorBase {
  readonly steps = computed(() => [
    {
      label: 'Personal Information',
      form: this.form().get('personalInfo') as FormGroup,
    },
    {
      label: 'Account Details',
      form: this.form().get('accountDetails') as FormGroup,
    },
    {
      label: 'Preferences & Consent',
      form: this.form().get('preferences') as FormGroup,
    },
  ]);

  currentStep = signal(1);

  constructor() {
    super();

    const form = new FormGroup({
      accountDetails: new FormGroup({
        username: new FormControl('', [
          Validators.required,
          Validators.minLength(4),
        ]),
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
        ]),
        confirmPassword: new FormControl('', [Validators.required]),
        phone: new FormControl('', [
          Validators.pattern(
            /^(\+1\s?)?(\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}$/,
          ),
        ]),
      }),

      personalInfo: new FormGroup({
        firstName: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
        ]),
        lastName: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
        ]),
        email: new FormControl('', Validators.email),
        phone: new FormControl('', [
          Validators.pattern(
            /^(\+1\s?)?(\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}$/,
          ),
        ]),
        country: new FormControl(''),
        dateOfBirth: new FormControl(''),
        newsletter: new FormControl(false),
      }),

      preferences: new FormGroup({
        monthlyBudget: new FormControl<number | null>(null, [
          Validators.min(0),
          Validators.max(10000),
        ]),
        referralSource: new FormControl(''),
        comments: new FormControl(''),
        agreeToTerms: new FormControl(false, [Validators.requiredTrue]),
      }),
    });

    const mainHandler = inject(RegistrationFormHandler);
    const personalInfoHandler = inject(PersonalInfoFormHandler);
    const accountHandler = inject(AccountDetailsFormHandler);
    const preferencesHandler = inject(PreferencesFormHandler);

    const handlers = [
      mainHandler,
      personalInfoHandler,
      accountHandler,
      preferencesHandler,
    ];

    this.initialize(form, handlers);
  }

  setCurrentStep(step: number) {
    this.currentStep.set(step);
  }

  getForm(step: number) {
    return this.steps()[step].form;
  }

  submit() {
    if (!this.form().valid) {
      this.form().markAllAsTouched();
      return;
    }

    this.setStatus('submitting');

    setTimeout(() => {
      this.setStatus('success');
    }, 1000);
  }
}
