export abstract class FormMapperBase<
  TModel = unknown,
  TRequest = TModel,
  TForm = TModel,
  TOptions extends object = object,
> {
  public fromModel(model: TModel): TForm {
    return structuredClone(model) as unknown as TForm;
  }

  public toRequest(formValue: TForm, _options?: TOptions): TRequest {
    return formValue as unknown as TRequest;
  }
}
