import { describe, expect, it } from 'vitest';
import { parseQevalInteger } from '../../apps/web/src/lib/wallet-balance';

describe('parseQevalInteger', () => {
  it('decodes qeval int64 payloads', () => {
    const encoded = Buffer.from('(123456 int64)').toString('base64');
    expect(parseQevalInteger(encoded)).toBe(123456);
  });

  it('returns null for malformed payloads', () => {
    expect(parseQevalInteger('not base64!')).toBeNull();
    expect(parseQevalInteger(Buffer.from('()').toString('base64'))).toBeNull();
  });
});
