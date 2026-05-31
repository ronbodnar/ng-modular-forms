import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  Input,
  signal,
  SimpleChanges,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormControlBase } from '../mat-form-control-base';
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
} from 'rxjs';

type AutocompleteStatus = 'default' | 'loading' | 'error' | 'empty';

export interface AutocompleteOption<TResult> {
  value: TResult;
  label: string;
}

@Component({
  selector: 'nmf-mat-lookup',
  imports: [
    CommonModule,
    MatInputModule,
    MatAutocompleteModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule,
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
          matInput
          type="text"
          [class.cursor-not-allowed]="selectedItem != null"
          [class.opacity-60]="selectedItem != null"
          [ngClass]="classList"
          [name]="name()"
          [required]="isRequired()"
          [readonly]="selectedItem != null"
          [placeholder]="placeholder()"
          [formControl]="displayControl"
          [matAutocomplete]="auto"
          (blur)="onTouched()"
        />

        <mat-autocomplete
          #auto="matAutocomplete"
          [displayWith]="displayWith ?? null"
          (optionSelected)="selectOption($event)"
        >
          @for (option of filteredOptions | async; track option) {
            <mat-option [value]="option.value">{{ option.label }}</mat-option>
          }
        </mat-autocomplete>

        @if (loading()) {
          <mat-spinner matSuffix diameter="22" strokeWidth="3"></mat-spinner>
        }

        @if (status() === 'empty') {
          <mat-hint>{{ emptyOptionsLabel }}</mat-hint>
        } @else if (hint()) {
          <mat-hint [ngClass]="hintClassList()">{{ hint() }}</mat-hint>
        }

        <mat-error>{{ errorMessage() }}</mat-error>

        @if (status() === 'loading') {
          <mat-spinner matSuffix diameter="24" strokeWidth="3" />
        }

        @if (selectedItem) {
          <button matSuffix mat-icon-button (click)="clearSelectedOption()">
            <mat-icon>close</mat-icon>
          </button>
        }
      </mat-form-field>
    </div>
  `,
})
export class MatInputLookupComponent<TOption> extends MatFormControlBase<
  TOption,
  string
> {
  @Input() displayWith?: (value: TOption | null) => string;
  @Input() optionsProvider?: (
    query: string | null,
  ) => Observable<AutocompleteOption<TOption>[]>;

  @Input() options: AutocompleteOption<TOption>[] = [];
  @Input() emptyOptionsLabel = 'No results found';

  override readonly destroyRef = inject(DestroyRef);

  private _status = signal<AutocompleteStatus>('default');
  private _selectedOption = signal<TOption | null>(null);
  private _optionResults = signal<AutocompleteOption<TOption>[]>([]);

  public readonly status = this._status.asReadonly();
  public readonly optionResults = this._optionResults.asReadonly();
  public readonly selectedOption = this._selectedOption.asReadonly();

  private readonly _optionsUpdated$ = new Subject<void>();

  public filteredOptions!: Observable<AutocompleteOption<TOption>[]>;

  get selectedItem(): TOption | null {
    return this.selectedOption();
  }

  override writeValue(value: TOption | null): void {
    super.writeValue(value);
    const display =
      value != null && this.displayWith ? this.displayWith(value) : null;
    this.displayControl.setValue(display, { emitEvent: false });
  }

  setStatus(status: AutocompleteStatus): void {
    this._status.set(status);
  }

  clearSelectedOption(): void {
    this.displayControl.setValue(null);
    this._selectedOption.set(null);
    this.onChange(null);
    if (this.optionsProvider) {
      this.updateOptions([]);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['options']) {
      this.updateOptions(changes['options'].currentValue ?? []);
    }
    if (changes['selectedOption']) {
      /*       this.service.setSelectedEntity(
        changes['defaultSelectedEntity'].currentValue,
      ); */
    }
  }

  override ngOnInit(): void {
    super.ngOnInit();

    this.filteredOptions = merge(
      this.displayControl.valueChanges,
      this._optionsUpdated$,
    ).pipe(
      startWith(''),
      map(() => {
        const name = this.displayControl.value ?? '';
        const results = this.optionResults();
        return name ? this.filterOptions(name, results) : results.slice();
      }),
    );

    if (this.optionsProvider) {
      /*       valueChanges$
        ?.pipe(
          distinctUntilChanged(),
          takeUntilDestroyed(this.destroyRef),
          debounceTime(1000),
          filter((query) => typeof query === 'string' && query.length > 1),
          tap(() => {
            this._searchResults.set([]);
            this.setStatus('loading');
          }),
          switchMap((query) => this.optionsProvider?.(query) ?? of([])),
          catchError(() => {
            this.setStatus('error');
            return of(undefined);
          }),
        )
        .subscribe((response) => {
          if (!response) return;
          console.log('Response length', response.length);
          this._searchResults.set(response);
          this.setStatus(response.length > 0 ? 'default' : 'empty');
          this._resultsUpdated$.next();
        }); */
      this.displayControl.valueChanges
        .pipe(
          debounceTime(1000),
          distinctUntilChanged(),
          filter(() => this.selectedItem == null),
          filter((q): q is string => typeof q === 'string' && q.length > 1),
          tap(() => {
            this.setStatus('loading');
          }),
          switchMap(
            (query) =>
              this.optionsProvider?.(query).pipe(
                catchError(() => {
                  this.setStatus('error');
                  return of(null);
                }),
              ) ?? of([]),
          ),
          catchError(() => {
            this.setStatus('error');
            return of(null);
          }),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe((response) => {
          if (!response) return;
          this.setStatus(response.length ? 'default' : 'empty');
          this.updateOptions(response);
        });
    }
  }

  selectOption(result: MatAutocompleteSelectedEvent): void {
    const selected = this._optionResults().find(
      (option) => option.value === result.option.value,
    );
    if (!selected) {
      console.warn('Selected item not found', result, this.options);
      return;
    }

    this._selectedOption.set(selected.value);
    this.onChange(selected.value);
  }

  private updateOptions(results: AutocompleteOption<TOption>[]): void {
    this._optionResults.set(results);
    this._optionsUpdated$.next();
  }

  private filterOptions(
    name: string,
    results: AutocompleteOption<TOption>[],
  ): AutocompleteOption<TOption>[] {
    const filterValue = name.toLowerCase();
    return results.filter((option) =>
      option.label.toLowerCase().includes(filterValue),
    );
  }
}
