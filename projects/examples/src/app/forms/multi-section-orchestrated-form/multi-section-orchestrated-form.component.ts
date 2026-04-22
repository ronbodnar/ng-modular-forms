import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormOrchestratorBase } from '@ng-modular-forms/core';
import { MultiSectionFormHandler } from './multi-section-form.handler';
import { PersonalInfoSectionComponent } from './personal-info-section/personal-info-section.component';
import { AddressSectionComponent } from './address-section/address-section.component';
import { PaymentSectionComponent } from './payment-section/payment-section.component';

@Component({
  selector: 'app-multi-section-orchestrated-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PersonalInfoSectionComponent,
    AddressSectionComponent,
    PaymentSectionComponent,
  ],
  templateUrl: './multi-section-orchestrated-form.component.html',
  styleUrl: './multi-section-orchestrated-form.component.css',
})
export class MultiSectionOrchestratedFormComponent extends FormOrchestratorBase {
  constructor() {
    super();

    // Initialize with an empty form - sections will be added via onSubformReady
    this.initialize(new FormGroup({}), {
      mainHandler: new MultiSectionFormHandler(),
    });
  }

  override onSubformReady(subform: FormGroup, sectionName: string) {
    // Add each section to the main form
    this.onSubformReady(subform, sectionName);
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

    console.log('Multi-section form submitted successfully', this.form().value);
    alert(
      'Registration completed! Check the console for the complete form data.',
    );
  }
}
