import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { GetAccountMovementsUseCase } from '../../application/use-cases/get-account-movements.use-case';
import { WithdrawMoneyUseCase } from '../../application/use-cases/withdraw-money.use-case';
import { AccountInMemoryRepository } from '../repositories/account.in-memory.repository';

@Controller('accounts')
export class AccountController {
  private readonly repo = new AccountInMemoryRepository();
  private readonly getMovementsUC = new GetAccountMovementsUseCase(this.repo);
  private readonly withdrawUC = new WithdrawMoneyUseCase(this.repo);

  @Get(':id/movements')
  async getMovements(@Param('id') accountId: string) {
    return this.getMovementsUC.execute(accountId);
  }

  @Post(':id/withdraw')
  async withdraw(
    @Param('id') accountId: string,
    @Body() body: { amount: number; isSameBank: boolean }
  ) {
    return this.withdrawUC.execute(accountId, body.amount, body.isSameBank);
  }
}