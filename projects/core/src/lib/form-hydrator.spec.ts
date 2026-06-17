import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { describe, it, expect, vi } from 'vitest';

import { FormHydrator } from './form-hydrator';

describe('FormHydrator', () => {
  let hydrator: FormHydrator;

  beforeEach(() => {
    hydrator = new FormHydrator();
  });

  it('hydrates primitive controls from a model', () => {
    const form = new FormGroup({ foo: new FormControl(null) });

    hydrator.hydrate(form, { foo: 'bar' });

    expect(form.value).toEqual({ foo: 'bar' });
  });

  it('hydrates form arrays of primitives and accepts empty arrays', () => {
    const form = new FormGroup({
      values: new FormArray([new FormControl(null), new FormControl(null)]),
    });

    hydrator.hydrate(form, { values: [1, 2] });

    expect(form.value).toEqual({ values: [1, 2] });

    hydrator.hydrate(form, { values: [] });

    expect(form.value).toEqual({ values: [] });
    expect((form.get('values') as FormArray).length).toBe(0);
  });

  it('adds controls when the model array grows', () => {
    const form = new FormGroup({
      values: new FormArray([new FormControl(null)]),
    });

    hydrator.hydrate(form, { values: [1, 2, 3] });

    expect(form.value).toEqual({ values: [1, 2, 3] });
    expect((form.get('values') as FormArray).length).toBe(3);
  });

  it('hydrates form arrays of groups and adds missing group controls', () => {
    const form = new FormGroup({
      items: new FormArray([new FormGroup({ foo: new FormControl(null) })]),
    });

    hydrator.hydrate(form, {
      items: [{ foo: 'a' }, { foo: 'b' }],
    });

    expect(form.value).toEqual({ items: [{ foo: 'a' }, { foo: 'b' }] });
    expect((form.get('items') as FormArray).length).toBe(2);
  });

  it('uses mapper.fromModel for a nested group and patches mapped result', () => {
    const form = new FormGroup({
      sub: new FormGroup({ foo: new FormControl(null) }),
    });

    const mapper = {
      fromModel: vi.fn(() => ({ foo: 'mapped' })),
      toRequest: vi.fn(() => ({ foo: 'mapped' })),
    };

    hydrator.hydrate(form, { sub: { foo: 'raw' } }, { sub: mapper });

    expect(mapper.fromModel).toHaveBeenCalledWith({ foo: 'raw' });
    expect(form.value).toEqual({ sub: { foo: 'mapped' } });
  });

  it('recurses into nested groups when no mapper is present', () => {
    const form = new FormGroup({
      sub: new FormGroup({ foo: new FormControl(null) }),
    });

    hydrator.hydrate(form, { sub: { foo: 'raw' } });

    expect(form.value).toEqual({ sub: { foo: 'raw' } });
  });

  it('skips patching when mapper.fromModel returns a non-record', () => {
    const form = new FormGroup({
      sub: new FormGroup({ foo: new FormControl(null) }),
    });

    const mapper = {
      fromModel: vi.fn(() => 'invalid' as unknown),
      toRequest: vi.fn(() => ({ foo: 'mapped' })),
    };

    hydrator.hydrate(form, { sub: { foo: 'raw' } }, { sub: mapper });

    expect(form.value).toEqual({ sub: { foo: null } });
  });
});
