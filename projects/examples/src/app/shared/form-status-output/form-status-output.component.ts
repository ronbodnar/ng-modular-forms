import { JsonPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { FormStatus } from '@ng-modular-forms/core';
import { FormSectionComponent } from '../form-section/form-section.component';

@Component({
  selector: 'app-form-status-output',
  imports: [JsonPipe, FormSectionComponent],
  templateUrl: './form-status-output.component.html',
  styleUrl: './form-status-output.component.css',
})
export class FormStatusOutputComponent {
  status = input<FormStatus | null>(null);
  errorMessage = input<string | null>(null);
  output = input<{ [key: string]: any } | null>(null);
}
