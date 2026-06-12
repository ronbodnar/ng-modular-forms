import { computed, signal } from '@angular/core';
import {
  LookupBehaviorOptions,
  LookupOption,
  LookupStatus,
} from '../../controls/lookup/lookup.types';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  take,
  catchError,
  EMPTY,
  Subject,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  merge,
  of,
  startWith,
  switchMap,
  tap,
  Observable,
} from 'rxjs';

export class LookupBehavior<TOption> {
  private readonly _status = signal<LookupStatus>('default');
  private readonly _options = signal<LookupOption<TOption>[]>([]);
  private readonly _selectedOption = signal<LookupOption<TOption> | null>(null);

  public readonly status = this._status.asReadonly();
  public readonly options = this._options.asReadonly();
  public readonly selectedOption = this._selectedOption.asReadonly();

  public readonly optionsUpdated$ = new Subject<void>();

  public filteredOptions!: Observable<LookupOption<TOption>[]>;

  public readonly filteredOptionss = computed(() => {});

  bOptions!: LookupBehaviorOptions<TOption>;

  constructor(bOptions: LookupBehaviorOptions<TOption>) {
    this.bOptions = bOptions;
  }

  setSelectedOption(value: LookupOption<TOption> | null): void {
    this._selectedOption.set(value);
  }

  selectOption(event: Event | undefined, option: LookupOption<TOption>): void {
    event?.stopPropagation();

    const compare = this.bOptions.resolvers.compare() ?? undefined;

    const selected = this.options().find((o) =>
      compare ? compare(o.value, option.value) : o.value === option.value,
    );
    if (!selected) {
      return;
    }

    this.setSelectedOption(selected);
  }

  clearSelectedOption(): void {
    this.setSelectedOption(null);
  }

  selectedMatchedOption(value: TOption | null): void {
    const { destroyRef, resolvers } = this.bOptions;

    const compare = resolvers.compare() ?? undefined;
    const label = resolvers.label() ?? undefined;
    const labelAsync = resolvers.labelAsync() ?? undefined;

    const match =
      this._options().find((o) =>
        compare ? compare(o.value, value as TOption) : o.value === value,
      ) ?? null;

    if (match) {
      this._selectedOption.set(match);
      return;
    }

    if (value === null) {
      this._selectedOption.set(null);
      return;
    }

    if (labelAsync) {
      this._status.set('loading');

      labelAsync(value)
        .pipe(
          take(1),
          catchError(() => {
            this._status.set('error');
            return EMPTY;
          }),
          takeUntilDestroyed(destroyRef),
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

    if (label) {
      this._selectedOption.set({
        value: value as TOption,
        label: label(value),
      });
      return;
    }
  }

  updateOptions(results: LookupOption<TOption>[], status?: LookupStatus): void {
    this._status.set(status ?? 'default');
    this._options.set(results);
    this.optionsUpdated$.next();
  }

  filterOptions(
    name: string,
    results: LookupOption<TOption>[],
  ): LookupOption<TOption>[] {
    const filterValue = name.toLowerCase();
    return results.filter(
      (option) =>
        option.label.toLowerCase().includes(filterValue) ||
        String(option.value).includes(filterValue),
    );
  }

  setupFilteredOptions(
    source: Observable<unknown>,
    searchQuery: unknown,
  ): void {
    this.filteredOptions = merge(source, this.optionsUpdated$).pipe(
      startWith(''),
      map(() => {
        const options = this.options();
        let value = searchQuery;

        if (typeof searchQuery === 'function') {
          value = searchQuery();
        }

        if (typeof value !== 'string') {
          return this.options().slice();
        }

        return searchQuery
          ? this.filterOptions(value, options)
          : options.slice();
      }),
    );
  }

  setupOptionsProvider(
    source: Observable<string | null>,
    debounceDelay: number,
    searchThreshold: number,
  ): void {
    const { destroyRef, resolvers } = this.bOptions;

    const search = resolvers.search() ?? undefined;

    if (!search) {
      return;
    }

    source.pipe(takeUntilDestroyed(destroyRef)).subscribe((value) => {
      if (!value || value.length < searchThreshold) {
        this.updateOptions([]);
      }
    });

    source
      .pipe(
        debounceTime(debounceDelay),
        distinctUntilChanged((a, b) => a === b),
        filter(() => this.selectedOption() == null),
        filter(
          (q): q is string =>
            typeof q === 'string' && q.length >= searchThreshold,
        ),
        tap(() => this.updateOptions([], 'loading')),
        switchMap((query) =>
          search(query).pipe(
            catchError(() => {
              this._status.set('error');
              return of(null);
            }),
          ),
        ),
        takeUntilDestroyed(destroyRef),
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
