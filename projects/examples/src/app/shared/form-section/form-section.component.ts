import { Component, input } from '@angular/core';

@Component({
  selector: 'app-form-section',
  imports: [],
  templateUrl: './form-section.component.html',
  styleUrl: './form-section.component.css',
})
export class FormSectionComponent {
  title = input<string>();
}
