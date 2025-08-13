import { AccountRepository } from '../../domain/repositories/account.repository';

export class WithdrawMoneyUseCase {
  constructor(private readonly accountRepo: AccountRepository) {}

  async execute(accountId: string, amount: number, isSameBank: boolean): Promise<{ success: boolean; message: string }> {
    const account = await this.accountRepo.findById(accountId);
    if (!account) return { success: false, message: 'Account not found' };

    if (!account.isCardActive) {
      return { success: false, message: 'Card not active' };
    }

    const commission = isSameBank ? 0 : this.calculateCommission(amount);

    if (!account.canWithdraw(amount + commission)) {
      return { success: false, message: 'Insufficient funds or limit exceeded' };
    }

    account.applyWithdrawal(amount, commission);
    await this.accountRepo.save(account);

    return { success: true, message: `Withdrawn ${amount} with commission ${commission}` };
  }

  private calculateCommission(amount: number): number {
    return Math.round(amount * 0.01 * 100) / 100;
  }
}
