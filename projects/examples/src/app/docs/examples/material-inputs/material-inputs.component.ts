import { Component, OnInit, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { delay, Observable, of } from 'rxjs';
import {
  MatInputTextComponent,
  MatInputSelectComponent,
  MatInputTextareaComponent,
  MatInputCurrencyComponent,
  MatInputTimepickerComponent,
  MatInputDatepickerComponent,
  MatInputNumberComponent,
  MatInputLookupComponent,
  AutocompleteOption,
} from '@ng-modular-forms/material';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { FormSectionComponent } from '../../ui/form-section/form-section.component';
import { DocsPageComponent } from '../../ui/docs-page/docs-page.component';
import { FormStatusOutputComponent } from '../../ui/form-status-output/form-status-output.component';
import type { SelectOption } from '@ng-modular-forms/core';

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
    MatInputLookupComponent,
    DocsPageComponent,
    FormSectionComponent,
    FormStatusOutputComponent,
    MatInputTimepickerComponent,
    MatInputDatepickerComponent,
    MatInputNumberComponent,
  ],
  templateUrl: './material-inputs.component.html',
})
export class MaterialInputsExampleComponent implements OnInit {
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
    lookupSync: new FormControl<string | null>(null),
    lookupAsync: new FormControl<string | null>(null),
  });

  countries: SelectOption[] = [
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'uk', label: 'United Kingdom', disabled: true },
    { value: 'de', label: 'Germany', disabled: true },
    { value: 'fr', label: 'France' },
    { value: 'jp', label: 'Japan' },
  ];

  countryOptions: AutocompleteOption<string>[] = [
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'de', label: 'Germany' },
    { value: 'fr', label: 'France' },
    { value: 'jp', label: 'Japan' },
  ];

  countryOptionsProvider = (
    query: string | null,
  ): Observable<AutocompleteOption<string>[]> => {
    if (query == null) {
      return of(this.countryOptions);
    }

    return of(
      this.countryOptions.filter((o) =>
        o.label.toLowerCase().includes(query.toLowerCase()),
      ),
    ).pipe(delay(1000));
  };

  displayCountry = (value: string | null): string => {
    if (value == null) {
      return '';
    }
    return this.countryOptions.find((c) => c.value === value)?.label ?? '';
  };

  // Example-specific -- not part of forms
  files = [
    {
      language: 'html',
      path: 'assets/examples/material-inputs/material-inputs.component.html',
    },
    {
      language: 'typescript',
      path: 'assets/examples/material-inputs/material-inputs.component.ts',
    },
  ];

  options = new FormGroup({
    appearance: new FormControl<'outline' | 'fill'>('outline'),
    loading: new FormControl(false),
    floatLabel: new FormControl<'auto' | 'always'>('auto'),
    disabled: new FormControl(false),
  });

  appearance = signal<'outline' | 'fill'>('outline');
  loading = signal(false);
  floatLabel = signal<'auto' | 'always'>('auto');

  ngOnInit(): void {
    this.options.valueChanges.subscribe((v) => {
      this.appearance.set(v.appearance ?? 'outline');
      this.loading.set(v.loading ?? false);
      this.floatLabel.set(v.floatLabel ?? 'auto');

      if (v.disabled) {
        this.form.disable({ emitEvent: false });
      } else {
        this.form.enable({ emitEvent: false });
      }
    });
  }

  populateForm(): void {
    this.form.patchValue({
      text: 'Hello World',
      number: 1230,
      numberFormatted: 1230,
      password: '12345678',
      select: 'us',
      currency: 1230,
      textarea: 'Hello\n\nWorld',
      date: new Date(),
      time: new Date(),
      lookupSync: 'us',
      lookupAsync: 'us',
    });
  }

  validateForm(): void {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();
  }
}
