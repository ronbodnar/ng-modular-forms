import type { FormControl, FormGroup } from '@angular/forms';
import type { FormMapperBase } from './base/form-mapper-base';
import type { FormHandlerBase } from './base/form-handler-base';

export type FormStatus = 'idle' | 'submitting' | 'error' | 'success';

export type FormMapperRegistry = Record<string, FormMapperBase<unknown>>;

export type FormHandlerRegistry = FormHandlerBase<
  Record<string, FormControl<unknown>>
>[];

export interface FormOrchestratorOptions {
  form: FormGroup;
  mapperRegistry?: FormMapperRegistry;
  handlerRegistry?: FormHandlerRegistry;
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
