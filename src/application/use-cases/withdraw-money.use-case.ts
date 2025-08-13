import { AccountRepository } from '../../domain/repositories/account.repository';
import { CardRepository } from '../../domain/repositories/card.repository';

export class WithdrawMoneyUseCase {
  constructor(
    private readonly accounts: AccountRepository,
    private readonly cards: CardRepository
  ) {}

  async execute(input: { accountId: string; cardId: string; amount: number; atmBankId: string }) {
    const { accountId, cardId, amount, atmBankId } = input;
    if (amount <= 0) throw new Error('INVALID_AMOUNT');

    const account = await this.accounts.findById(accountId);
    if (!account) throw new Error('ACCOUNT_NOT_FOUND');

    const card = await this.cards.findById(cardId);
    if (!card) throw new Error('CARD_NOT_FOUND');
    if (card.accountId !== accountId) throw new Error('CARD_ACCOUNT_MISMATCH');
    if (!card.isActive) throw new Error('CARD_NOT_ACTIVE');
    if (card.mustChangePin) throw new Error('PIN_CHANGE_REQUIRED');
    if (amount > card.withdrawLimit) throw new Error('LIMIT_EXCEEDED');

    const sameBank = card.bankId === atmBankId;
    const commission = sameBank ? 0 : this.calculateCommission(amount);

    // Reglas: débito vs crédito
    const total = amount + commission;
    const canDebit = account.type === 'debit'
      ? account.balance >= total
      : (account.creditLimit ?? 0) - account.balance >= total;

    if (!canDebit) throw new Error('INSUFFICIENT_FUNDS');

    account.balance -= total;
    await this.accounts.save(account);

    return { success: true, amount, commission, newBalance: account.balance };
  }

  private calculateCommission(amount: number): number {
    return Math.round(amount * 0.01 * 100) / 100;
  }
}
