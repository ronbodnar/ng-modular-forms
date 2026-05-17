import type { FormGroup } from '@angular/forms';
import type { FormMapperBase } from './base/form-mapper-base';
import type { FormHandlerBase } from './base/form-handler-base';

export type FormStatus = 'idle' | 'submitting' | 'error' | 'success';

export type MapperRegistry = Record<
  string,
  FormMapperBase<unknown, unknown, unknown>
>;

export type FormHandlerRegistry = FormHandlerBase[];

export interface FormOrchestratorOptions {
  form: FormGroup;
  mapperRegistry?: MapperRegistry;
  handlerRegistry?: FormHandlerRegistry;
}
