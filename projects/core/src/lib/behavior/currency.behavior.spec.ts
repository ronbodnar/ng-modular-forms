import { CurrencyBehavior } from './currency.behavior';

describe('CurrencyBehavior', () => {
  let behavior: CurrencyBehavior;

  beforeEach(() => {
    behavior = new CurrencyBehavior();
  });

  function createEvent(
    key: string,
    options: Partial<KeyboardEvent> & { value?: string } = {},
  ) {
    return {
      key,
      ctrlKey: false,
      metaKey: false,
      preventDefault: vi.fn(),
      target: {
        value: '',
      },
      ...options,
    } as unknown as KeyboardEvent;
  }

  it('blocks alpha characters', () => {
    const event = createEvent('g');
    behavior.blockNonDigitKey(event);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('allows digit characters', () => {
    const event = createEvent('3');
    behavior.blockNonDigitKey(event);
    expect(event.preventDefault).not.toHaveBeenCalled();
  });

  it('allows ctrl key combinations (copy/paste)', () => {
    const event = createEvent('v', { ctrlKey: true });
    behavior.blockNonDigitKey(event);
    expect(event.preventDefault).not.toHaveBeenCalled();
  });

  it('allows meta key combinations (mac)', () => {
    const event = createEvent('v', { metaKey: true });
    behavior.blockNonDigitKey(event);
    expect(event.preventDefault).not.toHaveBeenCalled();
  });

  it('blocks special non-numeric characters', () => {
    const event = createEvent('$');
    behavior.blockNonDigitKey(event);
    expect(event.preventDefault).toHaveBeenCalled();
  });
});
