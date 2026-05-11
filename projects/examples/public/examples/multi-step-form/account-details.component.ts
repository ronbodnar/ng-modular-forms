import { Component, input } from '@angular/core';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatInputTextComponent } from '@ng-modular-forms/material';

@Component({
  selector: 'app-registration-account-details',
  standalone: true,
  imports: [ReactiveFormsModule, MatInputTextComponent],
  template: `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4" [formGroup]="form()">
      <nmf-mat-text
        formControlName="username"
        label="Username"
        placeholder="Create a username"
      />

      <nmf-mat-text
        formControlName="password"
        label="Password"
        type="password"
        placeholder="Enter a secure password"
      />

      <nmf-mat-text
        formControlName="confirmPassword"
        label="Confirm Password"
        type="password"
        placeholder="Repeat your password"
      />

      <nmf-mat-text
        formControlName="phone"
        label="Phone Number"
        placeholder="(555) 123-4567"
      />
    </div>
  `,
})
export class RegistrationAccountDetailsComponent {
  form = input.required<FormGroup>();
}
