import { Component, OnInit, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormOrchestratorBase } from '@ng-modular-forms/core';
import {
  MatInputTextComponent,
  MatInputSelectComponent,
  MatInputCurrencyComponent,
  MatInputDatepickerComponent,
  MatInputTimepickerComponent,
  MatInputTextareaComponent,
  SelectOption,
} from '@ng-modular-forms/material';
import { FormSectionComponent } from '../../shared/form-section/form-section.component';
import { FormExampleComponent } from '../../shared/form-example/form-example.component';
import { FormSubmitButtonComponent } from '../../shared/form-submit-button/form-submit-button.component';
import { FormStatusOutputComponent } from '../../shared/form-status-output/form-status-output.component';

@Component({
  selector: 'app-registration-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputTextComponent,
    MatInputSelectComponent,
    MatInputCurrencyComponent,
    MatInputDatepickerComponent,
    MatInputTimepickerComponent,
    MatInputTextareaComponent,
    FormSectionComponent,
    FormExampleComponent,
    FormSubmitButtonComponent,
    FormStatusOutputComponent,
  ],
  templateUrl: './registration-form.component.html',
  styleUrl: './registration-form.component.css',
})
export class RegistrationFormComponent
  extends FormOrchestratorBase
  implements OnInit
{
  countries: SelectOption[] = [
    { key: 'us', label: 'United States' },
    { key: 'ca', label: 'Canada' },
    { key: 'mx', label: 'Mexico' },
    { key: 'uk', label: 'United Kingdom' },
    { key: 'de', label: 'Germany' },
    { key: 'fr', label: 'France' },
    { key: 'jp', label: 'Japan' },
    { key: 'au', label: 'Australia' },
  ];

  output = signal<any>(null);

  ngOnInit() {
    this.form().valueChanges.subscribe((value) => {
      this.output.set(value);
    });
  }

  constructor() {
    super();

    const form = new FormGroup({
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
        Validators.pattern(/^(\+1\s?)?(\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}$/),
      ]),
      country: new FormControl(''),
      dateOfBirth: new FormControl(''),
      timeOfBirth: new FormControl(''),
      monthlyBudget: new FormControl(0, [
        Validators.min(0),
        Validators.max(10000),
      ]),
      comments: new FormControl(''),
    });

    this.initialize(form);
    this.output.set(form.value);
  }

  submit() {
    if (!this.form().valid) {
      console.log('hey');
      this.form().markAllAsTouched();
      return;
    }

    this.setStatus('submitting');

    setTimeout(() => {
      this.setStatus('idle');
    }, 1000);
  }
}
