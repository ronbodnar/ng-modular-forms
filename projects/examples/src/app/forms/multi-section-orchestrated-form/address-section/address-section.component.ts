import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  MatInputTextComponent,
  MatInputSelectComponent,
} from '@ng-modular-forms/material';

@Component({
  selector: 'app-address-section',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputTextComponent,
    MatInputSelectComponent,
  ],
  templateUrl: './address-section.component.html',
  styleUrl: './address-section.component.css',
})
export class AddressSectionComponent {
  @Output() formReady = new EventEmitter<FormGroup>();

  form = new FormGroup({
    streetAddress: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    state: new FormControl('', Validators.required),
    zipCode: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d{5}(-\d{4})?$/),
    ]),
    country: new FormControl('us', Validators.required),
  });

  countries = [
    { key: 'us', label: 'United States' },
    { key: 'ca', label: 'Canada' },
    { key: 'uk', label: 'United Kingdom' },
    { key: 'de', label: 'Germany' },
    { key: 'fr', label: 'France' },
    { key: 'au', label: 'Australia' },
  ];

  usStates = [
    { key: 'AL', label: 'Alabama' },
    { key: 'AK', label: 'Alaska' },
    { key: 'AZ', label: 'Arizona' },
    { key: 'AR', label: 'Arkansas' },
    { key: 'CA', label: 'California' },
    { key: 'CO', label: 'Colorado' },
    { key: 'CT', label: 'Connecticut' },
    { key: 'DE', label: 'Delaware' },
    { key: 'FL', label: 'Florida' },
    { key: 'GA', label: 'Georgia' },
    { key: 'HI', label: 'Hawaii' },
    { key: 'ID', label: 'Idaho' },
    { key: 'IL', label: 'Illinois' },
    { key: 'IN', label: 'Indiana' },
    { key: 'IA', label: 'Iowa' },
    { key: 'KS', label: 'Kansas' },
    { key: 'KY', label: 'Kentucky' },
    { key: 'LA', label: 'Louisiana' },
    { key: 'ME', label: 'Maine' },
    { key: 'MD', label: 'Maryland' },
    { key: 'MA', label: 'Massachusetts' },
    { key: 'MI', label: 'Michigan' },
    { key: 'MN', label: 'Minnesota' },
    { key: 'MS', label: 'Mississippi' },
    { key: 'MO', label: 'Missouri' },
    { key: 'MT', label: 'Montana' },
    { key: 'NE', label: 'Nebraska' },
    { key: 'NV', label: 'Nevada' },
    { key: 'NH', label: 'New Hampshire' },
    { key: 'NJ', label: 'New Jersey' },
    { key: 'NM', label: 'New Mexico' },
    { key: 'NY', label: 'New York' },
    { key: 'NC', label: 'North Carolina' },
    { key: 'ND', label: 'North Dakota' },
    { key: 'OH', label: 'Ohio' },
    { key: 'OK', label: 'Oklahoma' },
    { key: 'OR', label: 'Oregon' },
    { key: 'PA', label: 'Pennsylvania' },
    { key: 'RI', label: 'Rhode Island' },
    { key: 'SC', label: 'South Carolina' },
    { key: 'SD', label: 'South Dakota' },
    { key: 'TN', label: 'Tennessee' },
    { key: 'TX', label: 'Texas' },
    { key: 'UT', label: 'Utah' },
    { key: 'VT', label: 'Vermont' },
    { key: 'VA', label: 'Virginia' },
    { key: 'WA', label: 'Washington' },
    { key: 'WV', label: 'West Virginia' },
    { key: 'WI', label: 'Wisconsin' },
    { key: 'WY', label: 'Wyoming' },
  ];

  ngOnInit() {
    this.formReady.emit(this.form);
  }
}
