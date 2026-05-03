import { FormGroup } from '@angular/forms';
import { FormMapperBase } from './base/form-mapper-base';
import { FormHandlerBase } from './base/form-handler-base';

export type FormStatus = 'idle' | 'submitting' | 'error' | 'success';

export type MapperRegistry = Record<string, FormMapperBase<any, any, any>>;

export type FormHandlerRegistry = FormHandlerBase[];

export interface FormOrchestratorOptions {
  form: FormGroup;
  handlers: FormHandlerRegistry;
  mapperRegistry: MapperRegistry;
}
