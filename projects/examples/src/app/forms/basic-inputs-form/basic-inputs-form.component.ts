import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  InputCurrencyComponent,
  InputSelectComponent,
  InputTextareaComponent,
  InputTextComponent,
  SelectOption,
} from '@ng-modular-forms/input';

@Component({
  selector: 'app-basic-inputs-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextComponent,
    InputSelectComponent,
    InputTextareaComponent,
    InputCurrencyComponent,
  ],
  templateUrl: './basic-inputs-form.component.html',
  styleUrl: './basic-inputs-form.component.css',
})
export class BasicInputsFormComponent {
  form = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
    confirmPassword: new FormControl('', Validators.required),
    country: new FormControl('', Validators.required),
    bio: new FormControl('', [Validators.maxLength(500)]),
    budget: new FormControl(0, [Validators.min(0)]),
  });

  countries: SelectOption[] = [
    { key: 'us', label: 'United States' },
    { key: 'ca', label: 'Canada' },
    { key: 'uk', label: 'United Kingdom' },
    { key: 'de', label: 'Germany' },
    { key: 'fr', label: 'France' },
    { key: 'jp', label: 'Japan' },
  ];

  getCountryLabel(country: string | null | undefined) {
    if (!country) return '';
    return this.countries.find((c) => c.key === country)?.label ?? '';
  }

  constructor() {
    this.form
      .get('confirmPassword')
      ?.setValidators([
        Validators.required,
        this.passwordMatchValidator.bind(this),
      ]);
  }

  passwordMatchValidator(control: FormControl): ValidationErrors | null {
    const password = this.form.get('password')?.value;
    const confirmPassword = control.value;

    if (password !== confirmPassword) {
      return { passwordMismatch: true };
    }

    return null;
  }

  submit() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      console.warn('Form contains invalid fields or errors:', this.form.errors);
      return;
    }

    console.log('Basic form submitted successfully', this.form.value);
    alert('Form submitted! Check the console for form data.');
  }
}
