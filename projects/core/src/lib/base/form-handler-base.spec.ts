import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { describe, it, expect } from 'vitest';

import { FormHandlerBase } from './form-handler-base';

class TestHandler extends FormHandlerBase<'foo'> {
  getReactiveLogic(): Subscription {
    return new Subscription();
  }
}

describe('FormHandlerBase', () => {
  it('registers controls and exposes valueChanges', () => {
    const form = new FormGroup({ foo: new FormControl(0) });
    const handler = new TestHandler();
    handler.registerControls(form, ['foo']);

    const changes = [] as number[];
    handler.valueChangesOf<number>('foo').subscribe((value) => {
      changes.push(value);
    });

    form.get('foo')?.setValue(42);
    expect(changes).toEqual([42]);
  });

  it('throws when valueChangesOf is called for an unregistered control', () => {
    const handler = new TestHandler();
    expect(() => handler.valueChangesOf('foo')).toThrow(
      'Control with name: "foo" not found. Ensure it is registered in registerControls(...) before usage.',
    );
  });
});
