import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { describe, it, expect } from 'vitest';

import { FormHandlerBase } from './form-handler-base';

type Controls = { foo: FormControl };

class TestHandler extends FormHandlerBase<Controls> {
  getReactiveLogic(): Subscription {
    return new Subscription();
  }
}

describe('FormHandlerBase', () => {
  it('registers controls and exposes valueChanges', () => {
    const form = new FormGroup({ foo: new FormControl(0) });
    const handler = new TestHandler();
    handler.initializeForm(form);

    const changes = [] as number[];
    handler.valueChangesOf('foo').subscribe((value) => {
      changes.push(value);
    });

    form.get('foo')?.setValue(42);
    expect(changes).toEqual([42]);
  });

  it('throws when valueChangesOf is called for an unregistered control', () => {
    const handler = new TestHandler();
    expect(() => handler.valueChangesOf('foo')).toThrow(
      'Missing form instance while getting the control of "foo"',
    );
  });
});
