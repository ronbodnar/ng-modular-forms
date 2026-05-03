import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';

import { FormOrchestrator } from './form-orchestrator';
import { FormHydrator } from './form-hydrator';
import { FormSerializer } from './form-serializer';
import { FormHandlerBase } from './base/form-handler-base';

class TestOrchestrator extends FormOrchestrator {}

class MockHandler extends FormHandlerBase<any> {
  calls = 0;

  getReactiveLogic(): Subscription {
    this.calls++;
    return new Subscription();
  }
}

describe('FormOrchestrator', () => {
  let orchestrator: TestOrchestrator;
  let mockHydrator: FormHydrator;
  let mockSerializer: FormSerializer;

  beforeEach(() => {
    mockHydrator = {
      hydrate: vi.fn<(form: FormGroup, model: any, registry?: any) => void>(),
    };

    mockSerializer = {
      toRequest: vi.fn<(form: FormGroup, registry: any) => any>(),
    };

    orchestrator = new TestOrchestrator(mockHydrator, mockSerializer);
  });

  it('initializes form, handlers, and mapper registry on orchestrate', () => {
    const form = new FormGroup({});
    const handler = new MockHandler();

    orchestrator.orchestrate({
      form,
      handlers: [handler],
      mapperRegistry: {},
    });

    expect(orchestrator.form()).toBe(form);
    expect(orchestrator.handlers()).toContain(handler);
    expect(handler.calls).toBe(1);
  });

  it('hydrates using mapper when present', () => {
    const form = new FormGroup({
      sub: new FormGroup({ foo: new FormControl(null) }),
    });

    const mapper = {
      toRequest: vi.fn(() => ({ foo: 'mapped' })),
      fromModel: vi.fn(() => ({ foo: 'mapped' })),
    };

    orchestrator.orchestrate({
      form,
      handlers: [],
      mapperRegistry: { sub: mapper },
    });

    orchestrator.hydrateFromModel({
      sub: { foo: 'raw' },
    });

    expect(mapper.fromModel).toHaveBeenCalledWith({ foo: 'raw' });
    expect(mockHydrator.hydrate).toHaveBeenCalledWith(form.get('sub'), {
      foo: 'mapped',
    });
  });

  it('hydrates directly when no mapper exists', () => {
    const form = new FormGroup({
      sub: new FormGroup({ foo: new FormControl(null) }),
    });

    orchestrator.orchestrate({
      form,
      handlers: [],
      mapperRegistry: {},
    });

    orchestrator.hydrateFromModel({
      sub: { foo: 'raw' },
    });

    expect(mockHydrator.hydrate).toHaveBeenCalledWith(form.get('sub'), {
      foo: 'raw',
    });
  });

  it('skips hydration if key not in model', () => {
    const form = new FormGroup({
      sub: new FormGroup({ foo: new FormControl(null) }),
    });

    orchestrator.orchestrate({
      form,
      handlers: [],
      mapperRegistry: {},
    });

    orchestrator.hydrateFromModel({ invalid: 'bar' });

    expect(mockHydrator.hydrate).not.toHaveBeenCalled();
  });

  it('delegates buildRequest to serializer', () => {
    const form = new FormGroup({});
    (mockSerializer.toRequest as Mock).mockReturnValue({ ok: true });

    orchestrator.orchestrate({
      form,
      handlers: [],
      mapperRegistry: {},
    });

    const result = orchestrator.buildRequest();

    expect(mockSerializer.toRequest).toHaveBeenCalledWith(
      form,
      orchestrator.mapperRegistry(),
    );
    expect(result).toEqual({ ok: true });
  });

  it('unsubscribes all logic on destroy', () => {
    const sub = new Subscription();
    const spy = vi.spyOn(sub, 'unsubscribe');

    orchestrator.addReactiveLogic(sub);
    orchestrator.ngOnDestroy();

    expect(spy).toHaveBeenCalled();
  });
});
