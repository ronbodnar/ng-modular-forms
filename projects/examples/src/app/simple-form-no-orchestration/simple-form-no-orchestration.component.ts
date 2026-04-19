import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInputTextComponent } from '@ng-modular-forms/material';

@Component({
  selector: 'app-simple-form-no-orchestration',
  imports: [ReactiveFormsModule, MatInputTextComponent],
  templateUrl: './simple-form-no-orchestration.component.html',
  styleUrl: './simple-form-no-orchestration.component.css',
})
export class SimpleFormNoOrchestrationComponent {
  form = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  submit() {
    console.log('ok');
    if (!this.form.valid) {
      console.log('Form contains invalid fields or errors:', this.form.errors);
      this.form.markAllAsTouched();
      return;
    }

    console.log('Form submitted successfully', this.form.value);
  }

  update() {
    console.log('Form before:', this.form.get('username')?.value);
    this.form.get('username')?.setValue('Ron Bodnar');
    console.log('Form after:', this.form.get('username')?.value);
  }
}
