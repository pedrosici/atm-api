import { WithdrawMoneyUseCase } from '../../src/application/use-cases/withdraw-money.use-case';
import { Account } from '../../src/domain/entities/account.entity';
import { Card } from '../../src/domain/entities/card.entity';
import type { AccountRepository } from '../../src/domain/repositories/account.repository';
import type { CardRepository } from '../../src/domain/repositories/card.repository';

class MockAccountRepo implements AccountRepository {
  private store = new Map<string, Account>();
  constructor(seed?: Account[]) { seed?.forEach(a => this.store.set(a.id, a)); }
  async findById(id: string) { return this.store.get(id) ?? null; }
  async save(acc: Account) { this.store.set(acc.id, acc); }
}

class MockCardRepo implements CardRepository {
  private store = new Map<string, Card>();
  constructor(seed?: Card[]) { seed?.forEach(c => this.store.set(c.id, c)); }
  async findById(id: string) { return this.store.get(id) ?? null; }
  async save(card: Card) { this.store.set(card.id, card); }
}

describe('WithdrawMoneyUseCase', () => {
  it('retira dinero mismo banco sin comisión (tarjeta activa y sin mustChangePin)', async () => {
    const acc = new Account('ACC1', 1000, 'debit');
    const card = new Card('CARD1', 'ACC1', 'BANKA', 'debit', true, false, 'hash', 1000);

    const uc = new WithdrawMoneyUseCase(
      new MockAccountRepo([acc]),
      new MockCardRepo([card]),
    );

    const res = await uc.execute({ accountId: 'ACC1', cardId: 'CARD1', amount: 100, atmBankId: 'BANKA' });
    expect(res.success).toBe(true);
    expect(res.commission).toBe(0);
    expect(res.newBalance).toBe(900);
  });

  it('falla si la tarjeta requiere cambio de PIN (mustChangePin)', async () => {
    const acc = new Account('ACC1', 1000, 'debit');
    const card = new Card('CARD1', 'ACC1', 'BANKA', 'debit', true, /*mustChangePin*/ true, 'hash', 1000);

    const uc = new WithdrawMoneyUseCase(
      new MockAccountRepo([acc]),
      new MockCardRepo([card]),
    );

    await expect(
      uc.execute({ accountId: 'ACC1', cardId: 'CARD1', amount: 50, atmBankId: 'BANKA' })
    ).rejects.toThrow('PIN_CHANGE_REQUIRED');
  });
});
