import { DestroyRef, signal } from '@angular/core';
import { Subject, of, throwError } from 'rxjs';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { LookupBehavior } from './lookup.behavior';
import {
  LookupBehaviorOptions,
  LookupOption,
} from '../../controls/lookup/lookup.types';

function makeDestroyRef(): DestroyRef {
  return {
    onDestroy: vi.fn(() => () => {}),
  } as unknown as DestroyRef;
}

// InputSignal carries branding that signal() can't satisfy outside Angular's DI.
// We cast through `any` here so tests can supply plain signals without boilerplate.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyResolvers = Record<string, any>;

function makeResolvers<TOption>(
  overrides: AnyResolvers = {},
): LookupBehaviorOptions<TOption>['resolvers'] {
  return {
    compare: signal(null),
    label: signal(null),
    labelAsync: signal(null),
    search: signal(null),
    ...overrides,
  } as unknown as LookupBehaviorOptions<TOption>['resolvers'];
}

function makeOptions<TOption>(
  overrides: Partial<LookupBehaviorOptions<TOption>> = {},
): LookupBehaviorOptions<TOption> {
  return {
    destroyRef: makeDestroyRef(),
    resolvers: makeResolvers<TOption>(overrides.resolvers),
    ...overrides,
  } as unknown as LookupBehaviorOptions<TOption>;
}

function option<T>(value: T, label: string): LookupOption<T> {
  return { value, label };
}

