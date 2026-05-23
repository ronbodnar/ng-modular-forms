export abstract class FormMapperBase<
  TIn = unknown,
  TOut = TIn,
  TForm = TIn,
  TOptions extends object = object,
> {
  public fromModel(model: TIn): TForm {
    return structuredClone(model) as unknown as TForm;
  }

  public toRequest(formValue: TForm, _options?: TOptions): TOut {
    return formValue as unknown as TOut;
  }
}
