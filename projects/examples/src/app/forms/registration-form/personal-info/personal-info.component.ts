import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import {
  MatInputTextComponent,
  MatInputSelectComponent,
  MatInputDatepickerComponent,
  SelectOption,
} from '@ng-modular-forms/material';
import { FormSectionComponent } from '../../../shared/form-section/form-section.component';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-registration-personal-info',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatInputTextComponent,
    MatInputSelectComponent,
    MatInputDatepickerComponent,
    FormSectionComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-form-section title="Personal Information" [formGroup]="form()">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <nmf-mat-text
          formControlName="firstName"
          label="First Name"
          placeholder="Enter your first name"
        />

        <nmf-mat-text
          formControlName="lastName"
          label="Last Name"
          placeholder="Enter your last name"
        />

        <nmf-mat-text
          formControlName="email"
          label="Email Address"
          type="email"
          placeholder="your.email@example.com"
        />

        <nmf-mat-select
          formControlName="country"
          label="Country"
          [options]="countries"
          placeholder="Select your country"
        />

        <nmf-mat-datepicker
          formControlName="dateOfBirth"
          label="Date of Birth"
          placeholder="Select your birth date"
        />

        <nmf-mat-text
          formControlName="phone"
          label="Phone Number"
          placeholder="(555) 123-4567"
        />

        <div
          class="mt-4 flex flex-col items-start gap-3 text-sm text-slate-700"
        >
          <mat-checkbox formControlName="newsletter">
            Sign up for our newsletter
          </mat-checkbox>

          @if (
            form().get('agreeToTerms')?.touched &&
            form().get('agreeToTerms')?.invalid
          ) {
            <div class="text-red-500">
              You must agree to the terms and conditions.
            </div>
          }
        </div>
      </div>
    </app-form-section>
  `,
})
export class RegistrationPersonalInfoComponent {
  form = input.required<FormGroup>();

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
}
