import { hashPin, verifyPin } from '../../src/infrastructure/security/pin-hasher';

describe('pin-hasher', () => {
  it('hash + verify funciona y no guarda el PIN en claro', async () => {
    const pin = '1234';
    const hash = await hashPin(pin);

    expect(hash).toBeDefined();
    expect(hash).not.toBe(pin);

    const ok = await verifyPin(pin, hash);
    const ko = await verifyPin('9999', hash);

    expect(ok).toBe(true);
    expect(ko).toBe(false);
  });
});
