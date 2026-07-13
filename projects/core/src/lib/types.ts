import type { AbstractControl, FormGroup } from '@angular/forms';
import type { FormMapperBase } from './base/form-mapper-base';
import type { FormHandlerBase } from './base/form-handler-base';

export type FormStatus = 'idle' | 'submitting' | 'error' | 'success';

export type FormMapperRegistry = Record<
  string,
  FormMapperBase<unknown, unknown, unknown, object>
>;

export type FormHandlerRegistry = FormHandlerBase<
  Record<string, AbstractControl>
>[];

export interface FormOrchestratorOptions<
  TMapperRegistry extends FormMapperRegistry = FormMapperRegistry,
  THandlerRegistry extends FormHandlerRegistry = FormHandlerRegistry,
> {
  form: FormGroup;
  mapperRegistry?: TMapperRegistry;
  handlerRegistry?: THandlerRegistry;
}

export interface NmfTranslations {
  fileSelector?: {
    filesSelected?: string;
  };

  validationMessages?: Partial<ValidationMessages>;
}

export interface ValidationMessages {
  required?: string;
  minLength?: string;
  maxLength?: string;
  min?: string;
  max?: string;
  email?: string;
  pattern?: string;
  fallback?: string;
}
