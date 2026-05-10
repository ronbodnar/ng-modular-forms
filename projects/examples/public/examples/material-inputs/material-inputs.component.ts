import { Component, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  SelectOption,
  MatInputTextComponent,
  MatInputSelectComponent,
  MatInputTextareaComponent,
  MatInputCurrencyComponent,
  MatInputTimepickerComponent,
  MatInputDatepickerComponent,
  MatInputNumberComponent,
} from '@ng-modular-forms/material';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-material-inputs-example',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatButtonModule,
    MatInputTextComponent,
    MatInputSelectComponent,
    MatInputTextareaComponent,
    MatInputCurrencyComponent,
    MatInputTimepickerComponent,
    MatInputDatepickerComponent,
    MatInputNumberComponent,
  ],
  templateUrl: './material-inputs.component.html',
})
export class MaterialInputsExampleComponent {
  files = [
    {
      language: 'html',
      path: 'examples/material-inputs/material-inputs.component.html',
    },
    {
      language: 'typescript',
      path: 'examples/material-inputs/material-inputs.component.ts',
    },
  ];

  appearance = signal<'outline' | 'fill'>('outline');
  loading = signal(false);
  floatLabel = signal<'auto' | 'always'>('auto');

  form = new FormGroup({
    text: new FormControl('', [Validators.required, Validators.minLength(3)]),
    number: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(0),
      Validators.max(100),
    ]),
    numberFormatted: new FormControl<number | null>(null, [
      Validators.min(0),
      Validators.max(100),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
    select: new FormControl('', Validators.required),
    currency: new FormControl<number | null>(null, [Validators.min(0)]),
    textarea: new FormControl('', [
      Validators.maxLength(500),
      Validators.required,
    ]),
    date: new FormControl<Date | null>(null, Validators.required),
    time: new FormControl<Date | null>(null, Validators.required),
  });

  countries: SelectOption[] = [
    { key: 'us', label: 'United States' },
    { key: 'ca', label: 'Canada' },
    { key: 'uk', label: 'United Kingdom', disabled: true },
    { key: 'de', label: 'Germany', disabled: true },
    { key: 'fr', label: 'France' },
    { key: 'jp', label: 'Japan' },
  ];
}
