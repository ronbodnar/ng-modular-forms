import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { describe, it, expect, vi } from 'vitest';

import { FormSerializer } from './form-serializer';

describe('FormSerializer', () => {
  let serializer: FormSerializer;

  beforeEach(() => {
    serializer = new FormSerializer();
  });

  it('serializes a form group into a plain request object', () => {
    const form = new FormGroup({
      foo: new FormControl(1),
      sub: new FormGroup({ bar: new FormControl('value') }),
    });

    expect(serializer.toRequest(form)).toEqual({
      foo: 1,
      sub: { bar: 'value' },
    });
  });

  it('serializes a form array of primitives into an array', () => {
    const form = new FormGroup({
      values: new FormArray([new FormControl(1), new FormControl(2)]),
    });

    expect(serializer.toRequest(form)).toEqual({ values: [1, 2] });
  });

  it('serializes a form array of groups into an array of objects', () => {
    const form = new FormGroup({
      items: new FormArray([
        new FormGroup({ foo: new FormControl('a') }),
        new FormGroup({ foo: new FormControl('b') }),
      ]),
    });

    expect(serializer.toRequest(form)).toEqual({
      items: [{ foo: 'a' }, { foo: 'b' }],
    });
  });

  it('applies mapper.toRequest for nested groups', () => {
    const form = new FormGroup({
      sub: new FormGroup({ bar: new FormControl('value') }),
    });

    const mapper = {
      fromModel: vi.fn(() => ({ bar: 'mapped' })),
      toRequest: vi.fn(() => ({ bar: 'mapped' })),
    };

    const result = serializer.toRequest(form, { sub: mapper });

    expect(mapper.toRequest).toHaveBeenCalledWith({ bar: 'value' }, undefined);
    expect(result).toEqual({ sub: { bar: 'mapped' } });
  });
});
