import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { FormSubmitButtonComponent } from '../../shared/form-submit-button/form-submit-button.component';
import { merge } from 'rxjs';

export interface Step {
  label: string;
  form: FormGroup;
  error?: boolean;
}

@Component({
  selector: 'app-step-wrapper',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    FormSubmitButtonComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './step-wrapper.component.html',
})
export class StepWrapperComponent implements OnInit {
  readonly stepChange = output<number>();

  readonly submitting = input<boolean>(false);
  readonly _steps = input<Step[]>([], { alias: 'steps' });

  private readonly _stepsTick = signal(0);
  private readonly _currentStep = signal(1);

  readonly currentStep = this._currentStep.asReadonly();

  steps = computed(() => {
    this._stepsTick();

    console.log('Running steps calc');

    return this._steps().map((step) => ({
      ...step,
      invalid: step.form.invalid && step.form.touched,
    }));
  });

  ngOnInit() {
    const forms = this._steps().map((s) => s.form);

    merge(
      ...forms.map((f) => f.valueChanges),
      ...forms.map((f) => f.statusChanges),
    ).subscribe(() => this._stepsTick.update((v) => v + 1));
  }

  setCurrentStep(step: number) {
    const lastStep = this._currentStep();
    this._currentStep.set(step);
    this.stepChange.emit(step);
    this.getStep(lastStep).form.markAllAsTouched();
  }

  getStep(step: number = this.currentStep()): Step {
    const steps = this._steps();
    if (step < 0 || step > this._steps().length) {
      return steps[this.currentStep() - 1];
    }
    return steps[step - 1];
  }

  goToStep(step: number) {
    if (this._currentStep() === step) return;
    this.setCurrentStep(Math.min(Math.max(step, 1), this._steps().length));
  }

  nextStep() {
    const currentForm = this.getStep().form as FormGroup;
    if (!currentForm.valid) {
      currentForm.markAllAsTouched();
      return;
    }

    this.setCurrentStep(Math.min(this.currentStep() + 1, this._steps().length));
  }

  prevStep() {
    this.setCurrentStep(Math.max(this.currentStep() - 1, 1));
  }
}
