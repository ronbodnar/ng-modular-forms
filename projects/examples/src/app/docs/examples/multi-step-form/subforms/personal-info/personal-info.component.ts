import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormArray } from '@angular/forms';
import {
  MatInputTextComponent,
  MatInputSelectComponent,
  MatInputDatepickerComponent,
} from '@ng-modular-forms/material';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormSectionComponent } from '../../../../ui/form-section/form-section.component';
import type { SelectOption } from '@ng-modular-forms/core';

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

        <div formArrayName="array">
          @for (control of array.controls; track control; let i = $index) {
            <ng-template [formGroupName]="i">
              <nmf-mat-text
                formControlName="text"
                [label]="'Form array ' + (i + 1)"
              />
            </ng-template>
          }
        </div>

        <div class="flex flex-col items-start gap-3 text-sm">
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

  get array(): FormArray {
    return this.form().get('array') as FormArray;
  }

  countries: SelectOption[] = [
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'mx', label: 'Mexico' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'de', label: 'Germany' },
    { value: 'fr', label: 'France' },
    { value: 'jp', label: 'Japan' },
    { value: 'au', label: 'Australia' },
  ];
}
