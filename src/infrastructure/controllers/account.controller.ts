import { Controller, Get, Param } from '@nestjs/common';
import { GetAccountMovementsUseCase } from '../../application/use-cases/get-account-movements.use-case';
import { AccountInMemoryRepository } from '../repositories/account.in-memory.repository';

@Controller('accounts')
export class AccountController {
  private readonly useCase: GetAccountMovementsUseCase;

  constructor() {
    const repo = new AccountInMemoryRepository();
    this.useCase = new GetAccountMovementsUseCase(repo);
  }

  @Get(':id/movements')
  async getMovements(@Param('id') accountId: string) {
    return this.useCase.execute(accountId);
  }
}
