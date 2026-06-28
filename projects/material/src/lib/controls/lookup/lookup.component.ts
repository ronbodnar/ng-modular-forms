import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  OnDestroy,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormControlBase } from '../../base/mat-form-control-base';
import { MatButtonModule } from '@angular/material/button';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { LookupBehavior, LookupOption } from '@ng-modular-forms/core';

@Component({
  selector: 'nmf-mat-lookup',
  exportAs: 'nmfMatLookup',
  imports: [
    CommonModule,
    MatInputModule,
    MatAutocompleteModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    AsyncPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (translatedLabel() && detachLabel()) {
      <label class="nmf-mat-label-detached">{{ translatedLabel() }}</label>
    }

    <div class="relative">
      <mat-form-field
        class="nmf-mat-field"
        [appearance]="appearance()"
        [floatLabel]="shouldLabelFloat()"
        [hideRequiredMarker]="hideRequiredMarker()"
      >
        @if (translatedLabel() && !detachLabel()) {
          <mat-label>{{ translatedLabel() }}</mat-label>
        }

        <input
          #focusable
          matInput
          type="text"
          [class.cursor-not-allowed]="!isOptionSelected(null)"
          [attr.aria-label]="detachLabel() ? translatedLabel() : null"
          [ngClass]="classList"
          [id]="id()"
          [name]="name()"
          [required]="isRequired()"
          [readonly]="!isOptionSelected(null)"
          [placeholder]="translatedPlaceholder()"
          [formControl]="displayControl"
          [matAutocomplete]="auto"
          (blur)="onFocusOut()"
          (focus)="onFocusIn()"
        />

        <mat-autocomplete
          #auto="matAutocomplete"
          [displayWith]="displayWith() ?? null"
          (optionSelected)="selectOption($event)"
        >
          @for (option of behavior.filteredOptions | async; track option) {
            <mat-option [value]="option.value">{{ option.label }}</mat-option>
          }
        </mat-autocomplete>

        @if (status() === 'empty') {
          <mat-hint>{{ translatedEmptyOptionsLabel() }}</mat-hint>
        } @else if (translatedHintLabel()) {
          <mat-hint [ngClass]="hintClassList()">{{
            translatedHintLabel()
          }}</mat-hint>
        }

        <mat-error>{{ translatedErrorMessage() }}</mat-error>

        <!-- Loading status is for lookups and async options, and loading() is for the form control itself -->
        @if (status() === 'loading' || loading()) {
          <mat-spinner
            matSuffix
            class="nmf-mat-loader"
            diameter="24"
            strokeWidth="3"
          />
        }

        @if (!isOptionSelected(null)) {
          <button
            matSuffix
            mat-icon-button
            aria-label="Clear selection"
            (click)="clearSelectedOption()"
          >
            <mat-icon>close</mat-icon>
          </button>
        }
      </mat-form-field>
    </div>
  `,
})
export class MatInputLookupComponent<TOption>
  extends MatFormControlBase<TOption, string>
  implements OnDestroy
{
  override readonly autocompleteAttr = input<string | null>('off');

  /*
   * Static options to display in the dropdown. This is for synchronous sources.
   */
  optionsSource = input<LookupOption<TOption>[]>([]);

  /*
   * Must return a cancellable observable. This is for asynchronous sources (API calls, etc).
   */
  optionsProvider =
    input<(query: string | null) => Observable<LookupOption<TOption>[]>>();

  /*
   * When using a synchronous options source, or an asynchronous provider that returns an object where the shape is known,
   * this function is used to determine the display value.
   */
  displayWith = input<(value: TOption | null) => string>();

  /*
   * Used to determine the display value asynchronously when using primitive types for form values
   * eg: countryCode instead of Country itself.
   *
   * If not provided, the raw value will be used. Only needed for patching/hydrating the form.
   */
  displayProvider = input<(value: TOption | null) => Observable<string>>();

  /*
   * Used to compare options during selection if object equality is not sufficient.
   */
  compareWith = input<(a: TOption, b: TOption) => boolean>();

  emptyOptionsLabel = input<string>('No results found');

  /*
   * Search will be debounced by this many milliseconds.
   */
  debounceTime = input<number>(500);

  /*
   * Search will not be triggered until the user has typed at least this many characters.
   */
  searchThreshold = input<number>(2);

  readonly status = computed(() => this.behavior.status());

  readonly translatedEmptyOptionsLabel = computed(() =>
    this.translate(this.emptyOptionsLabel()),
  );

  behavior: LookupBehavior<TOption>;

  constructor() {
    super();

    this.behavior = new LookupBehavior<TOption>({
      destroyRef: this.destroyRef,
      resolvers: {
        compare: this.compareWith,
        label: this.displayWith,
        labelAsync: this.displayProvider,
        search: this.optionsProvider,
      },
    });

    effect(() => {
      const currentOptions = this.optionsSource() ?? [];
      this.behavior.updateOptions(currentOptions);
    });

    effect(() => {
      const selectedOption = this.behavior.selectedOption();
      this.onChange(selectedOption?.value ?? null);
    });
  }

  override ngOnInit(): void {
    super.ngOnInit();

    this.behavior.setupFilteredOptions(
      this.displayControl.valueChanges,
      this.displayValue,
    );
    this.behavior.setupOptionsProvider(
      this.displayControl.valueChanges,
      500,
      2,
    );
  }

  ngOnDestroy(): void {
    this.behavior.optionsUpdated$.complete();
  }

  override writeValue(value: TOption | null): void {
    super.writeValue(value);
    this.behavior.selectedMatchedOption(value);
  }

  selectOption(result: MatAutocompleteSelectedEvent): void {
    const lookupOption = {
      value: result.option.value,
      label: result.option.viewValue,
    };
    this.behavior.selectOption(undefined, lookupOption);
  }

  clearSelectedOption(): void {
    this.displayControl.setValue(null);
    this.behavior.clearSelectedOption();
  }

  isOptionSelected(value: TOption | null): boolean {
    return this.behavior.isOptionSelected(value);
  }
}
