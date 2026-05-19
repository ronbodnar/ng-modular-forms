import { describe, it, expect } from 'vitest';
import { FormMapperBase } from './form-mapper-base';

describe('FormMapperBase', () => {
  class TestMapper extends FormMapperBase<
    { a: number },
    { a: number },
    { a: number }
  > {}

  const mapper = new TestMapper();

  it('clones model with fromModel by default', () => {
    const model = { a: 1 };
    const result = mapper.fromModel(model);

    expect(result).toEqual(model);
    expect(result).not.toBe(model);
  });

  it('returns form value unchanged with toRequest by default', () => {
    const formValue = { a: 2 };
    expect(mapper.toRequest(formValue)).toEqual(formValue);
  });
});
