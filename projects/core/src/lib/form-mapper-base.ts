import { FormGroup } from '@angular/forms';

export abstract class FormMapperBase<
  TModelIn = unknown,
  TModelOut = unknown,
  TFormModel = unknown,
  TStore = Record<string, unknown>,
> {
  /**
   * Maps form state + external store into an API request payload.
   */
  abstract buildRequest(form: FormGroup, store: TStore): Partial<TModelOut>;

  /**
   * Transforms a domain/API model into a form-compatible structure.
   */
  abstract transformFromModel(model: TModelIn): TFormModel;

  patchForm(
    form: FormGroup,
    data: TFormModel,
    _context: TStore,
    emitEvent: boolean = false,
  ): void {
    form.patchValue(
      {
        ...(data as Record<string, unknown>),
      },
      { emitEvent },
    );
  }

  patchFromModel(form: FormGroup, model: TModelIn, store: TStore): void {
    const formModel = this.transformFromModel(model);
    this.patchForm(form, formModel, store);
  }
}
