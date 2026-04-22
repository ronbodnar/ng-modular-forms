import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormOrchestratorBase } from '@ng-modular-forms/core';
import { ComplexFormHandler } from './complex-form.handler';
import {
  MatInputTextComponent,
  MatInputSelectComponent,
  MatInputCurrencyComponent,
  SelectOption,
} from '@ng-modular-forms/material';

@Component({
  selector: 'app-complex-form-with-handlers',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputTextComponent,
    MatInputSelectComponent,
    MatInputCurrencyComponent,
  ],
  templateUrl: './complex-form-with-handlers.component.html',
  styleUrl: './complex-form-with-handlers.component.css',
})
export class ComplexFormWithHandlersComponent extends FormOrchestratorBase {
  employmentTypes: SelectOption[] = [
    { key: 'employed', label: 'Employed' },
    { key: 'student', label: 'Student' },
    { key: 'unemployed', label: 'Unemployed' },
    { key: 'self-employed', label: 'Self-employed' },
  ];

  constructor() {
    super();

    this.initialize(
      new FormGroup({
        employmentType: new FormControl('', Validators.required),
        companyName: new FormControl({ value: '', disabled: true }),
        jobTitle: new FormControl({ value: '', disabled: true }),
        studentId: new FormControl({ value: '', disabled: true }),
        universityName: new FormControl({ value: '', disabled: true }),
        graduationYear: new FormControl({ value: '', disabled: true }),
        hasDependents: new FormControl(false),
        numberOfDependents: new FormControl({ value: 0, disabled: true }),
        monthlyIncome: new FormControl(0, [
          Validators.required,
          Validators.min(0),
        ]),
        creditScore: new FormControl('', [
          Validators.required,
          Validators.min(300),
          Validators.max(850),
        ]),
      }),
      {
        mainHandler: new ComplexFormHandler(),
      },
    );
  }

  submit() {
    if (!this.form().valid) {
      this.form().markAllAsTouched();
      console.warn(
        'Form contains invalid fields or errors:',
        this.form().errors,
      );
      return;
    }

    console.log('Complex form submitted successfully', this.form().value);
    alert('Application submitted! Check the console for form data.');
  }
}
