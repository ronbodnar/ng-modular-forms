import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { FormSubmitButtonComponent } from '../../shared/form-submit-button/form-submit-button.component';

export interface Step {
  label: string;
  form: FormGroup;
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
export class StepWrapperComponent {
  readonly steps = input<Step[]>([]);
  readonly form = input.required<FormGroup>();
  readonly submitting = input<boolean>(false);

  readonly stepChange = output<number>();

  private readonly _currentStep = signal(1);

  readonly currentStep = this._currentStep.asReadonly();

  setCurrentStep(step: number) {
    this._currentStep.set(step);
    this.stepChange.emit(step);
  }

  getStep(step: number = this.currentStep()): Step {
    return this.steps()[step - 1];
  }

  goToStep(step: number) {
    this.setCurrentStep(Math.min(Math.max(step, 1), this.steps().length));
  }

  nextStep() {
    console.log('nextStep', this.getStep());
    const currentForm = this.getStep().form as FormGroup;
    if (!currentForm.valid) {
      currentForm.markAllAsTouched();
      return;
    }
    this.setCurrentStep(Math.min(this.currentStep() + 1, this.steps().length));
  }

  prevStep() {
    this.setCurrentStep(Math.max(this.currentStep() - 1, 1));
  }
}
