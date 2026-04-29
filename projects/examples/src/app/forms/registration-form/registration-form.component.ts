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
import { FormOrchestrator } from '@ng-modular-forms/core';
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
import { PreferencesMapper } from './preferences/preferences.mapper';

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
export class RegistrationFormComponent extends FormOrchestrator {
  private readonly mainHandler = inject(RegistrationFormHandler);
  private readonly personalInfoHandler = inject(PersonalInfoFormHandler);
  private readonly accountHandler = inject(AccountDetailsFormHandler);
  private readonly preferencesHandler = inject(PreferencesFormHandler);

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

  constructor() {
    super();
    this.initialize();
  }

  initialize() {
    const options = {
      form: new FormGroup({
        dummy: new FormControl(null),
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

        personalInfo: new FormGroup({
          firstName: new FormControl(null, [Validators.minLength(2)]),
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

      handlers: [
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

  setCurrentStep(step: number) {
    this.currentStep.set(step);
  }

  getFormForStep(step: number) {
    return this.steps()[step].form;
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
}
