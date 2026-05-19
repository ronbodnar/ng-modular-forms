import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';

import { FormOrchestrator } from './form-orchestrator';
import { FormHydrator } from './form-hydrator';
import { FormSerializer } from './form-serializer';
import { FormHandlerBase } from './base/form-handler-base';

class TestOrchestrator extends FormOrchestrator {}

class MockHandler extends FormHandlerBase<string> {
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
      hydrate: vi.fn(),
    } as unknown as FormHydrator;

    mockSerializer = {
      toRequest: vi.fn(),
    } as unknown as FormSerializer;

    orchestrator = new TestOrchestrator(mockHydrator, mockSerializer);
  });

  it('initializes form, handlers, and mapper registry on orchestrate', () => {
    const form = new FormGroup({});
    const handler = new MockHandler();

    orchestrator.orchestrate({
      form,
      handlerRegistry: [handler],
      mapperRegistry: {},
    });

    expect(orchestrator.form()).toBe(form);
    expect(orchestrator.handlerRegistry()).toContain(handler);
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
      handlerRegistry: [],
      mapperRegistry: { sub: mapper },
    });

    orchestrator.hydrateFromModel({
      sub: { foo: 'raw' },
    });

    expect(mapper.fromModel).toHaveBeenCalledWith({ foo: 'raw' });
    expect(mockHydrator.hydrate).toHaveBeenCalledWith(
      expect.any(FormGroup),
      expect.objectContaining({ foo: 'mapped' }),
    );
  });

  it('hydrates directly when no mapper exists', () => {
    const form = new FormGroup({
      sub: new FormGroup({ foo: new FormControl(null) }),
    });

    orchestrator.orchestrate({
      form,
      handlerRegistry: [],
      mapperRegistry: {},
    });

    orchestrator.hydrateFromModel({
      sub: { foo: 'raw' },
    });

    expect(mockHydrator.hydrate).toHaveBeenCalledWith(
      expect.any(FormGroup),
      expect.objectContaining({ foo: 'raw' }),
    );
  });

  it('skips hydration if key not in model', () => {
    const form = new FormGroup({
      sub: new FormGroup({ foo: new FormControl(null) }),
    });

    orchestrator.orchestrate({
      form,
      handlerRegistry: [],
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
      handlerRegistry: [],
      mapperRegistry: {},
    });

    const result = orchestrator.buildRequest();

    expect(mockSerializer.toRequest).toHaveBeenCalledWith(
      form,
      orchestrator.mapperRegistry(),
    );
    expect(result).toEqual({ ok: true });
  });

  it('sets form state using setForm and returns subform by key', () => {
    const firstForm = new FormGroup({});
    const secondForm = new FormGroup({ sub: new FormGroup({}) });

    orchestrator.orchestrate({
      form: firstForm,
      handlerRegistry: [],
      mapperRegistry: {},
    });

    orchestrator.setForm(secondForm);

    expect(orchestrator.form()).toBe(secondForm);
    expect(orchestrator.getSubForm('sub')).toBeInstanceOf(FormGroup);
  });

  it('manages status and error state through setters', () => {
    orchestrator.setStatus('submitting');
    orchestrator.setErrorMessage('failed');

    expect(orchestrator.status()).toBe('submitting');
    expect(orchestrator.errorMessage()).toBe('failed');
  });

  it('unsubscribes all logic on destroy', () => {
    const sub = new Subscription();
    const unsubscribeSpy = vi.spyOn(sub, 'unsubscribe');

    orchestrator.addReactiveLogic(sub);
    orchestrator.ngOnDestroy();

    expect(unsubscribeSpy).toHaveBeenCalled();
  });
});
