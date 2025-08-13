import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ActivateCardUseCase } from '../../application/use-cases/activate-card.use-case';
import { ChangePinUseCase } from '../../application/use-cases/change-pin.use-case';
import { CardInMemoryRepository } from '../repositories/card.in-memory.repository';

@Controller('cards')
export class CardController {
  private readonly cardRepo = new CardInMemoryRepository();
  private readonly activateUC = new ActivateCardUseCase(this.cardRepo);
  private readonly changePinUC = new ChangePinUseCase(this.cardRepo);

  @Post(':cardId/activate')
  async activate(@Param('cardId') cardId: string, @Body() body: { pin: string }) {
    return this.activateUC.execute(cardId, body.pin);
  }

  @Post(':cardId/change-pin')
  async changePin(
    @Param('cardId') cardId: string,
    @Body() body: { oldPin?: string; newPin: string }
  ) {
    return this.changePinUC.execute(cardId, body);
  }

  @Get(':cardId/config')
  async getConfig(@Param('cardId') cardId: string) {
    const card = await this.cardRepo.findById(cardId);
    if (!card) throw new Error('CARD_NOT_FOUND');
    return { withdrawLimit: card.withdrawLimit };
  }

  @Put(':cardId/config/limit')
  async setLimit(@Param('cardId') cardId: string, @Body() body: { withdrawLimit: number }) {
    const card = await this.cardRepo.findById(cardId);
    if (!card) throw new Error('CARD_NOT_FOUND');
    const limit = Number(body.withdrawLimit);
    if (isNaN(limit) || limit < 500 || limit > 6000) throw new Error('INVALID_LIMIT');
    card.withdrawLimit = limit;
    await this.cardRepo.save(card);
    return { withdrawLimit: card.withdrawLimit };
  }
}
