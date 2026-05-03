import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StepWrapperComponent, Step } from './step-wrapper.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';

describe('StepWrapperComponent', () => {
  let fixture: ComponentFixture<StepWrapperComponent>;

  const createStep = (valid = true): Step => {
    const control = new FormControl(
      valid ? 'value' : '',
      valid ? [] : [Validators.required],
    );

    return {
      label: 'Step',
      form: new FormGroup({
        field: control,
      }),
    };
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepWrapperComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StepWrapperComponent);
  });

  function setSteps(steps: Step[]) {
    fixture.componentRef.setInput('steps', steps);
    fixture.detectChanges();
  }

  it('starts at step 1', () => {
    setSteps([createStep(), createStep()]);
    expect(fixture.componentInstance.currentStep()).toBe(1);
  });

  it('advances step when valid', () => {
    setSteps([createStep(true), createStep(true)]);

    fixture.componentInstance.nextStep();

    expect(fixture.componentInstance.currentStep()).toBe(2);
  });

  it('blocks advancement when invalid and marks touched', () => {
    const step = createStep(false);
    setSteps([step, createStep(true)]);

    const spy = vi.spyOn(step.form, 'markAllAsTouched');

    fixture.componentInstance.nextStep();

    expect(fixture.componentInstance.currentStep()).toBe(1);
    expect(spy).toHaveBeenCalled();
  });

  it('emits step change on navigation', () => {
    setSteps([createStep(), createStep()]);

    const emitSpy = vi.spyOn(fixture.componentInstance.stepChange, 'emit');

    fixture.componentInstance.goToStep(2);

    expect(emitSpy).toHaveBeenCalledWith(2);
  });

  it('computes invalid step state when touched + invalid', () => {
    const step = createStep(false);
    setSteps([step]);

    step.form.get('field')?.markAsTouched();
    step.form.get('field')?.setErrors({ required: true });

    expect(fixture.componentInstance.steps()[0].invalid).toBe(true);
  });
});
