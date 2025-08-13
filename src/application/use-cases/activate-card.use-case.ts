import { CardRepository } from '../../domain/repositories/card.repository';
import { hashPin } from '../../infrastructure/security/pin-hasher';

export class ActivateCardUseCase {
  constructor(private readonly cards: CardRepository) {}

  async execute(cardId: string, pin: string) {
    const card = await this.cards.findById(cardId);
    if (!card) throw new Error('CARD_NOT_FOUND');
    if (card.isActive) throw new Error('CARD_ALREADY_ACTIVE');

    card.pinHash = await hashPin(pin);
    card.isActive = true;
    card.mustChangePin = true;

    await this.cards.save(card);
    return { cardId: card.id, isActive: card.isActive, mustChangePin: card.mustChangePin };
  }
}
