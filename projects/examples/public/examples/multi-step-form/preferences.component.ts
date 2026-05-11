import { Component, input } from '@angular/core';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectOption } from '@ng-modular-forms/core';
import {
  MatInputCurrencyComponent,
  MatInputSelectComponent,
  MatInputTextareaComponent,
} from '@ng-modular-forms/material';

@Component({
  selector: 'app-registration-preferences',
  imports: [
    ReactiveFormsModule,
    MatInputCurrencyComponent,
    MatInputSelectComponent,
    MatInputTextareaComponent,
    MatCheckboxModule,
  ],
  template: `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4" [formGroup]="form()">
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
