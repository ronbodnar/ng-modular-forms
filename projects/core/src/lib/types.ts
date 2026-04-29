import { FormGroup } from '@angular/forms';
import { FormHandlerBase, FormMapperBase } from '@ng-modular-forms/core';

export type FormStatus = 'idle' | 'submitting' | 'error' | 'success';

export type MapperRegistry = Record<string, FormMapperBase<any, any, any>>;

export type FormHandlerRegistry = FormHandlerBase[];

export interface FormOrchestratorOptions {
  form: FormGroup;
  handlers: FormHandlerRegistry;
  mapperRegistry: MapperRegistry;
}
