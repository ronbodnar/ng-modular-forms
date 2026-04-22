import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
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
import { FormSectionComponent } from '../../shared/form-section/form-section.component';
import { FormExampleComponent } from '../../shared/form-example/form-example.component';
import { FormStatusOutputComponent } from '../../shared/form-status-output/form-status-output.component';

@Component({
  selector: 'app-basic-inputs-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextComponent,
    InputSelectComponent,
    InputTextareaComponent,
    InputCurrencyComponent,
    FormExampleComponent,
    FormSectionComponent,
    FormStatusOutputComponent,
  ],
  templateUrl: './basic-inputs.component.html',
  styleUrl: './basic-inputs.component.css',
})
export class BasicInputsFormComponent {
  form = new FormGroup({
    text: new FormControl('', [Validators.required, Validators.minLength(3)]),
    number: new FormControl(null, [Validators.min(0), Validators.max(100)]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
    select: new FormControl('', Validators.required),
    currency: new FormControl(null, [Validators.min(0)]),
    textarea: new FormControl('', [Validators.maxLength(500)]),
  });

  countries: SelectOption[] = [
    { key: 'us', label: 'United States' },
    { key: 'ca', label: 'Canada' },
    { key: 'uk', label: 'United Kingdom' },
    { key: 'de', label: 'Germany' },
    { key: 'fr', label: 'France' },
    { key: 'jp', label: 'Japan' },
  ];
}
