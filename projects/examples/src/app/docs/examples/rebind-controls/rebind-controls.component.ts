import { Component, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputSelectComponent } from '@ng-modular-forms/core';
import { MatInputSelectComponent } from '@ng-modular-forms/material';

@Component({
  selector: 'app-rebind-controls',
  imports: [ReactiveFormsModule, InputSelectComponent, MatInputSelectComponent],
  template: `
    <button type="button" (click)="switchControl()">Switch Control</button>

    <button type="button" (click)="touchControl()">
      Touch Current Control
    </button>

    <p>Current: {{ active() }}</p>

    <pre>
Current touched: {{ currentControl.touched }}
Current dirty: {{ currentControl.dirty }}
Current invalid: {{ currentControl.invalid }}
<br />
Current Mat touched: {{ currentMatControl.touched }}
Current Mat dirty: {{ currentMatControl.dirty }}
Current Mat invalid: {{ currentMatControl.invalid }}
    </pre>

    <form>
      <div [formGroup]="groups[active()]">
        <nmf-select formControlName="value" label="Test" [options]="options" />
      </div>
      <div [formGroup]="groupsMat[active()]">
        <nmf-mat-select
          formControlName="value"
          label="Test"
          [options]="options"
        />
      </div>
    </form>
  `,
})
export class RebindControlsComponent {
  active = signal(0);

  groups = [
    new FormGroup({
      value: new FormControl('', Validators.required),
    }),
    new FormGroup({
      value: new FormControl('', Validators.required),
    }),
  ];

  groupsMat = [
    new FormGroup({
      value: new FormControl('', Validators.required),
    }),
    new FormGroup({
      value: new FormControl('', Validators.required),
    }),
  ];

  options = [
    { value: 'a', label: 'A' },
    { value: 'b', label: 'B' },
  ];

  get currentControl() {
    return this.groups[this.active()].controls.value;
  }

  get currentMatControl() {
    return this.groupsMat[this.active()].controls.value;
  }

  touchControl() {
    this.currentControl.markAsTouched();
    this.currentMatControl.markAsTouched();
  }

  switchControl() {
    this.active.update((value) => (value === 0 ? 1 : 0));
  }
}
