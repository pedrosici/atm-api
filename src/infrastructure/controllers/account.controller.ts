import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { GetAccountMovementsUseCase } from '../../application/use-cases/get-account-movements.use-case';
import { WithdrawMoneyUseCase } from '../../application/use-cases/withdraw-money.use-case';
import { AccountInMemoryRepository } from '../repositories/account.in-memory.repository';
import { CardInMemoryRepository } from '../repositories/card.in-memory.repository';

@Controller('accounts')
export class AccountController {
  private readonly accRepo = new AccountInMemoryRepository();
  private readonly cardRepo = new CardInMemoryRepository();
  private readonly getMovementsUC = new GetAccountMovementsUseCase(this.accRepo);
  private readonly withdrawUC = new WithdrawMoneyUseCase(this.accRepo, this.cardRepo);

  @Get(':id/movements')
  async getMovements(@Param('id') accountId: string) {
    return this.getMovementsUC.execute(accountId);
  }

  @Post(':id/withdraw')
  async withdraw(@Param('id') accountId: string, @Body() body: { cardId: string; amount: number; atmBankId: string }) {
    return this.withdrawUC.execute({ accountId, ...body });
  }
}
