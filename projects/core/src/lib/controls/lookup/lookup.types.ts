import { DestroyRef, InputSignal } from '@angular/core';
import { Observable } from 'rxjs';

export type LookupStatus = 'default' | 'loading' | 'error' | 'empty';

export interface LookupOption<TResult> {
  value: TResult;
  label: string;
}

export interface LookupBehaviorOptions<T> {
  destroyRef: DestroyRef;
  resolvers: LookupResolvers<T>;
}

export interface LookupResolvers<T> {
  compare: InputSignal<((a: T, b: T) => boolean) | undefined>;
  label: InputSignal<((value: T | null) => string) | undefined>;
  labelAsync: InputSignal<
    ((value: T | null) => Observable<string>) | undefined
  >;
  search: InputSignal<
    ((query: string | null) => Observable<LookupOption<T>[]>) | undefined
  >;
}
