import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FormOrchestrator } from './form-orchestrator';
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
  it('should load main handler immediately when no subhandlers are provided', () => {
    const orchestrator = new TestOrchestrator();
    const mainHandler = new MockHandler();

    orchestrator.orchestrate({
      form: new FormGroup({}),
      handlers: [mainHandler],
      mapperRegistry: {},
    });

    expect(mainHandler.calls).toBe(1);
  });
});
