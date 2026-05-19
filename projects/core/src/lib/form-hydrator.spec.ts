import { FormControl, FormGroup } from '@angular/forms';
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
