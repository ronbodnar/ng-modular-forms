import { FormGroup, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FormOrchestratorBase } from './form-orchestrator-base';
import { FormHandlerBase } from './form-handler-base';

class TestOrchestrator extends FormOrchestratorBase {}

class MockHandler extends FormHandlerBase<string> {
  calls = 0;

  getReactiveLogic(): Subscription {
    this.calls++;
    return new Subscription();
  }
}

describe('FormOrchestratorBase', () => {
  it('should load main handler immediately when no subhandlers are provided', () => {
    const orchestrator = new TestOrchestrator();
    const form = new FormGroup({});
    const mainHandler = new MockHandler();

    orchestrator.initialize(form, { mainHandler });

    expect(mainHandler.calls).toBe(1);
  });

  it('should wait for all subhandlers before loading main handler', () => {
    const orchestrator = new TestOrchestrator();
    const form = new FormGroup({});

    const mainHandler = new MockHandler();
    const subA = new MockHandler();
    const subB = new MockHandler();

    orchestrator.initialize(form, {
      mainHandler,
      subHandlers: {
        a: subA,
        b: subB,
      },
    });

    orchestrator.onSubformReady(new FormGroup({}), 'a');
    expect(mainHandler.calls).toBe(0);

    orchestrator.onSubformReady(new FormGroup({}), 'b');
    expect(mainHandler.calls).toBe(1);
  });

  it('should flatten subform controls into main form by default', () => {
    const orchestrator = new TestOrchestrator();
    const form = new FormGroup({});

    const subform = new FormGroup({
      field: new FormControl('value'),
    });

    orchestrator.initialize(form);
    orchestrator.onSubformReady(subform, 'group');

    expect(orchestrator.form().get('field')).toBeTruthy();
  });
});
