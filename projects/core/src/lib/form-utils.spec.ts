import { FormControl, FormGroup } from '@angular/forms';
import { describe, it, expect } from 'vitest';

import { getControl, getControlValue } from './form-utils';

describe('form-utils', () => {
  it('throws when no form instance is provided', () => {
    expect(() => getControl('foo', null as unknown as FormGroup)).toThrow(
      'Missing form instance while getting the control of "foo"',
    );
  });

  it('throws when the requested control does not exist', () => {
    const form = new FormGroup({ bar: new FormControl('value') });
    expect(() => getControl('foo', form)).toThrow(
      'Missing control "foo" in form',
    );
  });

  it('returns null when the control value is an empty string', () => {
    const form = new FormGroup({ foo: new FormControl('') });
    expect(getControlValue('foo', form)).toBeNull();
  });

  it('parses comma-formatted numeric strings into numbers', () => {
    const form = new FormGroup({ foo: new FormControl('1,234') });
    expect(getControlValue('foo', form)).toBe(1234);
  });

  it('returns raw strings for non-numeric values', () => {
    const form = new FormGroup({ foo: new FormControl('abc') });
    expect(getControlValue('foo', form)).toBe('abc');
  });
});
