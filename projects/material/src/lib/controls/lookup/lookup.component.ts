import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  OnChanges,
  OnDestroy,
  signal,
  SimpleChanges,
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
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  distinctUntilChanged,
  debounceTime,
  tap,
  filter,
  switchMap,
  catchError,
  of,
  Observable,
  startWith,
  map,
  Subject,
  merge,
  take,
  EMPTY,
} from 'rxjs';

type LookupStatus = 'default' | 'loading' | 'error' | 'empty';

export interface LookupOption<TResult> {
  value: TResult;
  label: string;
}

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
    @if (label() && detachLabel()) {
      <label class="font-medium text-base">{{ label() }}</label>
    }

    <div class="relative">
      <mat-form-field
        class="w-full"
        [appearance]="appearance()"
        [floatLabel]="shouldLabelFloat()"
      >
        @if (label() && !detachLabel()) {
          <mat-label>{{ label() }}</mat-label>
        }

        <input
          #focusable
          matInput
          type="text"
          [class.cursor-not-allowed]="selectedOption() != null"
          [attr.aria-label]="detachLabel() ? label() : null"
          [ngClass]="classList"
          [id]="id()"
          [name]="name()"
          [required]="isRequired()"
          [readonly]="selectedOption() != null"
          [placeholder]="placeholder()"
          [formControl]="displayControl"
          [matAutocomplete]="auto"
          (blur)="onTouched()"
        />

        <mat-autocomplete
          #auto="matAutocomplete"
          [displayWith]="displayWith() ?? null"
          (optionSelected)="selectOption($event)"
        >
          @for (option of filteredOptions | async; track option) {
            <mat-option [value]="option.value">{{ option.label }}</mat-option>
          }
        </mat-autocomplete>

        @if (status() === 'empty') {
          <mat-hint>{{ emptyOptionsLabel() }}</mat-hint>
        } @else if (hint()) {
          <mat-hint [ngClass]="hintClassList()">{{ hint() }}</mat-hint>
        }

        <mat-error>{{ errorMessage() }}</mat-error>

        <!-- Loading status is for lookups and async options, and loading() is for the form control itself -->
        @if (status() === 'loading' || loading()) {
          <mat-spinner
            matSuffix
            class="nmf-mat-loader"
            diameter="24"
            strokeWidth="3"
          />
        }

        @if (selectedOption()) {
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
  implements OnChanges, OnDestroy
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

  override readonly destroyRef = inject(DestroyRef);

  private _status = signal<LookupStatus>('default');
  private _options = signal<LookupOption<TOption>[]>([]);
  private _selectedOption = signal<LookupOption<TOption> | null>(null);

  public readonly status = this._status.asReadonly();
  public readonly options = this._options.asReadonly();
  public readonly selectedOption = this._selectedOption.asReadonly();

  private readonly _optionsUpdated$ = new Subject<void>();

  public filteredOptions!: Observable<LookupOption<TOption>[]>;

  override ngOnInit(): void {
    super.ngOnInit();

    this.setupFilteredOptions();
    this.setupOptionsProvider();
  }

  override writeValue(value: TOption | null): void {
    super.writeValue(value);
    this.selectedMatchedOption(value);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['optionsSource']) {
      this.updateOptions(changes['optionsSource'].currentValue ?? []);
    }
  }

  ngOnDestroy(): void {
    this._optionsUpdated$.complete();
  }

  selectOption(result: MatAutocompleteSelectedEvent): void {
    const compareWith = this.compareWith();
    const selected = this._options().find((option) =>
      compareWith
        ? compareWith(option.value, result.option.value)
        : option.value === result.option.value,
    );
    if (!selected) {
      return;
    }

    this._selectedOption.set(selected);
    this.onChange(selected.value);
  }

  clearSelectedOption(): void {
    this.displayControl.setValue(null);
    this._selectedOption.set(null);
    this.onChange(null);
    if (this.optionsProvider()) {
      this.updateOptions([]);
    }
  }

  private selectedMatchedOption(value: TOption | null): void {
    const compareWith = this.compareWith();
    const match =
      this._options().find((o) =>
        compareWith
          ? compareWith(o.value, value as TOption)
          : o.value === value,
      ) ?? null;

    if (match) {
      this._selectedOption.set(match);
      return;
    }

    if (value === null) {
      this._selectedOption.set(null);
      return;
    }

    const displayProvider = this.displayProvider();
    if (displayProvider) {
      this._status.set('loading');

      displayProvider(value)
        .pipe(
          take(1),
          catchError(() => {
            this._status.set('error');
            return EMPTY;
          }),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe((label) => {
          this._selectedOption.set({
            value,
            label,
          });
          this._status.set('default');
        });
      return;
    }

    const displayWith = this.displayWith();
    if (displayWith) {
      this._selectedOption.set({
        value: value as TOption,
        label: displayWith(value),
      });
      return;
    }
  }

  private updateOptions(
    results: LookupOption<TOption>[],
    status?: LookupStatus,
  ): void {
    this._status.set(status ?? 'default');
    this._options.set(results);
    this._optionsUpdated$.next();
  }

  private filterOptions(
    name: string,
    results: LookupOption<TOption>[],
  ): LookupOption<TOption>[] {
    const filterValue = name.toLowerCase();
    return results.filter((option) =>
      option.label.toLowerCase().includes(filterValue),
    );
  }

  private setupFilteredOptions(): void {
    this.filteredOptions = merge(
      this.displayControl.valueChanges,
      this._optionsUpdated$,
    ).pipe(
      startWith(''),
      map(() => {
        const value = this.displayControl.value;
        const options = this.options();

        if (typeof value !== 'string') {
          return this.options().slice();
        }

        return value ? this.filterOptions(value, options) : options.slice();
      }),
    );
  }

  private setupOptionsProvider(): void {
    if (!this.optionsProvider) {
      return;
    }

    this.displayControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        if (
          typeof value !== 'object' &&
          (!value || value.length < this.searchThreshold())
        ) {
          this.updateOptions([]);
        }
      });

    this.displayControl.valueChanges
      .pipe(
        debounceTime(this.debounceTime()),
        distinctUntilChanged((a, b) => a === b),
        filter(() => this.selectedOption() == null),
        filter(
          (q): q is string =>
            typeof q === 'string' && q.length >= this.searchThreshold(),
        ),
        tap(() => this.updateOptions([], 'loading')),
        switchMap((query) => {
          const optionsProvider = this.optionsProvider();
          if (!optionsProvider) {
            return of([]);
          }
          return optionsProvider(query).pipe(
            catchError(() => {
              this._status.set('error');
              return of(null);
            }),
          );
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((response) => {
        if (!response) {
          return;
        }
        const status = response.length ? 'default' : 'empty';
        this.updateOptions(response, status);
      });
  }
}
