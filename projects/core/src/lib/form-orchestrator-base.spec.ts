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

    orchestrator.initialize(form, [mainHandler]);

    expect(mainHandler.calls).toBe(1);
  });
});
