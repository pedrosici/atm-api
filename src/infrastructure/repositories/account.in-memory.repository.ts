import { AccountRepository } from '../../domain/repositories/account.repository';
import { Account } from '../../domain/entities/account.entity';
import { Movement } from '../../domain/entities/movement.entity';

export class AccountInMemoryRepository implements AccountRepository {
  private accounts: Account[] = [
    new Account('1', 1000, 'debit'),
    new Account('2', 500, 'credit', 2000)
  ];

  private movements: Movement[] = [
    new Movement('m1', '1', 'deposit', 500, new Date()),
    new Movement('m2', '1', 'withdrawal', 200, new Date()),
    new Movement('m3', '2', 'commission', 15, new Date())
  ];

  async findById(accountId: string): Promise<Account | null> {
    return this.accounts.find(a => a.id === accountId) || null;
  }

  async getMovements(accountId: string): Promise<Movement[]> {
    return this.movements.filter(m => m.accountId === accountId);
  }
}
