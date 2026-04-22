import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'app-form-example',
  imports: [],
  templateUrl: './form-example.component.html',
  styleUrl: './form-example.component.css',
})
export class FormExampleComponent {
  title = input<string>();
  description = input<string>();
  sourceUrl = input<string>();

  active = signal<'preview' | 'html' | 'ts'>('preview');
}
