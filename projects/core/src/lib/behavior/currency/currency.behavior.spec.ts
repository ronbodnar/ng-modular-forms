import { CurrencyBehavior } from './currency.behavior';

describe('CurrencyBehavior', () => {
  let behavior: CurrencyBehavior;

  beforeEach(() => {
    behavior = new CurrencyBehavior();
  });

  function createEvent(
    key: string,
    options: Partial<KeyboardEvent> & {
      value?: string;
      selectionStart?: number;
    } = {},
  ) {
    return {
      key,
      ctrlKey: false,
      metaKey: false,
      preventDefault: vi.fn(),
      target: {
        value: options.value ?? '',
        selectionStart: options.selectionStart ?? 0,
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

  it('allows a single decimal point and blocks a second one', () => {
    const first = createEvent('.', { value: '123' });
    behavior.blockNonDigitKey(first);
    expect(first.preventDefault).not.toHaveBeenCalled();

    const second = createEvent('.', { value: '1.23' });
    behavior.blockNonDigitKey(second);
    expect(second.preventDefault).toHaveBeenCalled();
  });

  it('allows a leading minus and blocks invalid minus locations', () => {
    const allowed = createEvent('-', { value: '123', selectionStart: 0 });
    behavior.blockNonDigitKey(allowed);
    expect(allowed.preventDefault).not.toHaveBeenCalled();

    const blockedLater = createEvent('-', { value: '123', selectionStart: 1 });
    behavior.blockNonDigitKey(blockedLater);
    expect(blockedLater.preventDefault).toHaveBeenCalled();

    const blockedDuplicate = createEvent('-', {
      value: '-123',
      selectionStart: 0,
    });
    behavior.blockNonDigitKey(blockedDuplicate);
    expect(blockedDuplicate.preventDefault).toHaveBeenCalled();
  });
});
