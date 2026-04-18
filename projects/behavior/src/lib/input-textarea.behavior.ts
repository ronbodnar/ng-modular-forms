import { Directive, Input } from '@angular/core';
import { FormControlBase } from '@ng-modular-forms/core';

@Directive()
export class InputTextareaBehavior {
  @Input() rows: number = 5;
  @Input() cols: number = 5;

  onEnter(ctx: FormControlBase<string | null>) {
    const value = ctx.value + '\n';
    ctx.value = value;
    ctx.onChange(value);
  }

  onInput(ctx: FormControlBase<string | null>, event: Event): void {
    const value = (event.target as HTMLTextAreaElement).value;
    ctx.value = value;
    ctx.onChange(value);
  }
}
