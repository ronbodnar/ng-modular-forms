import type { FormControl, FormGroup } from '@angular/forms';
import type { FormMapperBase } from './base/form-mapper-base';
import type { FormHandlerBase } from './base/form-handler-base';

export type FormStatus = 'idle' | 'submitting' | 'error' | 'success';

export type MapperRegistry = Record<string, FormMapperBase<unknown>>;

export type FormHandlerRegistry = FormHandlerBase<
  Record<string, FormControl<unknown>>
>[];

export interface FormOrchestratorOptions {
  form: FormGroup;
  mapperRegistry?: MapperRegistry;
  handlerRegistry?: FormHandlerRegistry;
}

export interface ValidationMessages {
  required?: string;
  minlength?: string;
  maxlength?: string;
  min?: string;
  max?: string;
  email?: string;
  pattern?: string;
  fallback?: string;
}
