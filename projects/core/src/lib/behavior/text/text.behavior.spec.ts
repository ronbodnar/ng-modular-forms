import { TextBehavior } from './text.behavior';

describe('TextBehavior', () => {
  let behavior: TextBehavior;

  beforeEach(() => {
    behavior = new TextBehavior();
  });

  it('should not show password by default', () => {
    expect(behavior.showPassword()).toBe(false);
  });

  it('should toggle show password', () => {
    behavior.toggleShowPassword();
    expect(behavior.showPassword()).toBe(true);
    behavior.toggleShowPassword();
    expect(behavior.showPassword()).toBe(false);
  });

  it('should prevent event propagation', () => {
    const event = { stopPropagation: vi.fn() } as unknown as MouseEvent;

    behavior.toggleShowPassword(event);

    expect(event.stopPropagation).toHaveBeenCalled();
  });
});
