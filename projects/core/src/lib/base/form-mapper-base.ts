export abstract class FormMapperBase<TIn = unknown, TOut = TIn, TForm = TIn> {
  public fromModel(model: TIn): TForm {
    return structuredClone(model) as unknown as TForm;
  }

  public toRequest(formValue: TForm): TOut {
    return formValue as unknown as TOut;
  }
}
