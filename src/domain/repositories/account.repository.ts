import { Account } from '../entities/account.entity';
import { Movement } from '../entities/movement.entity';

export interface AccountRepository {
  findById(accountId: string): Promise<Account | null>;
  getMovements(accountId: string): Promise<Movement[]>;
}
