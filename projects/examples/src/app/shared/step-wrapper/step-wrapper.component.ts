import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
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
  private readonly cdr = inject(ChangeDetectorRef);

  readonly steps = input<Step[]>([], { alias: 'steps' });
  readonly form = input.required<FormGroup>();
  readonly submitting = input<boolean>(false);

  readonly stepChange = output<number>();

  private readonly _currentStep = signal(1);

  readonly currentStep = this._currentStep.asReadonly();

  ngOnInit() {
    const form = this.form();

    merge(form.valueChanges, form.statusChanges).subscribe(() => {
      this.cdr.markForCheck();
    });
  }

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
