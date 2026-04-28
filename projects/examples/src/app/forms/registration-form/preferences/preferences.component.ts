import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import {
  MatInputCurrencyComponent,
  MatInputSelectComponent,
  MatInputTextareaComponent,
  SelectOption,
} from '@ng-modular-forms/material';
import { FormSectionComponent } from '../../../shared/form-section/form-section.component';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-registration-preferences',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputCurrencyComponent,
    MatInputSelectComponent,
    MatInputTextareaComponent,
    FormSectionComponent,
    MatCheckboxModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-form-section title="Preferences & Consent" [formGroup]="form()">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <nmf-mat-currency
          formControlName="monthlyBudget"
          label="Monthly Budget"
          placeholder="Enter your budget"
        />

        <nmf-mat-select
          formControlName="referralSource"
          label="How did you hear about us?"
          [options]="referralOptions"
          placeholder="Select a source"
        />

        <nmf-mat-textarea
          formControlName="comments"
          label="Comments"
          placeholder="Anything else we should know?"
          [rows]="3"
        />
      </div>

      <div class="mt-4 flex flex-col items-start gap-3 text-sm text-slate-700">
        <mat-checkbox formControlName="agreeToTerms">
          I agree to the terms and conditions and consent to processing my
          registration.</mat-checkbox
        >

        @if (
          form().get('agreeToTerms')?.touched &&
          form().get('agreeToTerms')?.invalid
        ) {
          <div class="text-red-500">
            You must agree to the terms and conditions.
          </div>
        }
      </div>
    </app-form-section>
  `,
})
export class RegistrationPreferencesComponent {
  form = input.required<FormGroup>();

  referralOptions: SelectOption[] = [
    { key: 'friend', label: 'Friend or colleague' },
    { key: 'search', label: 'Search engine' },
    { key: 'ad', label: 'Online ad' },
    { key: 'social', label: 'Social media' },
    { key: 'other', label: 'Other' },
  ];
}
