import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-form-submit-button',
  imports: [MatProgressSpinner, MatProgressBarModule, MatButtonModule],
  templateUrl: './form-submit-button.component.html',
  styleUrl: './form-submit-button.component.css',
})
export class FormSubmitButtonComponent {
  label = input<string>('Submit');
  loading = input<boolean>(false);
}