describe('LookupBehavior', () => {
  describe('initial state', () => {
    it('starts with default status', () => {
      const behavior = new LookupBehavior(makeOptions());
      expect(behavior.status()).toBe('default');
    });

    it('starts with empty options', () => {
      const behavior = new LookupBehavior(makeOptions());
      expect(behavior.options()).toEqual([]);
    });

    it('starts with null selected option', () => {
      const behavior = new LookupBehavior(makeOptions());
      expect(behavior.selectedOption()).toBeNull();
    });
  });

  describe('setSelectedOption', () => {
    it('sets the selected option', () => {
      const behavior = new LookupBehavior(makeOptions());
      const opt = option(1, 'One');
      behavior.setSelectedOption(opt);
      expect(behavior.selectedOption()).toEqual(opt);
    });

    it('clears selected option when set to null', () => {
      const behavior = new LookupBehavior(makeOptions());
      behavior.setSelectedOption(option(1, 'One'));
      behavior.setSelectedOption(null);
      expect(behavior.selectedOption()).toBeNull();
    });
  });

  describe('selectOption', () => {
    it('sets the matching option using strict equality', () => {
      const behavior = new LookupBehavior(makeOptions());
      behavior.updateOptions([option(1, 'One'), option(2, 'Two')]);
      behavior.selectOption(undefined, option(2, 'Two'));
      expect(behavior.selectedOption()?.value).toBe(2);
    });

    it('uses compareWith when provided', () => {
      const behavior = new LookupBehavior(
        makeOptions({
          resolvers: makeResolvers({
            compare: signal(
              (a: { id: number }, b: { id: number }) => a.id === b.id,
            ),
          }),
        }),
      );
      const opts = [option({ id: 1 }, 'One'), option({ id: 2 }, 'Two')];
      behavior.updateOptions(opts);
      behavior.selectOption(undefined, option({ id: 2 }, 'Two'));
      expect(behavior.selectedOption()?.value).toEqual({ id: 2 });
    });

    it('does nothing when option is not found in current list', () => {
      const behavior = new LookupBehavior(makeOptions());
      behavior.updateOptions([option(1, 'One')]);
      behavior.selectOption(undefined, option(99, 'Nope'));
      expect(behavior.selectedOption()).toBeNull();
    });

    it('stops event propagation', () => {
      const behavior = new LookupBehavior(makeOptions());
      behavior.updateOptions([option(1, 'One')]);
      const event = { stopPropagation: vi.fn() } as unknown as Event;
      behavior.selectOption(event, option(1, 'One'));
      expect(event.stopPropagation).toHaveBeenCalled();
    });
  });

  describe('clearSelectedOption', () => {
    it('clears selected option', () => {
      const behavior = new LookupBehavior(makeOptions());
      behavior.setSelectedOption(option(1, 'One'));
      behavior.clearSelectedOption();
      expect(behavior.selectedOption()).toBeNull();
    });

    it('emits on optionsUpdated$', () => {
      const behavior = new LookupBehavior(makeOptions());
      const spy = vi.fn();
      behavior.optionsUpdated$.subscribe(spy);
      behavior.clearSelectedOption();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateOptions', () => {
    it('sets options and emits optionsUpdated$', () => {
      const behavior = new LookupBehavior(makeOptions());
      const spy = vi.fn();
      behavior.optionsUpdated$.subscribe(spy);
      behavior.updateOptions([option(1, 'One')]);
      expect(behavior.options()).toHaveLength(1);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('sets status to default when no status provided', () => {
      const behavior = new LookupBehavior(makeOptions());
      behavior.updateOptions([], 'loading');
      behavior.updateOptions([option(1, 'One')]);
      expect(behavior.status()).toBe('default');
    });

    it('sets status when provided', () => {
      const behavior = new LookupBehavior(makeOptions());
      behavior.updateOptions([], 'loading');
      expect(behavior.status()).toBe('loading');
    });
  });

  describe('filterOptions', () => {
    let behavior: LookupBehavior<number>;
    const opts = [
      option(1, 'Apple'),
      option(2, 'Banana'),
      option(3, 'Apricot'),
    ];

    beforeEach(() => {
      behavior = new LookupBehavior(makeOptions());
    });

    it('filters by label (case-insensitive)', () => {
      const result = behavior.filterOptions('ap', opts);
      expect(result.map((o) => o.label)).toEqual(['Apple', 'Apricot']);
    });

    it('filters by string value', () => {
      const result = behavior.filterOptions('2', opts);
      expect(result.map((o) => o.label)).toEqual(['Banana']);
    });

    it('returns empty array when nothing matches', () => {
      expect(behavior.filterOptions('xyz', opts)).toEqual([]);
    });

    it('returns all when query matches everything', () => {
      expect(behavior.filterOptions('a', opts)).toHaveLength(3);
    });
  });

  describe('selectedMatchedOption', () => {
    it('matches by strict equality when no compareWith provided', () => {
      const behavior = new LookupBehavior(makeOptions());
      behavior.updateOptions([option(1, 'One'), option(2, 'Two')]);
      behavior.selectedMatchedOption(2);
      expect(behavior.selectedOption()?.label).toBe('Two');
    });

    it('matches using compareWith when provided', () => {
      const behavior = new LookupBehavior(
        makeOptions({
          resolvers: makeResolvers({
            compare: signal(
              (a: { id: number }, b: { id: number }) => a.id === b.id,
            ),
          }),
        }),
      );
      const opts = [option({ id: 1 }, 'One'), option({ id: 2 }, 'Two')];
      behavior.updateOptions(opts);
      behavior.selectedMatchedOption({ id: 1 });
      expect(behavior.selectedOption()?.label).toBe('One');
    });

    it('sets null when value is null', () => {
      const behavior = new LookupBehavior(makeOptions());
      behavior.setSelectedOption(option(1, 'One'));
      behavior.selectedMatchedOption(null);
      expect(behavior.selectedOption()).toBeNull();
    });

    it('uses sync label resolver when no match in options', () => {
      const behavior = new LookupBehavior(
        makeOptions({
          resolvers: makeResolvers({
            label: signal((v: number) => `Label for ${v}`),
          }),
        }),
      );
      behavior.selectedMatchedOption(42);
      expect(behavior.selectedOption()).toEqual({
        value: 42,
        label: 'Label for 42',
      });
    });

    it('uses async label resolver when no match and no sync label', () => {
      const behavior = new LookupBehavior(
        makeOptions({
          resolvers: makeResolvers({
            labelAsync: signal((_v: number) => of('Async Label')),
          }),
        }),
      );
      behavior.selectedMatchedOption(99);
      expect(behavior.selectedOption()).toEqual({
        value: 99,
        label: 'Async Label',
      });
      expect(behavior.status()).toBe('default');
    });

    it('sets error status when async label resolver fails', () => {
      const behavior = new LookupBehavior(
        makeOptions({
          resolvers: makeResolvers({
            labelAsync: signal(() => throwError(() => new Error('fail'))),
          }),
        }),
      );
      behavior.selectedMatchedOption(99);
      expect(behavior.status()).toBe('error');
      expect(behavior.selectedOption()).toBeNull();
    });
  });

  describe('setupFilteredOptions', () => {
    it('emits all options when query is empty string', () => {
      const behavior = new LookupBehavior<number>(makeOptions());
      behavior.updateOptions([option(1, 'One'), option(2, 'Two')]);
      const source$ = new Subject<string>();
      behavior.setupFilteredOptions(source$, () => '');

      const results: LookupOption<number>[][] = [];
      behavior.filteredOptions.subscribe((r) => results.push(r));

      expect(results[0]).toHaveLength(2);
    });

    it('filters options when query signal returns a string', () => {
      const behavior = new LookupBehavior<number>(makeOptions());
      behavior.updateOptions([option(1, 'Apple'), option(2, 'Banana')]);
      const query = 'ban';
      const source$ = new Subject<string>();
      behavior.setupFilteredOptions(source$, () => query);

      const results: LookupOption<number>[][] = [];
      behavior.filteredOptions.subscribe((r) => results.push(r));

      source$.next('trigger');
      expect(results[results.length - 1].map((o) => o.label)).toEqual([
        'Banana',
      ]);
    });

    it('re-emits when optionsUpdated$ fires', () => {
      const behavior = new LookupBehavior<number>(makeOptions());
      const source$ = new Subject<string>();
      behavior.setupFilteredOptions(source$, () => '');

      const results: LookupOption<number>[][] = [];
      behavior.filteredOptions.subscribe((r) => results.push(r));

      behavior.updateOptions([option(1, 'One')]);
      expect(results.length).toBeGreaterThan(1);
    });
  });

  describe('setupOptionsProvider', () => {
    it('does nothing when no search resolver is provided', () => {
      const behavior = new LookupBehavior(makeOptions());
      const source$ = new Subject<string | null>();
      // should not throw
      expect(() =>
        behavior.setupOptionsProvider(source$, 300, 2),
      ).not.toThrow();
    });

    it('clears options when query is below threshold', async () => {
      const searchFn = vi.fn(() => of([option(1, 'One')]));
      const behavior = new LookupBehavior(
        makeOptions({
          resolvers: makeResolvers({ search: signal(searchFn) }),
        }),
      );
      behavior.updateOptions([option(1, 'One')]);
      const source$ = new Subject<string | null>();
      behavior.setupOptionsProvider(source$, 300, 3);

      source$.next('ab');
      expect(behavior.options()).toEqual([]);
    });

    it('triggers search after debounce when query meets threshold', async () => {
      vi.useFakeTimers();
      const searchFn = vi.fn(() => of([option(1, 'Result')]));
      const behavior = new LookupBehavior(
        makeOptions({
          resolvers: makeResolvers({ search: signal(searchFn) }),
        }),
      );
      const source$ = new Subject<string | null>();
      behavior.setupOptionsProvider(source$, 300, 2);

      source$.next('abc');
      await vi.advanceTimersByTimeAsync(300);

      expect(searchFn).toHaveBeenCalledWith('abc');
      expect(behavior.options()).toEqual([option(1, 'Result')]);
      vi.useRealTimers();
    });

    it('sets loading status while search is in-flight', async () => {
      vi.useFakeTimers();
      const searchFn = vi.fn(() => of([option(1, 'Result')]));
      const behavior = new LookupBehavior(
        makeOptions({
          resolvers: makeResolvers({ search: signal(searchFn) }),
        }),
      );
      const source$ = new Subject<string | null>();
      behavior.setupOptionsProvider(source$, 300, 2);

      source$.next('abc');
      await vi.advanceTimersByTimeAsync(300);

      // After resolution, status should reflect result count
      expect(behavior.status()).toBe('default');
      vi.useRealTimers();
    });

    it('sets empty status when search returns no results', async () => {
      vi.useFakeTimers();
      const searchFn = vi.fn(() => of([]));
      const behavior = new LookupBehavior(
        makeOptions({
          resolvers: makeResolvers({ search: signal(searchFn) }),
        }),
      );
      const source$ = new Subject<string | null>();
      behavior.setupOptionsProvider(source$, 300, 2);

      source$.next('abc');
      await vi.advanceTimersByTimeAsync(300);

      expect(behavior.status()).toBe('empty');
      vi.useRealTimers();
    });

    it('sets error status when search throws', async () => {
      vi.useFakeTimers();
      const searchFn = vi.fn(() => throwError(() => new Error('network')));
      const behavior = new LookupBehavior(
        makeOptions({
          resolvers: makeResolvers({ search: signal(searchFn) }),
        }),
      );
      const source$ = new Subject<string | null>();
      behavior.setupOptionsProvider(source$, 300, 2);

      source$.next('abc');
      await vi.advanceTimersByTimeAsync(300);

      expect(behavior.status()).toBe('error');
      vi.useRealTimers();
    });

    it('does not search while an option is selected', async () => {
      vi.useFakeTimers();
      const searchFn = vi.fn(() => of([option(1, 'Result')]));
      const behavior = new LookupBehavior(
        makeOptions({
          resolvers: makeResolvers({ search: signal(searchFn) }),
        }),
      );
      behavior.setSelectedOption(option(1, 'One'));
      const source$ = new Subject<string | null>();
      behavior.setupOptionsProvider(source$, 300, 2);

      source$.next('abc');
      await vi.advanceTimersByTimeAsync(300);

      expect(searchFn).not.toHaveBeenCalled();
      vi.useRealTimers();
    });

    it('does not fire duplicate searches for the same query', async () => {
      vi.useFakeTimers();
      const searchFn = vi.fn(() => of([option(1, 'Result')]));
      const behavior = new LookupBehavior(
        makeOptions({
          resolvers: makeResolvers({ search: signal(searchFn) }),
        }),
      );
      const source$ = new Subject<string | null>();
      behavior.setupOptionsProvider(source$, 300, 2);

      source$.next('abc');
      await vi.advanceTimersByTimeAsync(300);
      source$.next('abc');
      await vi.advanceTimersByTimeAsync(300);

      expect(searchFn).toHaveBeenCalledTimes(1);
      vi.useRealTimers();
    });
  });
});
