import { AccountRepository } from '../../domain/repositories/account.repository';
import { Movement } from '../../domain/entities/movement.entity';

export class GetAccountMovementsUseCase {
  constructor(private readonly accountRepo: AccountRepository) {}

  async execute(accountId: string): Promise<Movement[]> {
    return this.accountRepo.getMovements(accountId);
  }
}
