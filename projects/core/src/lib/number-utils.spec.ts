import { describe, it, expect } from 'vitest';
import { formatNumber, parseNumber } from './number-utils';

describe('number-utils', () => {
  describe('parseNumber', () => {
    it('returns null for null-like values', () => {
      expect(parseNumber(null)).toBeNull();
      expect(parseNumber(undefined)).toBeNull();
      expect(parseNumber('')).toBeNull();
    });

    it('returns numbers unchanged', () => {
      expect(parseNumber(123)).toBe(123);
      expect(parseNumber(-123.5)).toBe(-123.5);
    });

    it('parses formatted numeric strings', () => {
      expect(parseNumber('1,234')).toBe(1234);
      expect(parseNumber('  -1,234.50  ')).toBe(-1234.5);
    });

    it('returns null for invalid numeric strings', () => {
      expect(parseNumber('-')).toBeNull();
      expect(parseNumber('.')).toBeNull();
      expect(parseNumber('-.')).toBeNull();
      expect(parseNumber('abc')).toBeNull();
    });
  });

  describe('formatNumber', () => {
    it('returns null for empty values', () => {
      expect(formatNumber(null)).toBeNull();
      expect(formatNumber('')).toBeNull();
    });

    it('formats positive numbers and strings consistently', () => {
      expect(formatNumber(1234)).toBe('1,234');
      expect(formatNumber('1234')).toBe('1,234');
      expect(formatNumber('1,234')).toBe('1,234');
    });

    it('preserves a leading minus sign', () => {
      expect(formatNumber('-1234')).toBe('-1,234');
      expect(formatNumber(-1234)).toBe('-1,234');
    });

    it('drops non-numeric characters before formatting', () => {
      expect(formatNumber('$1,234.00')).toBe('1,234');
      expect(formatNumber('abc1234xyz')).toBe('1,234');
    });
  });
});
